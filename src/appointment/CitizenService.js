/**
 * Citizen Service - خدمات شهروند بر اساس کد ملی
 */

const logger = require('../core/logger');

class CitizenService {
    constructor() {
        this.isReady = false;
    }

    async initialize() {
        this.isReady = true;
        logger.info('Citizen Service آماده شد');
    }

    /**
     * دریافت پروفایل شهروند (با کد ملی)
     */
    async getProfile(nationalCode) {
        const db = require('../core/database');

        const [rows] = await db.query(
            `SELECT * FROM citizen_profiles WHERE national_code = ?`,
            [nationalCode]
        );

        return rows[0] || null;
    }

    /**
     * ساخت پروفایل جدید
     */
    async createProfile(nationalCode, data) {
        const db = require('../core/database');

        const [result] = await db.query(
            `INSERT INTO citizen_profiles 
             (national_code, full_name, father_name, birth_date, phone)
             VALUES (?, ?, ?, ?, ?)`,
            [
                nationalCode,
                data.full_name,
                data.father_name,
                data.birth_date,
                data.phone
            ]
        );

        return result.insertId;
    }

    /**
     * بررسی وضعیت شهروند
     */
    async checkStatus(nationalCode) {
        const profile = await this.getProfile(nationalCode);

        if (!profile) {
            return {
                exists: false,
                message: 'شهروند در سیستم یافت نشد'
            };
        }

        const restrictions = await this.getRestrictions(nationalCode);

        return {
            exists: true,
            profile,
            restrictions,
            status: profile.status,
            trust_level: profile.trust_level,
            trust_score: profile.trust_score,
            can_book: profile.status === 'active' && restrictions.length === 0
        };
    }

    /**
     * دریافت محدودیت‌ها
     */
    async getRestrictions(nationalCode) {
        const db = require('../core/database');

        const [rows] = await db.query(
            `SELECT * FROM appointment_restrictions 
             WHERE national_code = ? 
               AND is_active = TRUE
               AND (is_permanent = TRUE OR effective_until IS NULL OR effective_until > NOW())`,
            [nationalCode]
        );

        return rows;
    }

    /**
     * دریافت تأییدیه‌ها
     */
    async getVerifications(nationalCode) {
        const db = require('../core/database');

        const [rows] = await db.query(
            `SELECT * FROM citizen_verifications 
             WHERE national_code = ?
             ORDER BY verified_at DESC`,
            [nationalCode]
        );

        return rows;
    }

    /**
     * بررسی وجود یک تأییدیه خاص
     */
    async hasVerification(nationalCode, verificationType) {
        const db = require('../core/database');

        const [rows] = await db.query(
            `SELECT * FROM citizen_verifications 
             WHERE national_code = ? 
               AND verification_type = ?
               AND status = 'approved'
               AND (is_permanent = TRUE OR valid_until IS NULL OR valid_until > CURDATE())
             ORDER BY verified_at DESC
             LIMIT 1`,
            [nationalCode, verificationType]
        );

        return rows[0] || null;
    }

    /**
     * اعتبارسنجی کد ملی
     */
    isValidNationalCode(code) {
        if (!/^\d{10}$/.test(code)) return false;
        if (/^(\d)\1{9}$/.test(code)) return false;

        const check = parseInt(code[9]);
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(code[i]) * (10 - i);
        }
        const r = sum % 11;
        return (r < 2 && check === r) || (r >= 2 && check === 11 - r);
    }
}

module.exports = CitizenService;
