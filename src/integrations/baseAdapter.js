/**
 * Base Adapter - آداپتور پایه
 */

const axios = require('axios');
const logger = require('../core/logger');
const { IntegrationError } = require('../core/errors');

class BaseAdapter {
    constructor(config) {
        this.name = config.name;
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.timeout = config.timeout || 15000;
        this.retries = config.retries || 3;
        this.isConnected = false;
    }

    async initialize() {
        if (!this.baseUrl) {
            logger.warn(`${this.name}: API تنظیم نشده (شبیه‌سازی)`);
            this.isConnected = true;
            return;
        }
        try {
            await this.testConnection();
            this.isConnected = true;
            logger.info(`${this.name}: متصل شد`);
        } catch (error) {
            logger.warn(`${this.name}: ${error.message}`);
            this.isConnected = false;
        }
    }

    async testConnection() {
        return true;
    }

    async call(action, data) {
        const method = this[action];
        if (typeof method !== 'function') {
            throw new IntegrationError(`اکشن ${action} در ${this.name} یافت نشد`, this.name);
        }
        return await method.call(this, data);
    }

    async request(method, url, data, options = {}) {
        let lastError;

        for (let attempt = 1; attempt <= this.retries; attempt++) {
            try {
                const response = await axios({
                    method,
                    url: `${this.baseUrl}${url}`,
                    data,
                    timeout: this.timeout,
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });
                return response.data;
            } catch (error) {
                lastError = error;
                logger.warn(`تلاش ${attempt}/${this.retries} - ${this.name}: ${error.message}`);
                if (attempt < this.retries) {
                    await this.sleep(1000 * attempt);
                }
            }
        }

        throw new IntegrationError(
            `درخواست به ${this.name} ناموفق بود: ${lastError.message}`,
            this.name
        );
    }

    getStatus() {
        return this.isConnected ? 'active' : 'inactive';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = BaseAdapter;
