/**
 * Task Scheduler - زمان‌بندی کارهای خودکار
 */

const logger = require('../../../core/logger');
const eventBus = require('../../../core/eventBus');

class TaskScheduler {
    constructor() {
        this.timers = [];
    }

    async start() {
        logger.info('راه‌اندازی Scheduler...');

        this.schedule('*/5 * * * *', async () => {
            eventBus.emit('cron.process_pending', {});
        });

        this.schedule('0 * * * *', async () => {
            eventBus.emit('cron.backup', {});
        });

        this.schedule('0 3 * * *', async () => {
            eventBus.emit('cron.daily_report', {});
        });

        logger.info('Scheduler فعال است');
    }

    schedule(cronExpression, task) {
        logger.debug(`زمان‌بندی: ${cronExpression}`);
        const interval = this.parseCron(cronExpression);
        const timer = setInterval(task, interval);
        this.timers.push(timer);
    }

    parseCron(expr) {
        if (expr.includes('*/5')) return 5 * 60 * 1000;
        if (expr.includes('0 *')) return 60 * 60 * 1000;
        if (expr.includes('0 3')) return 24 * 60 * 60 * 1000;
        return 60 * 1000;
    }

    stop() {
        this.timers.forEach(t => clearInterval(t));
        this.timers = [];
    }
}

module.exports = TaskScheduler;
