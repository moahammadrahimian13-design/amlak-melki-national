/**
 * Hash Chain - زنجیره هش برای امنیت
 */

const crypto = require('crypto');
const db = require('../core/database');
const logger = require('../core/logger');

class HashChain {
    constructor() {
        this.chainKey = process.env.AUDIT_CHAIN_KEY || 'default-chain-key';
    }

    generateHash(data, previousHash) {
        const content = {
            data,
            previous_hash: previousHash,
            timestamp: Date.now()
        };

        return crypto
            .createHmac('sha256', this.chainKey)
            .update(JSON.stringify(content))
            .digest('hex');
    }

    async getLastHash(chainType) {
        const [rows] = await db.query(
            `SELECT last_hash FROM hash_chain WHERE chain_type = ?`,
            [chainType]
        );
        return rows[0]?.last_hash || '0'.repeat(64);
    }

    async verify(chainType, tableName) {
        logger.info(`بررسی زنجیره ${chainType}...`);

        const [records] = await db.query(
            `SELECT id, previous_hash, current_hash 
             FROM ${tableName} ORDER BY id ASC`
        );

        let previousHash = '0'.repeat(64);
        let isValid = true;
        const errors = [];

        for (const record of records) {
            if (record.previous_hash !== previousHash) {
                isValid = false;
                errors.push({
                    record_id: record.id,
                    expected: previousHash,
                    actual: record.previous_hash
                });
            }
            previousHash = record.current_hash;
        }

        await db.query(
            `UPDATE hash_chain 
             SET last_verified_at = NOW(), is_valid = ?,
                 verification_error = ?
             WHERE chain_type = ?`,
            [isValid, errors.length > 0 ? JSON.stringify(errors) : null, chainType]
        );

        logger.info(`بررسی ${chainType}: ${isValid ? 'سالم' : 'مشکل‌دار'}`);
        return { valid: isValid, records: records.length, errors };
    }
}

module.exports = new HashChain();
