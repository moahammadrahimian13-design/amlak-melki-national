/**
 * اعتبارسنجی‌های مشترک
 */

const { ValidationError } = require('./errors');

const validators = {
    nationalCode(code) {
        if (!code || !/^\d{10}$/.test(code)) return false;
        if (/^(\d)\1{9}$/.test(code)) return false;

        const check = parseInt(code[9]);
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(code[i]) * (10 - i);
        }
        const r = sum % 11;
        return (r < 2 && check === r) || (r >= 2 && check === 11 - r);
    },

    phone(phone) {
        return /^09\d{9}$/.test(phone);
    },

    email(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    postalCode(code) {
        return /^\d{10}$/.test(code);
    },

    validateNationalCode(code) {
        if (!this.nationalCode(code)) {
            throw new ValidationError('کد ملی نامعتبر است');
        }
        return true;
    },

    validatePhone(phone) {
        if (!this.phone(phone)) {
            throw new ValidationError('شماره موبایل نامعتبر است');
        }
        return true;
    },

    validateRequired(data, fields) {
        const missing = fields.filter(f => !data[f]);
        if (missing.length) {
            throw new ValidationError(`فیلدهای اجباری: ${missing.join('، ')}`);
        }
        return true;
    }
};

module.exports = validators;
