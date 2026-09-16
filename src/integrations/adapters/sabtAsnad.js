/**
 * Sabt Asnad Adapter - اتصال به سازمان ثبت اسناد
 */

const BaseAdapter = require('../baseAdapter');
const logger = require('../../core/logger');

class SabtAsnadAdapter extends BaseAdapter {
    constructor() {
        super({
            name: 'ثبت اسناد',
            baseUrl: process.env.SABT_ASNAD_API_URL,
            apiKey: process.env.SABT_ASNAD_API_KEY,
            timeout: 20000,
            retries: 3
        });
    }

    async verifyDeed(data) {
        if (!this.baseUrl) {
            return this.simulateVerifyDeed(data);
        }

        return await this.request('POST', '/api/deed/verify', {
            deed_number: data.deed_number,
            deed_serial: data.deed_serial,
            registration_office: data.registration_office
        });
    }

    async verifyOwnership(data) {
        if (!this.baseUrl) {
            return this.simulateVerifyOwnership(data);
        }

        return await this.request('POST', '/api/ownership/verify', {
            deed_number: data.deed_number,
            national_code: data.national_code
        });
    }

    async checkEncumbrances(data) {
        if (!this.baseUrl) {
            return { has_issues: false, issues: [] };
        }

        return await this.request('POST', '/api/encumbrances/check', {
            deed_number: data.deed_number,
            property_code: data.property_code
        });
    }

    async simulateVerifyDeed(data) {
        logger.debug(`شبیه‌سازی تأیید سند: ${data.deed_number}`);

        const isValid = data.deed_number && data.deed_number.length > 5;

        return {
            success: isValid,
            data: isValid ? {
                deed_number: data.deed_number,
                owner_name: 'نام از ثبت اسناد',
                registration_office: data.registration_office || 'دفتر مرکزی'
            } : null,
            message: isValid ? 'سند تأیید شد' : 'سند نامعتبر'
        };
    }

    async simulateVerifyOwnership(data) {
        logger.debug(`شبیه‌سازی تأیید مالکیت: ${data.national_code}`);

        return {
            success: true,
            data: {
                owner_name: 'نام از ثبت اسناد',
                national_code: data.national_code
            }
        };
    }
}

module.exports = SabtAsnadAdapter;
