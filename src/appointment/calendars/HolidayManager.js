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
            { jalali: '01/13', title: 'روز طبیعت' },
            { jalali: '11/22', title: 'پیروزی انقلاب اسلامی' },
            { jalali: '12/29', title: 'روز ملی شدن صنعت نفت' }
        ];

        this.religiousHolidays = [
            { jalali: '01/22', title: 'عید سعید فطر' },
            { jalali: '03/28', title: 'عید سعید قربان' },
            { jalali: '04/26', title: 'عاشورا' },
            { jalali: '05/04', title: 'اربعین' },
            { jalali: '06/12', title: 'رحلت پیامبر' },
            { jalali: '06/26', title: 'شهادت امام رضا' }
        ];
    }

    /**
     * بررسی تعطیل بودن یک تاریخ (فرمت MM/DD)
     * @param {string} monthDay - مثال: '01/01'
     * @returns {boolean}
     */
    isHoliday(monthDay) {
        const isNational = this.nationalHolidays.some(h => h.jalali === monthDay);
        const isReligious = this.religiousHolidays.some(h => h.jalali === monthDay);
        return isNational || isReligious;
    }

    /**
     * گرفتن عنوان تعطیلی
     * @param {string} monthDay - مثال: '01/01'
     * @returns {string|null}
     */
    getHolidayTitle(monthDay) {
        const holiday = this.nationalHolidays.find(h => h.jalali === monthDay)
            || this.religiousHolidays.find(h => h.jalali === monthDay);
        return holiday ? holiday.title : null;
    }
}

export default HolidayManager;
