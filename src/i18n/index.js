/**
 * i18n - لایه چندزبانه
 */

const logger = require('../core/logger');
const LanguageDetector = require('./LanguageDetector');
const Translator = require('./Translator');
const Localizer = require('./Localizer');

class I18n {
    constructor() {
        this.detector = new LanguageDetector();
        this.translator = new Translator();
        this.localizer = new Localizer();

        this.supportedLanguages = [
            'fa', 'en', 'ar', 'tr', 'ur', 'ps', 'ku', 'az', 'ru',
            'zh', 'fr', 'de', 'es', 'hi', 'ja', 'ko'
        ];

        this.defaultLanguage = 'fa';
    }

    async initialize() {
        logger.info('راه‌اندازی لایه i18n...');
        await this.translator.loadTranslations();
        logger.info(`پشتیبانی از ${this.supportedLanguages.length} زبان`);
    }

    detectLanguage(req) {
        return this.detector.detect(req);
    }

    translate(key, language = this.defaultLanguage, params = {}) {
        return this.translator.translate(key, language, params);
    }

    localize(data, language, country) {
        return this.localizer.localize(data, language, country);
    }

    isSupported(language) {
        return this.supportedLanguages.includes(language);
    }
}

module.exports = new I18n();
