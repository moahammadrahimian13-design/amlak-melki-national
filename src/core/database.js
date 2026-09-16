/**
 * اتصال دیتابیس با Connection Pool
 */

const mysql = require('mysql2');
const logger = require('./logger');
const config = require('./config');

class Database {
    constructor() {
        this.pool = null;
        this.isConnected = false;
    }

    async connect(retries = 5) {
        const dbConfig = {
            host: config.database.host,
            port: config.database.port,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database,
            waitForConnections: true,
            connectionLimit: config.database.connectionLimit,
            queueLimit: 0,
            charset: 'utf8mb4'
        };

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                this.pool = mysql.createPool(dbConfig).promise();
                await this.ping();
                this.isConnected = true;
                logger.info('اتصال به دیتابیس برقرار شد');
                return;
            } catch (error) {
                logger.warn(`تلاش ${attempt}: ${error.message}`);
                if (attempt < retries) {
                    await this.sleep(2000 * attempt);
                } else {
                    throw new Error('اتصال به دیتابیس ناموفق');
                }
            }
        }
    }

    async ping() {
        if (!this.pool) return false;
        await this.pool.query('SELECT 1');
        return true;
    }

    async query(sql, params = []) {
        if (!this.isConnected) throw new Error('دیتابیس متصل نیست');
        const [rows] = await this.pool.execute(sql, params);
        return rows;
    }

    async disconnect() {
        if (this.pool) {
            await this.pool.end();
            this.isConnected = false;
            logger.info('اتصال دیتابیس قطع شد');
        }
    }

    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
}

module.exports = new Database();
