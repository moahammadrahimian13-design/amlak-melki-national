/**
 * Document Vault - گاوصندوق امن مدارک
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const db = require('../core/database');
const logger = require('../core/logger');
const auditLogger = require('./AuditLogger');

class DocumentVault {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.ivSize = 16;
        this.keySize = 32;
        this.masterKey = this.loadMasterKey();
        this.vaultPath = process.env.VAULT_PATH || './vault';
    }

    loadMasterKey() {
        const key = process.env.VAULT_MASTER_KEY;
        if (!key || key.length !== 64) {
            return Buffer.alloc(32);
        }
        return Buffer.from(key, 'hex');
    }

    generateDocumentKey() {
        return crypto.randomBytes(this.keySize);
    }

    encryptDocumentKey(docKey) {
        const iv = crypto.randomBytes(this.ivSize);
        const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);
        let encrypted = cipher.update(docKey);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const tag = cipher.getAuthTag();
        return {
            encrypted_key: encrypted.toString('hex'),
            iv: iv.toString('hex'),
            tag: tag.toString('hex')
        };
    }

    decryptDocumentKey(encrypted) {
        const decipher = crypto.createDecipheriv(
            this.algorithm, this.masterKey, Buffer.from(encrypted.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));
        let decrypted = decipher.update(Buffer.from(encrypted.encrypted_key, 'hex'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted;
    }

    calculateHash(buffer) {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }

    async store(fileBuffer, metadata) {
        const startTime = Date.now();

        if (!fileBuffer || !metadata.user_id || !metadata.document_type) {
            throw new Error('اطلاعات ناقص');
        }

        const contentHash = this.calculateHash(fileBuffer);

        const docKey = this.generateDocumentKey();
        const iv = crypto.randomBytes(this.ivSize);
        const cipher = crypto.createCipheriv(this.algorithm, docKey, iv);
        let encrypted = cipher.update(fileBuffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        const encryptedKey = this.encryptDocumentKey(docKey);

        const timestamp = Date.now();
        const randomStr = crypto.randomBytes(8).toString('hex');
        const encryptedFilename = `${metadata.user_id}_${timestamp}_${randomStr}.enc`;
        const datePath = new Date().toISOString().split('T')[0].replace(/-/g, '/');
        const fullPath = path.join(
            this.vaultPath, metadata.document_type, datePath, encryptedFilename
        );

        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, encrypted);

        const [result] = await db.query(
            `INSERT INTO document_vault 
             (user_id, national_code, document_type, original_filename,
              encrypted_path, file_size, mime_type, encryption_algorithm,
              encryption_key_id, iv, auth_tag, checksum, content_hash,
              status, is_encrypted, is_sensitive)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', TRUE, TRUE)`,
            [
                metadata.user_id, metadata.national_code, metadata.document_type,
                metadata.original_filename || 'document', fullPath,
                fileBuffer.length, metadata.mime_type || 'application/octet-stream',
                this.algorithm, JSON.stringify(encryptedKey), iv.toString('hex'),
                authTag.toString('hex'), contentHash, contentHash
            ]
        );

        await auditLogger.log({
            user_id: metadata.user_id,
            action_type: 'document_store',
            action_category: 'document',
            resource_type: 'document',
            resource_id: result.insertId.toString(),
            description: `ذخیره سند ${metadata.document_type}`,
            status: 'success',
            processing_time: Date.now() - startTime
        });

        logger.info(`سند ذخیره شد: ${result.insertId}`);
        return { id: result.insertId, encrypted: true };
    }

    async retrieve(documentId, options = {}) {
        const [rows] = await db.query(
            `SELECT * FROM document_vault WHERE id = ?`, [documentId]
        );
        if (!rows[0]) throw new Error('سند یافت نشد');
        const doc = rows[0];

        const encryptedKey = JSON.parse(doc.encryption_key_id);
        const docKey = this.decryptDocumentKey(encryptedKey);
        const encryptedBuffer = await fs.readFile(doc.encrypted_path);

        const decipher = crypto.createDecipheriv(
            this.algorithm, docKey, Buffer.from(doc.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(doc.auth_tag, 'hex'));
        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        await db.query(
            `UPDATE document_vault SET access_count = access_count + 1,
             last_accessed_at = NOW() WHERE id = ?`,
            [documentId]
        );

        return {
            buffer: decrypted,
            metadata: {
                id: doc.id, document_type: doc.document_type,
                original_filename: doc.original_filename
            }
        };
    }
}

module.exports = new DocumentVault();
