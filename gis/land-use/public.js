/**
 * کاربری‌های عمومی
 */

module.exports = {
    category: 'public',
    name: 'کاربری‌های عمومی',
    types: {
        school: {
            code: 'PUB_SCH',
            name: 'مدرسه',
            requiredDocs: ['سند', 'مجوز آموزش و پرورش', 'پایان کار'],
            legalRules: {
                minArea: 2000,
                safety: 'الزامی',
                distanceFromNoise: 200
            },
            appraisalFactors: ['متراژ', 'ظرفیت', 'موقعیت', 'امکانات']
        },
        university: {
            code: 'PUB_UNI',
            name: 'دانشگاه',
            requiredDocs: ['سند', 'مجوز وزارت علوم', 'پایان کار'],
            legalRules: {
                minArea: 10000,
                facilities: 'کامل'
            },
            appraisalFactors: ['متراژ', 'رشته‌ها', 'امکانات', 'موقعیت']
        },
        hospital: {
            code: 'PUB_HOS',
            name: 'بیمارستان',
            requiredDocs: ['سند', 'مجوز وزارت بهداشت', 'پایان کار'],
            legalRules: {
                minArea: 5000,
                emergency: 'الزامی',
                helipad: 'اختیاری'
            },
            appraisalFactors: ['تخت', 'تجهیزات', 'موقعیت', 'تخصص‌ها']
        },
        clinic: {
            code: 'PUB_CLN',
            name: 'درمانگاه',
            requiredDocs: ['سند', 'مجوز بهداشت', 'پایان کار'],
            legalRules: {
                minArea: 500,
                facilities: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'تخصص‌ها', 'موقعیت']
        },
        mosque: {
            code: 'PUB_MSQ',
            name: 'مسجد',
            requiredDocs: ['سند', 'مجوز اوقاف', 'پایان کار'],
            legalRules: {
                minArea: 300,
                architecture: 'اسلامی'
            },
            appraisalFactors: ['متراژ', 'ظرفیت', 'موقعیت']
        },
        government: {
            code: 'PUB_GOV',
            name: 'اداره دولتی',
            requiredDocs: ['سند', 'مجوز اداری', 'پایان کار'],
            legalRules: {
                minArea: 1000,
                security: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'امکانات']
        },
        bank: {
            code: 'PUB_BNK',
            name: 'بانک',
            requiredDocs: ['سند', 'مجوز بانک مرکزی', 'پایان کار'],
            legalRules: {
                security: 'بالا',
                vault: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'امنیت']
        },
        postOffice: {
            code: 'PUB_PST',
            name: 'اداره پست',
            requiredDocs: ['سند', 'مجوز پست', 'پایان کار'],
            legalRules: {
                minArea: 300,
                access: 'آسان'
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'دسترسی']
        },
        police: {
            code: 'PUB_POL',
            name: 'کلانتری',
            requiredDocs: ['سند', 'مجوز نیروی انتظامی', 'پایان کار'],
            legalRules: {
                security: 'بالا',
                location: 'استراتژیک'
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'امکانات']
        },
        fireStation: {
            code: 'PUB_FIR',
            name: 'آتش‌نشانی',
            requiredDocs: ['سند', 'مجوز شهرداری', 'پایان کار'],
            legalRules: {
                access: 'سریع',
                equipment: 'استاندارد'
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'تجهیزات']
        },
        sportsComplex: {
            code: 'PUB_SPT',
            name: 'مجموعه ورزشی',
            requiredDocs: ['سند', 'مجوز ورزش و جوانان', 'پایان کار'],
            legalRules: {
                minArea: 2000,
                facilities: 'کامل'
            },
            appraisalFactors: ['متراژ', 'رشته‌ها', 'امکانات']
        },
        culturalCenter: {
            code: 'PUB_CUL',
            name: 'فرهنگسرا',
            requiredDocs: ['سند', 'مجوز شهرداری', 'پایان کار'],
            legalRules: {
                minArea: 1000,
                facilities: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'برنامه‌ها', 'موقعیت']
        },
        library: {
            code: 'PUB_LIB',
            name: 'کتابخانه',
            requiredDocs: ['سند', 'مجوز ارشاد', 'پایان کار'],
            legalRules: {
                minArea: 500,
                books: 'حداقل 5000 جلد'
            },
            appraisalFactors: ['متراژ', 'تعداد کتاب', 'موقعیت']
        },
        shoppingCenter: {
            code: 'PUB_SHP',
            name: 'مرکز خرید عمومی',
            requiredDocs: ['سند', 'پایان کار', 'پروانه کسب'],
            legalRules: {
                parking: 'الزامی',
                safety: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'واحد', 'موقعیت']
        }
    },
    priorities: {
        education: 'بالا',
        healthcare: 'بالا',
        security: 'بالا',
        culture: 'متوسط',
        sports: 'متوسط'
    }
};
