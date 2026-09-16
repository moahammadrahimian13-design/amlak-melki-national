/**
 * Ghove Ghazai Adapter - اتصال به قوه قضائیه
 */

const BaseAdapter = require('../baseAdapter');
const logger = require('../../core/logger');

class GhoveGhazaiAdapter extends BaseAdapter {
    constructor() {
        super({
            name: 'قوه قضائیه',
            baseUrl: process.env.GHOVE_GHAZAI_API_URL,
            apiKey: process.env.GHOVE_GHAZAI_API_KEY,
            timeout: 25000,
            retries: 3
        });
    }

    async verifyOrder(data) {
        if (!this.baseUrl) {
            return this.simulateVerifyOrder(data);
        }

        return await this.request('POST', '/api/order/verify', {
            national_code: data.national_code,
            order_number: data.order_number,
            order_date: data.order_date
        });
    }

    async verifyExpertLicense(data) {
        if (!this.baseUrl) {
            return this.simulateExpertLicense(data);
        }

        return await this.request('POST', '/api/expert/verify', {
            national_code: data.national_code,
            license_number: data.license_number
        });
    }

    async checkCriminal(data) {
        if (!this.baseUrl) {
            return this.simulateCriminal(data);
        }

        return await this.request('POST', '/api/criminal/check', {
            national_code: data.national_code
        });
    }

    async checkLiens(data) {
        if (!this.baseUrl) {
            return this.simulateLiens(data);
        }

        return await this.request('POST', '/api/liens/check', {
            property_code: data.property_code,
            deed_number: data.deed_number
        });
    }

    async verifyInheritance(data) {
        if (!this.baseUrl) {
            return this.simulateInheritance(data);
        }

        return await this.request('POST', '/api/inheritance/verify', {
            certificate_number: data.certificate_number,
            national_code: data.national_code
        });
    }

    async simulateVerifyOrder(data) {
        logger.debug(`شبیه‌سازی تأیید حکم قضایی: ${data.order_number}`);

        return {
            success: true,
            data: {
                order_number: data.order_number,
                order_date: data.order_date,
                valid: true,
                court_name: 'دادگاه عمومی تهران'
            }
        };
    }

    async simulateExpertLicense(data) {
        logger.debug(`شبیه‌سازی تأیید پروانه کارشناسی: ${data.license_number}`);

        const isValid = data.license_number && data.license_number.length > 3;

        return {
            success: isValid,
            data: isValid ? {
                license_number: data.license_number,
                full_name: 'نام کارشناس رسمی',
                valid: true,
                expiry_date: '1405/12/29',
                expertise: 'امور ملکی'
            } : null
        };
    }

    async simulateCriminal(data) {
        logger.debug(`شبیه‌سازی بررسی سابقه کیفری: ${data.national_code}`);

        return {
            success: true,
            data: {
                has_record: false,
                details: null
            }
        };
    }

    async simulateLiens(data) {
        logger.debug(`شبیه‌سازی بررسی بازداشتی: ${data.property_code}`);

        return {
            success: true,
            data: {
                has_liens: false,
                liens: [],
                mortgage: false,
                seizure: false
            }
        };
    }

    async simulateInheritance(data) {
        logger.debug(`شبیه‌سازی تأیید حصر وراثت: ${data.certificate_number}`);

        return {
            success: true,
            data: {
                certificate_number: data.certificate_number,
                valid: true,
                heirs_count: 3,
                issue_date: '1402/05/10'
            }
        };
    }
}

module.exports = GhoveGhazaiAdapter;
