/**
 * منابع آب
 */

module.exports = {
    category: 'water',
    name: 'منابع آب',
    types: {
        sea: {
            code: 'WTR_SEA',
            name: 'دریا',
            requiredDocs: ['سند', 'نظر سازمان بنادر', 'نظر محیط زیست'],
            legalRules: {
                bufferZone: 60,
                construction: 'ممنوع',
                publicAccess: 'آزاد'
            },
            appraisalFactors: ['فاصله تا دریا', 'متراژ', 'دید دریا']
        },
        river: {
            code: 'WTR_RIV',
            name: 'رودخانه',
            requiredDocs: ['سند', 'نظر آب منطقه‌ای', 'نظر محیط زیست'],
            legalRules: {
                bufferZone: 'حریم قانونی',
                construction: 'محدود',
                waterRights: 'الزامی'
            },
            appraisalFactors: ['فاصله تا رودخانه', 'متراژ', 'منبع آب']
        },
        lake: {
            code: 'WTR_LAK',
            name: 'دریاچه',
            requiredDocs: ['سند', 'نظر آب منطقه‌ای', 'نظر محیط زیست'],
            legalRules: {
                bufferZone: 'حریم قانونی',
                protection: 'الزامی'
            },
            appraisalFactors: ['فاصله تا دریاچه', 'متراژ', 'دید']
        },
        wetland: {
            code: 'WTR_WTL',
            name: 'تالاب',
            requiredDocs: ['سند', 'نظر محیط زیست', 'کنوانسیون رامسر'],
            legalRules: {
                protection: 'کنوانسیون رامسر',
                construction: 'ممنوع',
                hunting: 'ممنوع'
            },
            appraisalFactors: ['متراژ', 'تنوع زیستی', 'گردشگری']
        },
        dam: {
            code: 'WTR_DAM',
            name: 'سد',
            requiredDocs: ['سند', 'نظر آب منطقه‌ای', 'نظر وزارت نیرو'],
            legalRules: {
                bufferZone: 'حریم سد',
                security: 'بالا'
            },
            appraisalFactors: ['ظرفیت آب', 'تولید برق', 'موقعیت']
        },
        canal: {
            code: 'WTR_CAN',
            name: 'کانال',
            requiredDocs: ['سند', 'نظر آب منطقه‌ای'],
            legalRules: {
                maintenance: 'الزامی',
                waterRights: 'الزامی'
            },
            appraisalFactors: ['طول', 'عرض', 'دبی']
        },
        qanat: {
            code: 'WTR_QAN',
            name: 'قنات',
            requiredDocs: ['سند', 'نظر آب منطقه‌ای', 'نظر میراث فرهنگی'],
            legalRules: {
                preservation: 'الزامی',
                heritage: 'ممکن است'
            },
            appraisalFactors: ['طول', 'دبی', 'قدمت']
        },
        well: {
            code: 'WTR_WEL',
            name: 'چاه',
            requiredDocs: ['سند', 'پروانه حفر', 'مجوز بهره‌برداری'],
            legalRules: {
                permit: 'الزامی',
                depth: 'محدود',
                waterRights: 'الزامی'
            },
            appraisalFactors: ['عمق', 'دبی', 'کیفیت آب']
        },
        spring: {
            code: 'WTR_SPR',
            name: 'چشمه',
            requiredDocs: ['سند', 'نظر آب منطقه‌ای', 'نظر منابع طبیعی'],
            legalRules: {
                protection: 'الزامی'
            },
            appraisalFactors: ['دبی', 'کیفیت آب', 'موقعیت']
        },
        waterfall: {
            code: 'WTR_WFL',
            name: 'آبشار',
            requiredDocs: ['سند', 'نظر منابع طبیعی', 'نظر میراث فرهنگی'],
            legalRules: {
                protection: 'الزامی',
                tourism: 'با مجوز'
            },
            appraisalFactors: ['ارتفاع', 'دبی', 'گردشگری']
        }
    },
    restrictions: {
        constructionBuffer: 60,
        waterRights: 'required',
        environmentalProtection: 'mandatory',
        publicAccess: 'regulated'
    }
};
