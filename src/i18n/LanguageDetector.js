/**
 * Language Detector - تشخیص زبان کاربر
 */

class LanguageDetector {
    constructor() {
        this.supported = [
            'fa', 'en', 'ar', 'tr', 'ur', 'ps', 'ku', 'az', 'ru',
            'zh-CN', 'zh-TW', 'hi', 'ja', 'ko', 'bn', 'ms', 'id',
            'th', 'vi', 'tl', 'my', 'km', 'lo', 'kk', 'uz', 'tk',
            'ky', 'tg', 'hy', 'ka', 'mn', 'ne', 'si', 'ta', 'te',
            'mr', 'gu', 'kn', 'ml', 'pa', 'dv', 'dz'
        ];
        this.default = 'fa';
    }

    detect(req) {
        // ۱. از URL query
        if (req?.query?.lang && this.supported.includes(req.query.lang)) {
            return req.query.lang;
        }

        // ۲. از Header
        if (req?.headers?.['accept-language']) {
            const languages = req.headers['accept-language']
                .split(',')
                .map(l => l.split(';')[0].trim().substring(0, 5));

            for (const lang of languages) {
                if (this.supported.includes(lang)) {
                    return lang;
                }
                const short = lang.substring(0, 2);
                if (this.supported.includes(short)) {
                    return short;
                }
            }
        }

        // ۳. از کاربر لاگین‌شده
        if (req?.user?.language && this.supported.includes(req.user.language)) {
            return req.user.language;
        }

        // ۴. پیش‌فرض
        return this.default;
    }

    isSupported(language) {
        return this.supported.includes(language);
    }

    getSupported() {
        return this.supported;
    }
}

module.exports = LanguageDetector;
