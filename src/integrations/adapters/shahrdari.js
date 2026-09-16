/**
 * Shahrdari Adapter - اتصال به شهرداری‌ها
 */

const BaseAdapter = require('../baseAdapter');
const logger = require('../../core/logger');

class ShahrdariAdapter extends BaseAdapter {
    constructor() {
        super({
            name: 'شهرداری',
            baseUrl: process.env.SHAHRDARI_API_URL,
            apiKey: process.env.SHAHRDARI_API_KEY,
            timeout: 20000,
            retries: 3
        });
    }

    async checkPermit(data) {
        if (!this.baseUrl) {
            return this.simulatePermit(data);
        }

        return await this.request('POST', '/api/permit/check', {
            property_code: data.property_code,
            city: data.city,
            province: data.province
        });
    }

    async checkDues(data) {
        if (!this.baseUrl) {
            return this.simulateDues(data);
        }

        return await this.request('POST', '/api/dues/check', {
            property_code: data.property_code,
            city: data.city
        });
    }

    async checkViolations(data) {
        if (!this.baseUrl) {
            return this.simulateViolations(data);
        }

        return await this.request('POST', '/api/violations/check', {
            property_code: data.property_code,
            property_id: data.property_id
        });
    }

    async verifyEmployment(data) {
        if (!this.baseUrl) {
            return this.simulateEmployment(data);
        }

        return await this.request('POST', '/api/employment/verify', {
            national_code: data.national_code,
            employee_number: data.employee_number,
            city: data.city
        });
    }

    async simulatePermit(data) {
        logger.debug(`شبیه‌سازی استعلام پروانه شهرداری: ${data.property_code}`);

        return {
            success: true,
            data: {
                has_permit: true,
                permit_number: 'SH-' + Date.now(),
                permit_date: '1400/01/15',
                valid: true,
                city: data.city || 'تهران'
            }
        };
    }

    async simulateDues(data) {
        logger.debug(`شبیه‌سازی استعلام عوارض شهرداری`);

        return {
            success: true,
            data: {
                has_debt: false,
                debt_amount: 0,
                city: data.city
            }
        };
    }

    async simulateViolations(data) {
        logger.debug(`شبیه‌سازی بررسی تخلفات ساختمانی`);

        return {
            success: true,
            data: {
                has_violations: false,
                violations: [],
                commission_100: false
            }
        };
    }

    async simulateEmployment(data) {
        logger.debug(`شبیه‌سازی تأیید کارگزینی: ${data.national_code}`);

        return {
            success: true,
            data: {
                is_employee: true,
                employee_number: data.employee_number,
                position: 'کارشناس',
                city: data.city
            }
        };
    }
}

module.exports = ShahrdariAdapter;
