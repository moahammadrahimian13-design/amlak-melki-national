/**
 * Decision Engine - تصمیم‌گیری نهایی
 */

const logger = require('../../core/logger');

class DecisionEngine {
    constructor() {
        this.isReady = false;
        this.thresholds = {
            autoApprove: 90,
            manualReview: 70,
            reject: 40
        };
    }

    async initialize() {
        this.isReady = true;
        logger.info('Decision Engine آماده شد');
    }

    async decide(data) {
        const startTime = Date.now();

        const confidence = this.calculateConfidence(data);

        let status;
        if (confidence >= this.thresholds.autoApprove && data.risk?.score < 30) {
            status = 'auto_approved';
        } else if (confidence >= this.thresholds.manualReview) {
            status = 'manual_review';
        } else if (confidence < this.thresholds.reject) {
            status = 'rejected';
        } else {
            status = 'manual_review';
        }

        const result = {
            success: true,
            status,
            confidence,
            reason: this.buildReason(data, status),
            processingTime: Date.now() - startTime
        };

        logger.info(`Decision: ${status} (${confidence}%)`);
        return result;
    }

    calculateConfidence(data) {
        const scores = [
            (data.ocr?.confidence || 0) * 30,
            (data.face?.score || 0) * 30,
            (data.documents?.score || 0) * 25,
            (100 - (data.risk?.score || 0)) * 15
        ];

        return Math.round(scores.reduce((a, b) => a + b, 0) / 100);
    }

    buildReason(data, status) {
        const reasons = [];
        if (!data.face?.match) reasons.push('چهره نامطابق');
        if (!data.documents?.authentic) reasons.push('مدرک مشکوک');
        if (data.anomaly?.detected) reasons.push('ناهنجاری');
        if (data.risk?.score > 70) reasons.push('ریسک بالا');

        return reasons.length > 0 ? reasons.join('، ') : 'همه چیز موفق';
    }
}

module.exports = DecisionEngine;
