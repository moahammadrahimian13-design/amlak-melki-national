/**
 * Workflow Engine - موتور اجرای workflowها
 */

const logger = require('../core/logger');
const StateMachine = require('./StateMachine');

class WorkflowEngine {
    constructor() {
        this.workflows = new Map();
    }

    async initialize() {
        logger.info('راه‌اندازی Workflow Engine...');
    }

    register(name, workflow) {
        this.workflows.set(name, workflow);
    }

    async execute(name, data) {
        const workflow = this.workflows.get(name);
        if (!workflow) throw new Error(`workflow ${name} یافت نشد`);

        const state = new StateMachine(name);

        try {
            state.start();
            const result = await workflow.execute(data, state);
            state.complete(result);
            return result;
        } catch (error) {
            state.fail(error);
            throw error;
        }
    }
}

module.exports = WorkflowEngine;
