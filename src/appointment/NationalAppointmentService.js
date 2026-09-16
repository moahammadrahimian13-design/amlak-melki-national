/**
 * National Appointment Service - نوبت‌دهی با کد ملی
 * 
 * اصل: نوبت فقط با کد ملی و بر اساس زنجیره واقعی
 */

const logger = require('../core/logger');
const eventBus = require('../core/eventBus');
const auditLogger = require('../audit/AuditLogger');
const CitizenService = require('./CitizenService');
const ChainValidator = require('./ChainValidator');
const {
    ValidationError,
    NotFoundError,
    ForbiddenError
} = require('../core/errors');

class NationalAppointmentService {
    constructor() {
        this.citizen = new CitizenService();
        this.validator = new ChainValidator();
    }

    /**
     * ⭐ ثبت نوبت با کد ملی
     */
    async bookAppointment(data) {
        const { national_code, office_type, service_type, work_code } = data;

        // ۱. اعتبارسنجی کد ملی
        if (!this.citizen.isValidNationalCode(national_code)) {
            throw new ValidationError('کد ملی نامعتبر است');
        }

        // ۲. بررسی شهروند
        const citizenStatus = await this.citizen.checkStatus(national_code);

        if (!citizenStatus.exists) {
            throw new NotFoundError('اطلاعات شهروند یافت نشد. ابتدا ثبت‌نام کنید');
        }

        if (!citizenStatus.can_book) {
            throw new ForbiddenError(
                `امکان ثبت نوبت وجود ندارد. دلیل: ${citizenStatus.restrictions[0]?.reason || 'حساب غیرفعال'}`
            );
        }

        // ۳. بررسی محدودیت تعداد نوبت
        await this.checkAppointmentLimit(national_code, office_type);

        // ۴. پیدا کردن اسلات آزاد
        const slot = await this.findAvailableSlot(
            office_type,
            data.preferred_date || new Date()
        );

        if (!slot) {
            throw new ValidationError('هیچ اسلات آزادی موجود نیست');
        }

        // ۵. ثبت نوبت
        const appointment = await this.saveAppointment({
            ...data,
            national_code,
            full_name: citizenStatus.profile.full_name,
            phone: citizenStatus.profile.phone || data.phone,
            appointment_date: slot.date,
            start_time: slot.start_time,
            end_time: slot.end_time,
            slot_number: slot.slot_number,
            status: 'pending',
            appointment_code: this.generateCode()
        });

        // ۶. لاگ
        await auditLogger.log({
            user_national_code: national_code,
            action_type: 'appointment_booked',
            action_category: 'appointment',
            resource_type: 'national_appointment',
            resource_id: appointment.id.toString(),
            description: `نوبت در ${office_type}`,
            status: 'success'
        });

        // ۷. رویداد
        eventBus.emit('appointment.booked', {
            appointment_id: appointment.id,
            national_code,
            office_type
        });

        return appointment;
    }

    /**
     * بررسی محدودیت تعداد نوبت
     */
    async checkAppointmentLimit(nationalCode, officeType) {
        const db = require('../core/database');

        const [rows] = await db.query(
            `SELECT COUNT(*) as count 
             FROM national_appointments 
             WHERE national_code = ? 
               AND office_type = ?
               AND status IN ('pending', 'confirmed')
               AND appointment_date >= CURDATE()`,
            [nationalCode, officeType]
        );

        if (rows[0].count >= 3) {
            throw new ValidationError(
                'شما ۳ نوبت فعال در این اداره دارید'
            );
        }
    }

    /**
     * پیدا کردن اسلات آزاد
     */
    async findAvailableSlot(officeType, fromDate) {
        const db = require('../core/database');

        const [config] = await db.query(
            `SELECT * FROM office_calendars 
             WHERE office_type = ? AND is_active = TRUE
             LIMIT 1`,
            [officeType]
        );

        if (!config[0]) return null;
        const officeConfig = config[0];

        for (let i = 0; i < 30; i++) {
            const date = new Date(fromDate);
            date.setDate(date.getDate() + i);

            // چک جمعه
            if (date.getDay() === 5) continue;

            const dateStr = date.toISOString().split('T')[0];

            const [booked] = await db.query(
                `SELECT COUNT(*) as count 
                 FROM national_appointments 
                 WHERE office_type = ?
                   AND appointment_date = ?
                   AND status IN ('pending', 'confirmed')`,
                [officeType, dateStr]
            );

            if (booked[0].count < officeConfig.daily_capacity) {
                const slot = await this.findFirstFreeSlot(
                    officeType, dateStr, officeConfig
                );
                if (slot) return slot;
            }
        }

        return null;
    }

    /**
     * پیدا کردن اولین ساعت آزاد
     */
    async findFirstFreeSlot(officeType, dateStr, config) {
        const db = require('../core/database');

        const opening = config.opening_time || '08:00:00';
        const closing = config.closing_time || '16:00:00';
        const lunchStart = config.lunch_break_start || '12:00:00';
        const lunchEnd = config.lunch_break_end || '13:00:00';
        const duration = config.slot_duration || 15;

        const [booked] = await db.query(
            `SELECT start_time FROM national_appointments 
             WHERE office_type = ? 
               AND appointment_date = ?
               AND status IN ('pending', 'confirmed')`,
            [officeType, dateStr]
        );

        const bookedTimes = new Set(booked.map(b => b.start_time));

        let current = this.toMinutes(opening);
        const closingMin = this.toMinutes(closing);
        const lunchStartMin = this.toMinutes(lunchStart);
        const lunchEndMin = this.toMinutes(lunchEnd);

        while (current + duration <= closingMin) {
            if (!(current < lunchEndMin && current + duration > lunchStartMin)) {
                const startTime = this.toTime(current);

                if (!bookedTimes.has(startTime)) {
                    return {
                        date: dateStr,
                        start_time: startTime,
                        end_time: this.toTime(current + duration),
                        slot_number: Math.floor(
                            (current - this.toMinutes(opening)) / duration
                        ) + 1
                    };
                }
            }
            current += duration;
        }

        return null;
    }

    /**
     * ذخیره نوبت
     */
    async saveAppointment(data) {
        const db = require('../core/database');

        const [result] = await db.query(
            `INSERT INTO national_appointments 
             (appointment_code, national_code, phone, full_name,
              office_type, service_type, work_code,
              appointment_date, start_time, end_time,
              slot_number, status, priority)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.appointment_code,
                data.national_code,
                data.phone,
                data.full_name,
                data.office_type,
                data.service_type,
                data.work_code,
                data.appointment_date,
                data.start_time,
                data.end_time,
                data.slot_number,
                data.status,
                data.priority || 'normal'
            ]
        );

        return { id: result.insertId, ...data };
    }

    /**
     * دریافت نوبت‌های شهروند
     */
    async getAppointments(nationalCode) {
        const db = require('../core/database');

        const [rows] = await db.query(
            `SELECT * FROM national_appointments 
             WHERE national_code = ?
             ORDER BY appointment_date DESC, start_time DESC`,
            [nationalCode]
        );

        return rows;
    }

    /**
     * تبدیل ساعت به دقیقه
     */
    toMinutes(timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    }

    /**
     * تبدیل دقیقه به ساعت
     */
    toTime(minutes) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    }

    /**
     * تولید کد نوبت
     */
    generateCode() {
        const prefix = 'APT';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
}

module.exports = NationalAppointmentService;
