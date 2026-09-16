/**
 * GIS Module - سیستم جامع نقشه‌برداری و GPS
 */

const logger = require('../core/logger');
const eventBus = require('../core/eventBus');
const GPSLocator = require('./gps/GPSLocator');

class GISModule {
    constructor() {
        this.gps = new GPSLocator();
        this.isReady = false;
    }

    async initialize() {
        logger.info('راه‌اندازی ماژول GIS...');
        await this.gps.initialize();
        this.isReady = true;
        logger.info('ماژول GIS آماده است');
    }

    /**
     * استعلام با GPS
     */
    async queryByGPS(latitude, longitude) {
        const result = {
            coordinates: { latitude, longitude },
            nearby: await this.gps.findNearby(latitude, longitude),
            timestamp: new Date()
        };

        eventBus.emit('gis.query.completed', {
            latitude,
            longitude
        });

        return result;
    }

    /**
     * محاسبه فاصله
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        return this.gps.calculateDistance(lat1, lon1, lat2, lon2);
    }

    /**
     * محاسبه مساحت
     */
    calculateArea(coordinates) {
        return this.gps.calculateArea(coordinates);
    }
}

module.exports = new GISModule();
