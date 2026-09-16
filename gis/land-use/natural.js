/**
 * منابع طبیعی
 */

module.exports = {
    category: 'natural',
    name: 'منابع طبیعی',
    types: {
        forest: {
            code: 'NAT_FOR',
            name: 'جنگل',
            requiredDocs: ['سند', 'نظر منابع طبیعی', 'نظر محیط زیست'],
            legalRules: {
                protection: 'قانون حفاظت از جنگل',
                cutting: 'ممنوع',
                construction: 'ممنوع',
                hunting: 'ممنوع'
            },
            appraisalFactors: ['متراژ', 'نوع درختان', 'تراکم', 'قدمت']
        },
        range: {
            code: 'NAT_RNG',
            name: 'مرتع',
            requiredDocs: ['سند', 'نظر منابع طبیعی', 'پروانه چرا'],
            legalRules: {
                grazing: 'با مجوز',
                construction: 'محدود'
            },
            appraisalFactors: ['متراژ', 'پوشش گیاهی', 'منبع آب', 'ظرفیت چرا']
        },
        desert: {
            code: 'NAT_DSR',
            name: 'بیابان',
            requiredDocs: ['سند', 'نظر منابع طبیعی'],
            legalRules: {
                construction: 'محدود',
                waterRights: 'خاص'
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'پتانسیل']
        },
        kavir: {
            code: 'NAT_KVR',
            name: 'کویر',
            requiredDocs: ['سند', 'نظر منابع طبیعی', 'نظر محیط زیست'],
            legalRules: {
                construction: 'ممنوع',
                tourism: 'با مجوز',
                mining: 'با مجوز'
            },
            appraisalFactors: ['متراژ', 'گردشگری', 'معدن', 'موقعیت']
        },
        marsh: {
            code: 'NAT_FRT',
            name: 'بیشه زار',
            requiredDocs: ['سند', 'نظر منابع طبیعی', 'نظر محیط زیست'],
            legalRules: {
                protection: 'قانون تالاب‌ها',
                construction: 'ممنوع'
            },
            appraisalFactors: ['متراژ', 'تنوع زیستی', 'اکوسیستم']
        },
        mountain: {
            code: 'NAT_MTN',
            name: 'کوه و ارتفاعات',
            requiredDocs: ['سند', 'نظر منابع طبیعی'],
            legalRules: {
                construction: 'محدود',
                mining: 'با مجوز'
            },
            appraisalFactors: ['ارتفاع', 'متراژ', 'منابع معدنی']
        },
        protectedArea: {
            code: 'NAT_PRT',
            name: 'منطقه حفاظت‌شده',
            requiredDocs: ['نظر سازمان محیط زیست'],
            legalRules: {
                protection: 'کامل',
                construction: 'ممنوع',
                entry: 'با مجوز'
            },
            appraisalFactors: ['تنوع زیستی', 'اهمیت زیست‌محیطی']
        },
        wildlifeRefuge: {
            code: 'NAT_WLD',
            name: 'پناهگاه حیات وحش',
            requiredDocs: ['نظر سازمان محیط زیست'],
            legalRules: {
                protection: 'کامل',
                hunting: 'ممنوع',
                construction: 'ممنوع'
            },
            appraisalFactors: ['تنوع زیستی', 'گونه‌های نادر']
        },
        nationalPark: {
            code: 'NAT_NPK',
            name: 'پارک ملی',
            requiredDocs: ['نظر سازمان محیط زیست', 'مصوبه مجلس'],
            legalRules: {
                protection: 'کامل',
                construction: 'ممنوع',
                tourism: 'محدود'
            },
            appraisalFactors: ['اهمیت ملی', 'تنوع زیستی', 'گردشگری']
        }
    },
    restrictions: {
        construction: 'strictly_prohibited',
        hunting: 'prohibited',
        treeCutting: 'prohibited',
        mining: 'requires_special_permit',
        environmentalAssessment: 'mandatory'
    },
    managingOrganizations: [
        'سازمان جنگل‌ها، مراتع و آبخیزداری',
        'سازمان حفاظت محیط زیست',
        'وزارت جهاد کشاورزی'
    ]
};
