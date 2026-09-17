/**
 * ============================================================
 *  🏛️ هسته اصلی پلتفرم ملی املاک ملکی (Core)
 *  نسخه: 1.0.0
 *  توضیحات: مدیریت تنظیمات، کاربران و ساختار کلی
 * ============================================================
 */

const EventEmitter = require('events');

class Core extends EventEmitter {
    constructor() {
        super();
        this.version = '1.0.0';
        this.config = {
            platformName: 'پلتفرم ملی املاک ملکی',
            defaultLanguage: 'fa',
            supportedLanguages: ['fa', 'en', 'ar'],
            currency: 'IRR',
            timezone: 'Asia/Tehran',
            maxUploadSize: '10mb',
            features: {
                ai: true,
                audit: true,
                appointment: true,
                automation: true,
                integrations: true,
                voice: true,
                workflow: true,
                translator: true,
                gis: true
            }
        };
        this.users = new Map();
        this.settings = new Map();
        this.logs = [];
    }

    // ==================== مدیریت کاربران ====================
    registerUser(userData) {
        if (!userData.id || !userData.name) {
            throw new Error('اطلاعات کاربر ناقص است');
        }
        const user = {
            id: userData.id,
            name: userData.name,
            role: userData.role || 'user',
            phone: userData.phone || null,
            email: userData.email || null,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        this.users.set(user.id, user);
        this.log('USER_REGISTERED', user);
        return user;
    }

    getUser(userId) {
        return this.users.get(userId) || null;
    }

    // ==================== مدیریت تنظیمات ====================
    setSetting(key, value) {
        this.settings.set(key, {
            value,
            updatedAt: new Date().toISOString()
        });
        this.log('SETTING_CHANGED', { key, value });
        return true;
    }

    getSetting(key) {
        const setting = this.settings.get(key);
        return setting ? setting.value : null;
    }

    // ==================== سیستم لاگ ====================
    log(action, data) {
        const logEntry = {
            id: `log_${Date.now()}`,
            action,
            data,
            timestamp: new Date().toISOString()
        };
        this.logs.push(logEntry);
        this.emit('log', logEntry);
        return logEntry;
    }

    getLogs(limit = 100) {
        return this.logs.slice(-limit);
    }

    // ==================== اطلاعات سیستم ====================
    getSystemInfo() {
        return {
            version: this.version,
            platform: this.config.platformName,
            uptime: process.uptime(),
            usersCount: this.users.size,
            settingsCount: this.settings.size,
            logsCount: this.logs.length,
            features: this.config.features
        };
    }
}

module.exports = new Core();
