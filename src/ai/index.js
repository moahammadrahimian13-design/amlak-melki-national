/**
 * AI Core - هسته هوش مصنوعی
 */

const logger = require('../core/logger');
const eventBus = require('../core/eventBus');
const OCRProcessor = require('./engines/OCRProcessor');
const FaceMatcher = require('./engines/FaceMatcher');
const DocumentVerifier = require('./engines/DocumentVerifier');
const AnomalyDetector = require('./engines/AnomalyDetector');
const RiskScorer = require('./engines/RiskScorer');
const DecisionEngine = require('./engines/DecisionEngine');

class AICore {
    constructor() {
        this.ocr = new OCRProcessor();
        this.face = new FaceMatcher();
        this.documents = new DocumentVerifier();
        this.anomaly = new AnomalyDetector();
        this.risk = new RiskScorer();
        this.decision = new DecisionEngine();
        this.isReady = false;
        this.stats = {
            totalProcessed: 0,
            autoApproved: 0,
            manualReview: 0,
            rejected: 0,
            avgTime: 0
        };
    }

    async initialize() {
        logger.info('راه‌اندازی هسته AI...');
        await this.ocr.initialize();
        await this.face.initialize();
        await this.documents.initialize();
        await this.anomaly.initialize();
        await this.risk.initialize();
        await this.decision.initialize();
        this.isReady = true;
        logger.info('هسته AI آماده است');
    }

    async process(data) {
        const startTime = Date.now();
        this.stats.totalProcessed++;

        try {
            const [ocrResult, faceResult, docResult, anomalyResult] = await Promise.all([
                this.ocr.process(data.documents),
                this.face.process(data.selfie, data.national_card),
                this.documents.process(data.documents),
                this.anomaly.detect(data.metadata)
            ]);

            const riskScore = await this.risk.calculate({
                ocr: ocrResult,
                face: faceResult,
                documents: docResult,
                anomaly: anomalyResult
            });

            const decision = await this.decision.decide({
                ocr: ocrResult,
                face: faceResult,
                documents: docResult,
                anomaly: anomalyResult,
                risk: riskScore
            });

            const result = {
                success: true,
                decision: decision.status,
                confidence: decision.confidence,
                steps: {
                    ocr: ocrResult,
                    face: faceResult,
                    documents: docResult,
                    anomaly: anomalyResult,
                    risk: riskScore
                },
                processingTime: Date.now() - startTime
            };

            this.updateStats(result);

            eventBus.emit('ai.processed', {
                decision: decision.status,
                confidence: decision.confidence,
                time: result.processingTime
            });

            return result;

        } catch (error) {
            logger.error('خطا در AI:', error);
            throw error;
        }
    }

    updateStats(result) {
        const total = this.stats.totalProcessed;
        if (result.decision === 'auto_approved') this.stats.autoApproved++;
        else if (result.decision === 'manual_review') this.stats.manualReview++;
        else this.stats.rejected++;

        this.stats.avgTime =
            (this.stats.avgTime * (total - 1) + result.processingTime) / total;
    }

    getStats() {
        const total = this.stats.totalProcessed;
        return {
            ...this.stats,
            successRate: total > 0
                ? ((this.stats.autoApproved / total) * 100).toFixed(2) + '%'
                : '0%'
        };
    }
}

module.exports = new AICore();
