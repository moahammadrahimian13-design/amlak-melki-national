/**
 * Chain Validator - اعتبارسنجی زنجیره خدمات
 * 
 * اصل: هر مرحله فقط بعد از تأیید مرحله قبلی فعال می‌شود
 */

const logger = require('../core/logger');

class ChainValidator {
    /**
     * بررسی امکان رزرو نوبت
     */
    async canBookAppointment(nationalCode, chainId, stepId) {
        // ۱. دریافت مرحله
        const step = await this.getStep(stepId);
        if (!step) {
            return {
                allowed: false,
                reason: 'مرحله یافت نشد'
            };
        }

        // ۲. اگر پیش‌نیاز نداره، آزاده
        if (!step.requires_step_id) {
            return { allowed: true };
        }

        // ۳. بررسی تأیید پیش‌نیاز
        const prerequisite = await this.checkPrerequisite(
            nationalCode,
            chainId,
            step.requires_step_id
        );

        if (!prerequisite.verified) {
            return {
                allowed: false,
                reason: `ابتدا باید مرحله "${prerequisite.step_name}" را تکمیل کنید`,
                prerequisite_step: prerequisite.step_name,
                prerequisite_status: prerequisite.status,
                action_required: `برای ادامه، نوبت "${prerequisite.step_name}" را بگیرید`
            };
        }

        return { allowed: true };
    }

    /**
     * بررسی تأیید پیش‌نیاز
     */
    async checkPrerequisite(nationalCode, chainId, prerequisiteStepId) {
        const db = require('../core/database');

        // ۱. بررسی وجود تأییدیه
        const [verified] = await db.query(
            `SELECT 
                sv.result,
                sv.verified_at,
                sv.valid_until,
                cs.step_name
             FROM step_verifications sv
             JOIN chain_steps cs ON cs.id = sv.step_id
             WHERE sv.national_code = ? 
               AND sv.chain_id = ? 
               AND sv.step_id = ?
               AND sv.result = 'approved'
               AND (sv.valid_until IS NULL OR sv.valid_until > CURDATE())
             ORDER BY sv.verified_at DESC
             LIMIT 1`,
            [nationalCode, chainId, prerequisiteStepId]
        );

        if (verified[0]) {
            return {
                verified: true,
                verified_at: verified[0].verified_at,
                step_name: verified[0].step_name
            };
        }

        // ۲. بررسی وجود درخواست در حال انجام
        const [pending] = await db.query(
            `SELECT 
                na.status,
                cs.step_name
             FROM national_appointments na
             JOIN chain_steps cs ON cs.id = na.step_id
             WHERE na.national_code = ?
               AND na.chain_id = ?
               AND na.step_id = ?
             ORDER BY na.booked_at DESC
             LIMIT 1`,
            [nationalCode, chainId, prerequisiteStepId]
        );

        if (pending[0]) {
            return {
                verified: false,
                status: pending[0].status,
                step_name: pending[0].step_name,
                message: this.getStatusMessage(pending[0].status)
            };
        }

        // ۳. مرحله قبلی انجام نشده
        const [stepInfo] = await db.query(
            `SELECT step_name FROM chain_steps WHERE id = ?`,
            [prerequisiteStepId]
        );

        return {
            verified: false,
            status: 'not_started',
            step_name: stepInfo[0]?.step_name || 'مرحله قبلی',
            message: 'این مرحله هنوز انجام نشده است'
        };
    }

    /**
     * پیام وضعیت
     */
    getStatusMessage(status) {
        const messages = {
            'pending': 'در انتظار تأیید',
            'confirmed': 'تأیید شده (هنوز نتیجه صادر نشده)',
            'in_progress': 'در حال انجام',
            'completed': 'در انتظار تأیید نهایی',
            'cancelled': 'لغو شده',
            'no_show': 'عدم حضور',
            'blocked': 'مسدود'
        };
        return messages[status] || status;
    }

    /**
     * دریافت مرحله
     */
    async getStep(stepId) {
        const db = require('../core/database');

        const [rows] = await db.query(
            `SELECT * FROM chain_steps WHERE id = ?`,
            [stepId]
        );

        return rows[0];
    }

    /**
     * دریافت مراحل بعدی ممکن
     */
    async getAvailableNextSteps(nationalCode, chainId) {
        const db = require('../core/database');

        const [steps] = await db.query(
            `SELECT * FROM chain_steps 
             WHERE chain_id = ? 
             ORDER BY step_order ASC`,
            [chainId]
        );

        const available = [];

        for (const step of steps) {
            const check = await this.canBookAppointment(
                nationalCode,
                chainId,
                step.id
            );

            if (check.allowed) {
                available.push({
                    ...step,
                    is_available: true
                });
            } else {
                available.push({
                    ...step,
                    is_available: false,
                    block_reason: check.reason,
                    action_required: check.action_required
                });
            }
        }

        return available;
    }
}

module.exports = ChainValidator;
