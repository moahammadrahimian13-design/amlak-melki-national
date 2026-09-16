/**
 * کاربری مسکونی
 */

module.exports = {
    category: 'residential',
    name: 'اراضی مسکونی',
    types: {
        apartment: {
            code: 'RES_APT',
            name: 'آپارتمان',
            requiredDocs: ['سند مالکیت', 'نقشه', 'پایان کار', 'اساسنامه ساختمان'],
            legalRules: {
                maxFloors: 20,
                minArea: 30,
                parkingRequired: true,
                elevatorRequired: true
            },
            appraisalFactors: ['متراژ', 'طبقه', 'سال ساخت', 'امکانات', 'موقعیت']
        },
        villa: {
            code: 'RES_VIL',
            name: 'ویلایی',
            requiredDocs: ['سند مالکیت', 'نقشه', 'پایان کار'],
            legalRules: {
                maxArea: 500,
                gardenAllowed: true
            },
            appraisalFactors: ['متراژ زمین', 'متراژ بنا', 'حیاط', 'استخر', 'موقعیت']
        },
        land: {
            code: 'RES_LND',
            name: 'زمین مسکونی',
            requiredDocs: ['سند مالکیت', 'نقشه', 'پروانه ساخت'],
            legalRules: {
                minArea: 100,
                maxArea: 1000
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'دسترسی']
        },
        complex: {
            code: 'RES_COM',
            name: 'مجتمع مسکونی',
            requiredDocs: ['سند', 'نقشه', 'پایان کار', 'اساسنامه', 'صورتجلسه'],
            legalRules: {
                units: 'حداقل ۱۰ واحد',
                facilities: 'الزامی'
            },
            appraisalFactors: ['واحد', 'مشاعات', 'امکانات مشترک']
        }
    }
};
