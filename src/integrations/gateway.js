/**
 * Integration Gateway - دروازه اتصال به ادارات
 */

const logger = require('../core/logger');
const { IntegrationError } = require('../core/errors');

class IntegrationGateway {
    constructor() {
        this.adapters = new Map();
        this.isReady = false;
    }

    async initialize() {
        const adapterList = [
            { name: 'sabt_ahval', path: './adapters/sabtAhval' },
            { name: 'sabt_asnad', path: './adapters/sabtAsnad' },
            { name: 'kadaster', path: './adapters/kadaster' },
            { name: 'darayi', path: './adapters/darayi' },
            { name: 'shahrdari', path: './adapters/shahrdari' },
            { name: 'nezam_mohandesi', path: './adapters/nezamMohandesi' },
            { name: 'ghove_ghazai', path: './adapters/ghoveGhazai' }
        ];

        for (const item of adapterList) {
            try {
                const AdapterClass = require(item.path);
                const instance = new AdapterClass();
                await instance.initialize();
                this.adapters.set(item.name, instance);
                logger.info(`آداپتور ${item.name} بارگذاری شد`);
            } catch (error) {
                logger.warn(`آداپتور ${item.name} ناموفق: ${error.message}`);
            }
        }

        this.isReady = true;
    }

    async call(administration, action, data = {}) {
        const startTime = Date.now();

        try {
            const adapter = this.adapters.get(administration);
            if (!adapter) {
                throw new IntegrationError(`آداپتور ${administration} یافت نشد`, administration);
            }

            const result = await adapter.call(action, data);

            logger.debug(`${administration}.${action} - ${Date.now() - startTime}ms`);

            return {
                success: true,
                data: result,
                administration,
                action,
                processingTime: Date.now() - startTime
            };
        } catch (error) {
            logger.error(`${administration}.${action}: ${error.message}`);
            return {
                success: false,
                error: error.message,
                administration,
                action
            };
        }
    }

    async callParallel(calls) {
        const results = await Promise.allSettled(
            calls.map(call => this.call(call.administration, call.action, call.data))
        );

        return results.map((result, index) => ({
            ...calls[index],
            result: result.status === 'fulfilled'
                ? result.value
                : { success: false, error: result.reason?.message }
        }));
    }

    getStatus() {
        const status = {};
        for (const [name, adapter] of this.adapters) {
            status[name] = adapter.getStatus ? adapter.getStatus() : 'active';
        }
        return status;
    }
}

module.exports = new IntegrationGateway();
