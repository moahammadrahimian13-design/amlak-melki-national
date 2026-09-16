/**
 * Kadaster Adapter - اتصال به سازمان کاداستر
 */

const BaseAdapter = require('../baseAdapter');
const logger = require('../../core/logger');

class KadasterAdapter extends BaseAdapter {
    constructor() {
        super({
            name: 'کاداستر',
            baseUrl: process.env.KADASTER_API_URL,
            apiKey: process.env.KADASTER_API_KEY,
            timeout: 20000,
            retries: 3
        });
    }

    async verifyOwnership(data) {
        if (!this.baseUrl) {
            return this.simulateVerifyOwnership(data);
        }

        return await this.request('POST', '/api/ownership/verify', {
            national_code: data.national_code,
            deed_number: data.deed_number,
            property_code: data.property_code
        });
    }

    async getPropertyInfo(data) {
        if (!this.baseUrl) {
            return this.simulatePropertyInfo(data);
        }

        return await this.request('POST', '/api/property/info', {
            property_code: data.property_code
        });
    }

    async simulateVerifyOwnership(data) {
        logger.debug(`شبیه‌سازی تأیید مالکیت کاداستر: ${data.national_code}`);

        return {
            success: true,
            data: {
                owner_name: 'نام مالک از کاداستر',
                national_code: data.national_code,
                property_code: data.property_code || 'KD-12345',
                area: 120,
                address: 'آدرس ملک از کاداستر'
            }
        };
    }

    async simulatePropertyInfo(data) {
        logger.debug(`شبیه‌سازی اطلاعات ملک: ${data.property_code}`);

        return {
            success: true,
            data: {
                property_code: data.property_code,
                area: 120,
                floors: 3,
                year_built: 1395,
                address: 'آدرس ملک از کاداستر'
            }
        };
    }
}

module.exports = KadasterAdapter;
