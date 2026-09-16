/**
 * Sabt Ahval Adapter - اتصال به سازمان ثبت احوال
 */

const BaseAdapter = require('../baseAdapter');
const logger = require('../../core/logger');

class SabtAhvalAdapter extends BaseAdapter {
    constructor() {
        super({
            name: 'ثبت احوال',
            baseUrl: process.env.SABT_AHVAL_API_URL,
            apiKey: process.env.SABT_AHVAL_API_KEY,
            timeout: 20000,
            retries: 3
        });
    }

    async verify(data) {
        if (!this.baseUrl) {
            return this.simulateVerify(data);
        }

        return await this.request('POST', '/api/verify', {
            national_code: data.national_code,
            birth_date: data.birth_date
        });
    }

    async simulateVerify(data) {
        logger.debug(`شبیه‌سازی تأیید کد ملی: ${data.national_code}`);

        const isValid = /^\d{10}$/.test(data.national_code);

        return {
            success: isValid,
            data: isValid ? {
                national_code: data.national_code,
                full_name: 'نام از ثبت احوال',
                birth_date: data.birth_date || '1370/01/01'
            } : null,
            message: isValid ? 'تأیید شد' : 'کد ملی نامعتبر'
        };
    }
}

module.exports = SabtAhvalAdapter;
