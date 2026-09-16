/**
 * Risk Scorer - امتیاز ریسک
 */

const logger = require('../../core/logger');

class RiskScorer {
    constructor() {
        this.isReady = false;
    }

    async initialize() {
        this.isReady = true;
        logger.info('Risk Scorer آماده شد');
    }

    async calculate(data) {
        const startTime = Date.now();

        let riskScore = 0;

        if (!data.ocr?.success) riskScore += 30;
        if (!data.face?.match) riskScore += 25;
        if (!data.documents?.authentic) riskScore += 30;

        if (data.anomaly?.detected) {
            riskScore += data.anomaly.severity === 'high' ? 40
                      : data.anomaly.severity === 'medium' ? 20
                      : 10;
        }

        riskScore = Math.min(100, riskScore);

        const level = riskScore < 30 ? 'low'
                    : riskScore < 70 ? 'medium'
                    : 'high';

        const result = {
            success: true,
            score: riskScore,
            level,
            processingTime: Date.now() - startTime
        };

        logger.debug(`Risk Score: ${riskScore} (${level})`);
        return result;
    }
}

module.exports = RiskScorer;
