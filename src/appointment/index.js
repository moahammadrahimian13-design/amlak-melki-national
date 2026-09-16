/**
 * Appointment Module - سیستم هوشمند نوبت‌دهی
 * 
 * اصل: نوبت فقط با کد ملی و بر اساس زنجیره کارها
 */

const logger = require('../core/logger');
const eventBus = require('../core/eventBus');
const CitizenService = require('./CitizenService');
const ChainValidator = require('./ChainValidator');
const NationalAppointmentService = require('./NationalAppointmentService');
const HolidayManager = require('./calendars/HolidayManager');
const TimeSlotGenerator = require('./slots/TimeSlotGenerator');

class AppointmentModule {
    constructor() {
        this.citizen = new CitizenService();
        this.validator = new ChainValidator();
        this.service = new NationalAppointmentService();
        this.holidays = new HolidayManager();
        this.slots = new TimeSlotGenerator();
        this.isReady = false;
    }

    async initialize() {
        logger.info('راه‌اندازی سیستم نوبت‌دهی...');
        
        await this.holidays.initialize();
        await this.slots.initialize();
        
        this.isReady = true;
        logger.info('سیستم نوبت‌دهی آماده است');
    }

    /**
     * ثبت نوبت با کد ملی
     */
    async bookAppointment(data) {
        return await this.service.bookAppointment(data);
    }

    /**
     * دریافت نوبت‌های شهروند
     */
    async getCitizenAppointments(nationalCode) {
        return await this.service.getAppointments(nationalCode);
    }

    /**
     * بررسی وضعیت شهروند
     */
    async checkCitizenStatus(nationalCode) {
        return await this.citizen.checkStatus(nationalCode);
    }

    /**
     * دریافت مراحل بعدی ممکن
     */
    async getAvailableSteps(nationalCode, chainId) {
        return await this.validator.getAvailableNextSteps(nationalCode, chainId);
    }
}

module.exports = new AppointmentModule();
