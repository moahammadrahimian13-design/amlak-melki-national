/**
 * Audit Logger - ثبت کامل رویدادهای سیستم
 */

const crypto = require('crypto');
const db = require('../core/database');
const logger = require('../core/logger');
const eventBus = require('../core/eventBus');

class AuditLogger {
    constructor() {
        this.chainKey = process.env.AUDIT_CHAIN_KEY || 'default-chain-key';
        this.signingKey = process.env.AUDIT_SIGNING_KEY || 'default-signing-key';
    }

    async log(data) {
        try {
            const record = await this.buildRecord(data);

            const [result] = await db.query(
                `INSERT INTO audit_trail 
                 (user_id, action_type, action_category, severity,
                  resource_type, resource_id, description, status,
                  ip_address, user_agent, processing_time,
                  previous_hash, current_hash, signature, server_timestamp)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    record.user_id, record.action_type, record.action_category,
                    record.severity, record.resource_type, record.resource_id,
                    record.description, record.status,
                    record.ip_address, record.user_agent, record.processing_time,
                    record.previous_hash, record.current_hash, record.signature,
                    record.server_timestamp
                ]
            );

            await this.updateChain(record.current_hash, result.insertId);
            eventBus.emit('audit.logged', { id: result.insertId, action: record.action_type });

            return result.insertId;
        } catch (error) {
            logger.error('خطا در ثبت Audit:', error);
            return null;
        }
    }

    async buildRecord(data) {
        const [lastHash] = await db.query(
            `SELECT last_hash FROM hash_chain WHERE chain_type = 'audit'`
        );
        const previousHash = lastHash[0]?.last_hash || '0'.repeat(64);
        const serverTimestamp = Date.now();

        const hashContent = {
            user_id: data.user_id || null,
            action_type: data.action_type,
            resource_id: data.resource_id || null,
            status: data.status,
            timestamp: serverTimestamp,
            previous_hash: previousHash
        };

        const currentHash = crypto
            .createHmac('sha256', this.chainKey)
            .update(JSON.stringify(hashContent))
            .digest('hex');

        const signature = crypto
            .createHmac('sha256', this.signingKey)
            .update(currentHash)
            .digest('hex');

        return {
            user_id: data.user_id || null,
            action_type: data.action_type,
            action_category: data.action_category || 'system',
            severity: data.severity || 'info',
            resource_type: data.resource_type || null,
            resource_id: data.resource_id || null,
            description: data.description || null,
            status: data.status || 'success',
            ip_address: data.ip_address || null,
            user_agent: data.user_agent || null,
            processing_time: data.processing_time || 0,
            previous_hash: previousHash,
            current_hash: currentHash,
            signature: signature,
            server_timestamp: serverTimestamp
        };
    }

    async updateChain(newHash, recordId) {
        const [existing] = await db.query(
            `SELECT * FROM hash_chain WHERE chain_type = 'audit'`
        );

        if (existing[0]) {
            await db.query(
                `UPDATE hash_chain 
                 SET last_hash = ?, last_record_id = ?, 
                     total_records = total_records + 1, updated_at = NOW()
                 WHERE chain_type = 'audit'`,
                [newHash, recordId]
            );
        } else {
            await db.query(
                `INSERT INTO hash_chain 
                 (chain_type, last_hash, last_record_id, total_records)
                 VALUES ('audit', ?, ?, 1)`,
                [newHash, recordId]
            );
        }
    }

    async verifyChain() {
        const [records] = await db.query(
            `SELECT id, previous_hash, current_hash 
             FROM audit_trail ORDER BY id ASC`
        );

        let previousHash = '0'.repeat(64);
        let isValid = true;

        for (const record of records) {
            if (record.previous_hash !== previousHash) {
                isValid = false;
                break;
            }
            previousHash = record.current_hash;
        }

        return { valid: isValid, records: records.length };
    }
}

module.exports = new AuditLogger();
