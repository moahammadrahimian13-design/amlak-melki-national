/**
 * رمزنگاری AES-256-GCM
 */

const crypto = require('crypto');

class Encryption {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.ivSize = 16;
        this.keySize = 32;
    }

    encrypt(text, secretKey) {
        const iv = crypto.randomBytes(this.ivSize);
        const cipher = crypto.createCipheriv(this.algorithm, secretKey, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const tag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString('hex'),
            tag: tag.toString('hex')
        };
    }

    decrypt(encryptedData, secretKey) {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            secretKey,
            Buffer.from(encryptedData.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    hash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    hmac(data, key) {
        return crypto.createHmac('sha256', key).update(data).digest('hex');
    }

    randomString(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }
}

module.exports = new Encryption();
