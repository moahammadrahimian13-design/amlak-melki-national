/**
 * Holiday Manager - مدیریت تعطیلات
 */

class HolidayManager {
    constructor() {
        this.nationalHolidays = [
            { jalali: '01/01', title: 'نوروز' },
            { jalali: '01/02', title: 'نوروز' },
            { jalali: '01/03', title: 'نوروز' },
            { jalali: '01/04', title: 'نوروز' },
            { jalali: '01/12', title: 'روز جمهوری اسلامی' },
            { jalali: '01/13', title: 'سیزده بدر' },
            { jalali: '11/22', title: 'پیروزی انقلاب' },
            { jalali: '12/29', title: 'ملی شدن نفت' }
        ];

        this.religiousHolidays = [
            { jalali: '01/22', title: 'عید فطر' },
            { jalali: '03/28', title: 'عید قربان' },
            { jalali: '04/26', title: 'عاشورا' },
            { jalali: '05/04', title: 'اربعین' },
            { jalali: '06/12', title: 'رحلت پیامبر' },
            { jalali: '06/26', title: 'میلاد پیامبر' }
        ];

        this.weekDays = [
            'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه',
            'چهارشنبه', 'پنجشنبه', 'جمعه'
        ];
    }

    async initialize() {
        console.log('Holiday Manager آماده شد');
    }

    /**
     * بررسی تعطیل بودن یک تاریخ
     */
    async isHoliday(date) {
        const d = new Date(date);
        const dayOfWeek = d.getDay();

        // جمعه در ایران (getDay = 5)
        if (dayOfWeek === 5) {
            return { holiday: true, reason: 'جمعه' };
        }

        const jalali = this.toJalali(d);
        const key = `${jalali.month}/${jalali.day}`;

        // تعطیلات ملی
        for (const h of this.nationalHolidays) {
            if (h.jalali === key) {
                return { holiday: true, reason: h.title };
            }
        }

        // تعطیلات مذهبی
        for (const h of this.religiousHolidays) {
            if (h.jalali === key) {
                return { holiday: true, reason: h.title };
            }
        }

        return { holiday: false };
    }

    /**
     * تبدیل میلادی به شمسی (ساده‌شده)
     */
    toJalali(date) {
        // در محیط واقعی: استفاده از کتابخانه jalali-moment
        const d = new Date(date);
        return {
            year: d.getFullYear() - 621,
            month: String(d.getMonth() + 1).padStart(2, '0'),
            day: String(d.getDate()).padStart(2, '0')
        };
    }

    /**
     * دریافت لیست تعطیلات
     */
    async getYearHolidays() {
        return {
            national: this.nationalHolidays,
            religious: this.religiousHolidays
        };
    }

    /**
     * بررسی روز کاری
     */
    async isWorkingDay(date) {
        const result = await this.isHoliday(date);
        return !result.holiday;
    }
}

module.exports = HolidayManager;
