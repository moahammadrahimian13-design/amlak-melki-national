/**
 * Event Bus - ارتباط بین ماژول‌ها
 */

const EventEmitter = require('events');
const logger = require('./logger');

class EventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100);
        this.history = [];
    }

    emit(event, data) {
        this.history.push({
            event,
            data,
            timestamp: new Date()
        });

        if (this.history.length > 1000) {
            this.history.shift();
        }

        logger.debug(`رویداد: ${event}`);
        return super.emit(event, data);
    }

    getHistory(eventName) {
        if (eventName) {
            return this.history.filter(e => e.event === eventName);
        }
        return this.history;
    }
}

module.exports = new EventBus();
