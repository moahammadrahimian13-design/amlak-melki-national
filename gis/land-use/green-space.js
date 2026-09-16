/**
 * فضای سبز
 */

module.exports = {
    category: 'green_space',
    name: 'فضای سبز',
    types: {
        park: {
            code: 'GRN_PRK',
            name: 'پارک',
            requiredDocs: ['سند', 'مجوز شهرداری', 'نقشه'],
            legalRules: {
                minArea: 1000,
                facilities: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'امکانات']
        },
        garden: {
            code: 'GRN_GRD',
            name: 'بوستان',
            requiredDocs: ['سند', 'مجوز شهرداری'],
            legalRules: {
                minArea: 500
            },
            appraisalFactors: ['متراژ', 'پوشش گیاهی']
        },
        urbanGreen: {
            code: 'GRN_URB',
            name: 'فضای سبز شهری',
            requiredDocs: ['مجوز شهرداری'],
            legalRules: {
                maintenance: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'موقعیت']
        },
        forestArtificial: {
            code: 'GRN_ART',
            name: 'جنگل مصنوعی',
            requiredDocs: ['سند', 'مجوز منابع طبیعی'],
            legalRules: {
                minTrees: 1000,
                protection: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'تعداد درختان', 'نوع درختان']
        },
        greenBelt: {
            code: 'GRN_BLT',
            name: 'کمربند سبز',
            requiredDocs: ['مجوز شهرداری'],
            legalRules: {
                width: 'حداقل 50 متر',
                protection: 'الزامی'
            },
            appraisalFactors: ['طول', 'عرض', 'پوشش گیاهی']
        },
        treeLine: {
            code: 'GRN_TRE',
            name: 'درختکاری حاشیه',
            requiredDocs: ['مجوز شهرداری'],
            legalRules: {
                spacing: 'استاندارد'
            },
            appraisalFactors: ['طول', 'تعداد درختان']
        },
        playground: {
            code: 'GRN_PLY',
            name: 'زمین بازی',
            requiredDocs: ['مجوز شهرداری', 'استاندارد ایمنی'],
            legalRules: {
                safety: 'الزامی',
                equipment: 'استاندارد'
            },
            appraisalFactors: ['متراژ', 'تجهیزات', 'ایمنی']
        },
        sportsField: {
            code: 'GRN_SPT',
            name: 'زمین ورزشی',
            requiredDocs: ['مجوز ورزش و جوانان', 'مجوز شهرداری'],
            legalRules: {
                standard: 'الزامی'
            },
            appraisalFactors: ['متراژ', 'نوع ورزش', 'تجهیزات']
        }
    },
    benefits: {
        environmental: ['کاهش آلودگی', 'تلطیف هوا', 'حفظ خاک'],
        social: ['تفریح', 'ورزش', 'آرامش'],
        economic: ['افزایش ارزش ملک', 'جذب گردشگر']
    }
};
