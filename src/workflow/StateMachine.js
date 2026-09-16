/**
 * State Machine - مدیریت حالت workflow
 */

const logger = require('../core/logger');

class StateMachine {
    constructor(workflowName) {
        this.workflowName = workflowName;
        this.states = [];
        this.currentState = 'pending';
        this.startTime = null;
        this.endTime = null;
    }

    start() {
        this.startTime = Date.now();
        this.currentState = 'running';
        this.record('started', {});
        logger.debug(`workflow ${this.workflowName} شروع شد`);
    }

    step(name, data = {}) {
        this.record(name, data);
        logger.debug(`step: ${name}`);
    }

    complete(result) {
        this.endTime = Date.now();
        this.currentState = 'completed';
        this.record('completed', { result });
        logger.debug(`workflow ${this.workflowName} کامل شد`);
    }

    fail(error) {
        this.endTime = Date.now();
        this.currentState = 'failed';
        this.record('failed', { error: error.message });
        logger.error(`workflow ${this.workflowName} شکست خورد`);
    }

    record(state, data) {
        this.states.push({
            state,
            data,
            timestamp: new Date()
        });
    }

    getDuration() {
        return this.endTime - this.startTime;
    }
}

module.exports = StateMachine;
