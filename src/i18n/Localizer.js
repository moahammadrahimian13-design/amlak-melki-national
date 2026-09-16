/**
 * Localizer - بومی‌سازی داده‌ها
 */

class Localizer {
    constructor() {
        this.calendars = {
            'IR': 'jalali',
            'AF': 'hijri',
            'AE': 'hijri',
            'SA': 'hijri',
            'IQ': 'hijri',
            'TR': 'gregorian'
        };

        this.currencies = {
            'IR': 'IRR',
            'AF': 'AFN',
            'AE': 'AED',
            'SA': 'SAR',
            'IQ': 'IQD',
            'TR': 'TRY'
        };
    }

    /**
     * بومی‌سازی داده
     */
    localize(data, language = 'fa', country = 'IR') {
        if (!data) return data;

        const result = { ...data };

        // تبدیل تاریخ‌ها
        if (result.created_at) {
            result.created_at_localized = this.formatDate(
                result.created_at, language, country
            );
        }

        // تبدیل ارز
        if (result.price && result.currency) {
            result.price_localized = this.formatCurrency(
                result.price, result.currency, language
            );
        }

        // تبدیل اعداد
        if (result.amount) {
            result.amount_localized = this.formatNumber(
                result.amount, language
            );
        }

        return result;
    }

    /**
     * فرمت تاریخ
     */
    formatDate(date, language = 'fa', country = 'IR') {
        if (!date) return '';

        try {
            const d = new Date(date);
            const calendar = this.calendars[country] || 'gregorian';

            if (calendar === 'jalali') {
                return new Intl.DateTimeFormat('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(d);
            }

            if (calendar === 'hijri') {
                return new Intl.DateTimeFormat('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    calendar: 'islamic'
                }).format(d);
            }

            const locales = {
                fa: 'fa-IR',
                en: 'en-US',
                ar: 'ar-SA',
                tr: 'tr-TR'
            };

            return new Intl.DateTimeFormat(
                locales[language] || 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
            ).format(d);

        } catch (error) {
            return date.toString();
        }
    }

    /**
     * فرمت ارز
     */
    formatCurrency(amount, currency = 'IRR', language = 'fa') {
        const locales = {
            fa: 'fa-IR',
            en: 'en-US',
            ar: 'ar-SA',
            tr: 'tr-TR'
        };

        try {
            return new Intl.NumberFormat(
                locales[language] || 'en-US',
                {
                    style: 'currency',
                    currency: currency,
                    maximumFractionDigits: 0
                }
            ).format(amount);
        } catch (error) {
            return `${amount} ${currency}`;
        }
    }

    /**
     * فرمت اعداد
     */
    formatNumber(number, language = 'fa') {
        const locales = {
            fa: 'fa-IR',
            en: 'en-US',
            ar: 'ar-SA',
            tr: 'tr-TR'
        };

        try {
            return new Intl.NumberFormat(
                locales[language] || 'en-US'
            ).format(number);
        } catch (error) {
            return number.toString();
        }
    }

    /**
     * فرمت درصد
     */
    formatPercent(value, language = 'fa') {
        const locales = {
            fa: 'fa-IR',
            en: 'en-US',
            ar: 'ar-SA',
            tr: 'tr-TR'
        };

        try {
            return new Intl.NumberFormat(
                locales[language] || 'en-US',
                { style: 'percent', maximumFractionDigits: 2 }
            ).format(value / 100);
        } catch (error) {
            return `${value}%`;
        }
    }
}

module.exports = Localizer;
