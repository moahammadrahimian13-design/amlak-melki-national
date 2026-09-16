/**
 * PropertySaleWorkflow - جریان خودکار فروش ملک
 */

const logger = require('../../../core/logger');
const ai = require('../../../ai');
const db = require('../../../core/database');
const eventBus = require('../../../core/eventBus');
const auditLogger = require('../../../audit/AuditLogger');

class PropertySaleWorkflow {
    constructor(automation) {
        this.automation = automation;
        this.name = 'PropertySaleWorkflow';
    }

    async execute(data, state) {
        const { property_id, user_id } = data;

        state.step('ai_review', { property_id });

        const property = await this.getProperty(property_id);
        if (!property) throw new Error('ملک یافت نشد');

        const aiResult = await ai.process({
            documents: {
                national_code: property.national_code,
                full_name: property.full_name
            },
            selfie: property.selfie,
            national_card: property.national_card,
            metadata: {
                ip: data.ip,
                national_code: property.national_code
            }
        });

        state.step('ai_completed', {
            decision: aiResult.decision,
            confidence: aiResult.confidence
        });

        if (aiResult.decision === 'auto_approved') {
            state.step('auto_approved', {});
            await this.publishProperty(property_id, user_id);
        } else if (aiResult.decision === 'manual_review') {
            state.step('manual_review', {});
            await this.assignToExpert(property_id, aiResult);
        } else {
            state.step('rejected', { reason: aiResult.reason });
            await this.rejectProperty(property_id, aiResult.reason);
        }

        await auditLogger.log({
            user_id,
            action_type: 'workflow_property_sale',
            action_category: 'automation',
            resource_type: 'property',
            resource_id: property_id.toString(),
            description: `فروش ملک: ${aiResult.decision}`,
            status: 'success',
            processing_time: state.getDuration()
        });

        eventBus.emit('workflow.completed', {
            workflow: this.name,
            property_id,
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

    async getProperty(propertyId) {
        const rows = await db.query(
            `SELECT p.*, u.national_code, u.full_name, u.phone
             FROM properties p
             JOIN users u ON u.id = p.user_id
             WHERE p.id = ?`,
            [propertyId]
        );
        return rows[0];
    }

    async publishProperty(propertyId, userId) {
        await db.query(
            `UPDATE properties 
             SET status = 'active', published_at = NOW()
             WHERE id = ?`,
            [propertyId]
        );

        eventBus.emit('property.published', {
            property_id: propertyId,
            user_id: userId
        });

        logger.info(`ملک ${propertyId} منتشر شد`);
    }

    async assignToExpert(propertyId, aiResult) {
        await db.query(
            `INSERT INTO review_queue 
             (property_id, ai_result, priority, status, created_at)
             VALUES (?, ?, 'normal', 'pending', NOW())`,
            [propertyId, JSON.stringify(aiResult)]
        );

        eventBus.emit('property.assigned_to_review', {
            property_id: propertyId
        });

        logger.info(`ملک ${propertyId} به صف کارشناس ارجاع شد`);
    }

    async rejectProperty(propertyId, reason) {
        await db.query(
            `UPDATE properties 
             SET status = 'rejected', rejection_reason = ?
             WHERE id = ?`,
            [reason, propertyId]
        );

        eventBus.emit('property.rejected', {
            property_id: propertyId,
            reason
        });

        logger.warn(`ملک ${propertyId} رد شد: ${reason}`);
    }
}

module.exports = PropertySaleWorkflow;
