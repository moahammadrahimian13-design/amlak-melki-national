/**
 * Nezam Mohandesi Adapter - اتصال به سازمان نظام مهندسی
 */

const BaseAdapter = require('../baseAdapter');
const logger = require('../../core/logger');

class NezamMohandesiAdapter extends BaseAdapter {
    constructor() {
        super({
            name: 'نظام مهندسی',
            baseUrl: process.env.NEZAM_MOHANDESI_API_URL,
            apiKey: process.env.NEZAM_MOHANDESI_API_KEY,
            timeout: 20000,
            retries: 3
        });
    }

    async verifyLicense(data) {
        if (!this.baseUrl) {
            return this.simulateVerifyLicense(data);
        }

        return await this.request('POST', '/api/license/verify', {
            license_number: data.license_number,
            national_code: data.national_code,
            expert_type: data.expert_type || 'engineer'
        });
    }

    async verifySupervision(data) {
        if (!this.baseUrl) {
            return this.simulateSupervision(data);
        }

        return await this.request('POST', '/api/supervision/verify', {
            permit_number: data.permit_number,
            national_code: data.national_code
        });
    }

    async checkEngineerStatus(data) {
        if (!this.baseUrl) {
            return this.simulateEngineerStatus(data);
        }

        return await this.request('POST', '/api/engineer/status', {
            national_code: data.national_code
        });
    }

    async simulateVerifyLicense(data) {
        logger.debug(`شبیه‌سازی تأیید پروانه نظام مهندسی: ${data.license_number}`);

        const isValid = data.license_number && data.license_number.length > 3;

        return {
            success: isValid,
            data: isValid ? {
                license_number: data.license_number,
                full_name: 'نام مهندس',
                expert_type: data.expert_type || 'engineer',
                license_issuer: 'نظام مهندسی تهران',
                validity: true,
                expiry_date: '1405/12/29'
            } : null,
            message: isValid ? 'پروانه تأیید شد' : 'پروانه نامعتبر'
        };
    }

    async simulateSupervision(data) {
        logger.debug(`شبیه‌سازی تأیید نظارت: ${data.permit_number}`);

        return {
            success: true,
            data: {
                supervisor_code: 'SPV-' + Date.now(),
                approved: true,
                permit_number: data.permit_number
            }
        };
    }

    async simulateEngineerStatus(data) {
        logger.debug(`شبیه‌سازی وضعیت مهندس: ${data.national_code}`);

        return {
            success: true,
            data: {
                national_code: data.national_code,
                is_active: true,
                has_suspension: false,
                active_projects: 3
            }
        };
    }
}

module.exports = NezamMohandesiAdapter;
