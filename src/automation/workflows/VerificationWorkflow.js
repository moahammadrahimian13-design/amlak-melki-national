/**
 * VerificationWorkflow - جریان تأیید هویت
 */

const logger = require('../../../core/logger');
const ai = require('../../../ai');
const db = require('../../../core/database');
const eventBus = require('../../../core/eventBus');
const auditLogger = require('../../../audit/AuditLogger');

class VerificationWorkflow {
    constructor(automation) {
        this.automation = automation;
        this.name = 'VerificationWorkflow';
    }

    async execute(data, state) {
        const { user_id } = data;

        state.step('started', { user_id });

        const user = await this.getUser(user_id);
        if (!user) throw new Error('کاربر یافت نشد');

        const aiResult = await ai.process({
            documents: {
                national_code: user.national_code,
                full_name: user.full_name,
                birth_date: user.birth_date
            },
            selfie: user.selfie_with_card,
            national_card: user.national_card_front,
            metadata: {
                ip: data.ip,
                national_code: user.national_code
            }
        });

        state.step('ai_completed', {
            decision: aiResult.decision,
            confidence: aiResult.confidence
        });

        if (aiResult.decision === 'auto_approved') {
            await this.approveUser(user_id, aiResult);
        } else if (aiResult.decision === 'manual_review') {
            await this.assignToExpert(user_id, aiResult);
        } else {
            await this.rejectUser(user_id, aiResult);
        }

        await auditLogger.log({
            user_id,
            action_type: 'workflow_verification',
            action_category: 'automation',
            resource_type: 'user',
            resource_id: user_id.toString(),
            description: `تأیید هویت: ${aiResult.decision}`,
            status: 'success',
            processing_time: state.getDuration()
        });

        eventBus.emit('workflow.completed', {
            workflow: this.name,
            user_id,
            decision: aiResult.decision,
            duration: state.getDuration()
        });

        return {
            success: true,
            decision: aiResult.decision,
            confidence: aiResult.confidence,
            duration: state.getDuration()
        };
    }

    async getUser(userId) {
        const rows = await db.query(
            `SELECT * FROM users WHERE id = ?`,
            [userId]
        );
        return rows[0];
    }

    async approveUser(userId, aiResult) {
        await db.query(
            `UPDATE users 
             SET identity_verified = TRUE,
                 account_status = 'active',
                 verified_at = NOW()
             WHERE id = ?`,
            [userId]
        );

        eventBus.emit('user.verified', {
            user_id: userId,
            confidence: aiResult.confidence
        });

        logger.info(`کاربر ${userId} تأیید شد`);
    }

    async assignToExpert(userId, aiResult) {
        await db.query(
            `INSERT INTO review_queue 
             (user_id, ai_result, priority, status, created_at)
             VALUES (?, ?, 'normal', 'pending', NOW())`,
            [userId, JSON.stringify(aiResult)]
        );

        eventBus.emit('user.assigned_to_review', {
            user_id: userId
        });

        logger.info(`کاربر ${userId} به صف کارشناس ارجاع شد`);
    }

    async rejectUser(userId, aiResult) {
        await db.query(
            `UPDATE users 
             SET account_status = 'rejected',
                 rejection_reason = ?
             WHERE id = ?`,
            [aiResult.reason || 'تأیید نشد', userId]
        );

        eventBus.emit('user.rejected', {
            user_id: userId,
            reason: aiResult.reason
        });

        logger.warn(`کاربر ${userId} رد شد`);
    }
}

module.exports = VerificationWorkflow;
