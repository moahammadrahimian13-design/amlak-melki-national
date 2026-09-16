/**
 * Darayi Adapter - اتصال به سازمان امور مالیاتی
 */

const BaseAdapter = require('../baseAdapter');
const logger = require('../../core/logger');

class DarayiAdapter extends BaseAdapter {
    constructor() {
        super({
            name: 'دارایی',
            baseUrl: process.env.DARAYI_API_URL,
            apiKey: process.env.DARAYI_API_KEY,
            timeout: 20000,
            retries: 3
        });
    }

    async checkTax(data) {
        if (!this.baseUrl) {
            return this.simulateCheckTax(data);
        }

        return await this.request('POST', '/api/tax/check', {
            national_code: data.national_code,
            property_code: data.property_code
        });
    }

    async calculateTransferTax(data) {
        if (!this.baseUrl) {
            return this.simulateTransferTax(data);
        }

        return await this.request('POST', '/api/tax/calculate', {
            property_code: data.property_code,
            sale_price: data.sale_price
        });
    }

    async issueCertificate(data) {
        if (!this.baseUrl) {
            return this.simulateCertificate(data);
        }

        return await this.request('POST', '/api/certificate/issue', {
            national_code: data.national_code,
            property_code: data.property_code
        });
    }

    async simulateCheckTax(data) {
        logger.debug(`شبیه‌سازی استعلام مالیاتی: ${data.national_code}`);

        return {
            success: true,
            data: {
                national_code: data.national_code,
                has_debt: false,
                debt_amount: 0
            }
        };
    }

    async simulateTransferTax(data) {
        logger.debug(`شبیه‌سازی محاسبه مالیات نقل و انتقال`);

        const tax = Math.round((data.sale_price || 0) * 0.02);

        return {
            success: true,
            data: {
                tax_amount: tax,
                payment_required: true
            }
        };
    }

    async simulateCertificate(data) {
        logger.debug(`شبیه‌سازی صدور گواهی مالیاتی`);

        return {
            success: true,
            data: {
                certificate_number: 'TAX-' + Date.now(),
                issue_date: new Date(),
                valid: true
            }
        };
    }
}

module.exports = DarayiAdapter;

