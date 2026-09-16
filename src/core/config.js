/**
 * تنظیمات مرکزی پروژه
 */

require('dotenv').config();

module.exports = {
    app: {
        name: process.env.APP_NAME || 'املاک ملکی',
        env: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT) || 3000,
        baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    },

    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'amlak_national',
        connectionLimit: 10
    },

    security: {
        jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
        jwtExpire: process.env.JWT_EXPIRE || '30d',
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
        otpExpireMinutes: 2,
        maxLoginAttempts: 5
    },

    vault: {
        path: process.env.VAULT_PATH || './vault',
        masterKey: process.env.VAULT_MASTER_KEY,
        auditChainKey: process.env.AUDIT_CHAIN_KEY
    },

    sms: {
        provider: 'kavenegar',
        apiKey: process.env.KAVENEGAR_API_KEY,
        sender: process.env.KAVENEGAR_SENDER || '10008663'
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
        dir: process.env.LOG_DIR || './logs'
    }
};
