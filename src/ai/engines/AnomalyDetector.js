/**
 * Anomaly Detector - تشخیص ناهنجاری
 */

const logger = require('../../core/logger');
const db = require('../../core/database');

class AnomalyDetector {
    constructor() {
        this.isReady = false;
    }

    async initialize() {
        this.isReady = true;
        logger.info('Anomaly Detector آماده شد');
    }

    async detect(metadata) {
        if (!metadata) {
            return { detected: false, anomalies: [] };
        }

        const startTime = Date.now();
        const anomalies = [];

        const ipCount = await this.countByIP(metadata.ip);
        if (ipCount > 10) {
            anomalies.push({
                type: 'high_ip_frequency',
                severity: 'high',
                detail: `${ipCount} درخواست از IP`
            });
        }

        const codeCount = await this.countByCode(metadata.national_code);
        if (codeCount > 3) {
            anomalies.push({
                type: 'repeated_national_code',
                severity: 'medium',
                detail: `کد ملی ${codeCount} بار`
            });
        }

        const severity = anomalies.some(a => a.severity === 'high') ? 'high'
                       : anomalies.some(a => a.severity === 'medium') ? 'medium'
                       : 'none';

        const result = {
            detected: anomalies.length > 0,
            severity,
            anomalies,
            processingTime: Date.now() - startTime
        };

        logger.debug(`Anomaly: ${result.detected ? severity : 'none'}`);
        return result;
    }

    async countByIP(ip) {
        if (!ip) return 0;
        try {
            const rows = await db.query(
                `SELECT COUNT(*) as c FROM audit_trail 
                 WHERE ip_address = ? 
                 AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
                [ip]
            );
            return rows[0]?.c || 0;
        } catch {
            return 0;
        }
    }

    async countByCode(code) {
        if (!code) return 0;
        try {
            const rows = await db.query(
                `SELECT COUNT(*) as c FROM audit_trail 
                 WHERE user_national_code = ? 
                 AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
                [code]
            );
            return rows[0]?.c || 0;
        } catch {
            return 0;
        }
    }
}

module.exports = AnomalyDetector;
