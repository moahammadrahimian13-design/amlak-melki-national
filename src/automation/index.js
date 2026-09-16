/**
 * Automation Core - هسته اتوماسیون
 */

const logger = require('../core/logger');
const eventBus = require('../core/eventBus');
const WorkflowEngine = require('../workflow/WorkflowEngine');
const TaskScheduler = require('./scheduler/TaskScheduler');

class AutomationCore {
    constructor() {
        this.engine = null;
        this.scheduler = null;
        this.isReady = false;
    }

    async initialize() {
        logger.info('راه‌اندازی هسته اتوماسیون...');

        this.engine = new WorkflowEngine();
        await this.engine.initialize();

        await this.loadWorkflows();

        this.scheduler = new TaskScheduler();
        await this.scheduler.start();

        this.registerListeners();

        this.isReady = true;
        logger.info('هسته اتوماسیون آماده است');
    }

    async loadWorkflows() {
        const workflows = [
            'PropertySaleWorkflow',
            'VerificationWorkflow'
        ];

        for (const name of workflows) {
            try {
                const WorkflowClass = require(`./workflows/${name}`);
                const instance = new WorkflowClass(this);
                this.engine.register(name, instance);
                logger.info(`workflow "${name}" ثبت شد`);
            } catch (error) {
                logger.warn(`workflow ${name}: ${error.message}`);
            }
        }
    }

    async run(name, data) {
        logger.info(`اجرای workflow: ${name}`);
        const startTime = Date.now();

        try {
            const result = await this.engine.execute(name, data);
            logger.info(`workflow ${name} کامل شد در ${Date.now() - startTime}ms`);
            return result;
        } catch (error) {
            logger.error(`خطا در workflow ${name}:`, error);
            throw error;
        }
    }

    registerListeners() {
        eventBus.on('user.registered', async (data) => {
            await this.run('VerificationWorkflow', data);
        });

        eventBus.on('property.created', async (data) => {
            await this.run('PropertySaleWorkflow', data);
        });
    }
}

module.exports = new AutomationCore();
