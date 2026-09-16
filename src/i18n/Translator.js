/**
 * Translator - ترجمه چندزبانه
 */

const logger = require('../core/logger');

class Translator {
    constructor() {
        this.translations = {};
    }

    async loadTranslations() {
        // در محیط واقعی: بارگذاری از فایل‌های locales/
        // الان: خالی
        logger.info('بارگذاری ترجمه‌ها...');
    }

    /**
     * ترجمه متن
     */
    translate(key, language = 'fa', params = {}) {
        // ۱. از ترجمه‌های بارگذاری‌شده
        let value = this.translations[language]?.[key];

        // ۲. از فارسی
        if (!value) {
            value = this.translations['fa']?.[key];
        }

        // ۳. اگر نبود، خود کلید
        if (!value) {
            value = key;
        }

        // جایگزینی متغیرها
        if (params && typeof value === 'string') {
            for (const [k, v] of Object.entries(params)) {
                value = value.replace(new RegExp(`{{${k}}}`, 'g'), v);
            }
        }

        return value;
    }

    /**
     * افزودن ترجمه‌ها
     */
    addTranslations(language, translations) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }
        Object.assign(this.translations[language], translations);
    }
}

module.exports = Translator;
