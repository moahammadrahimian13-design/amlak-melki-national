/**
 * اراضی زراعی و کشاورزی
 */

module.exports = {
    category: 'agricultural',
    name: 'اراضی زراعی و کشاورزی',
    types: {
        irrigated: {
            code: 'AGR_IRR',
            name: 'زراعی آبی',
            requiredDocs: ['سند مالکیت', 'پروانه بهره‌برداری', 'نظر جهاد کشاورزی'],
            legalRules: {
                waterRights: 'الزامی',
                landUse: 'کشاورزی'
            },
            appraisalFactors: ['متراژ', 'منبع آب', 'نوع کشت', 'موقعیت']
        },
        dry: {
            code: 'AGR_DRY',
            name: 'زراعی دیم',
            requiredDocs: ['سند مالکیت', 'پروانه بهره‌برداری'],
            legalRules: {
                rainfall: 'حداقل ۲۵۰ میلی‌متر'
            },
            appraisalFactors: ['متراژ', 'بارش', 'نوع کشت']
        },
        garden: {
            code: 'AGR_GRD',
            name: 'باغ',
            requiredDocs: ['سند مالکیت', 'پروانه بهره‌برداری'],
            legalRules: {
                minTrees: 50,
                fruitTypes: 'متنوع'
            },
            appraisalFactors: ['متراژ', 'نوع درختان', 'سن درختان']
        },
        greenhouse: {
            code: 'AGR_GRH',
            name: 'گلخانه',
            requiredDocs: ['سند', 'پروانه بهره‌برداری', 'مجوز جهاد'],
            legalRules: {
                structure: 'استاندارد'
            },
            appraisalFactors: ['متراژ', 'نوع سازه', 'تجهیزات']
        },
        dairy: {
            code: 'AGR_DAI',
            name: 'دامداری',
            requiredDocs: ['سند', 'پروانه بهره‌برداری', 'مجوز دامپزشکی'],
            legalRules: {
                capacity: 'حداقل ۲۰ رأس'
            },
            appraisalFactors: ['ظرفیت', 'تجهیزات', 'موقعیت']
        },
        poultry: {
            code: 'AGR_PLT',
            name: 'مرغداری',
            requiredDocs: ['سند', 'پروانه بهره‌برداری', 'مجوز دامپزشکی'],
            legalRules: {
                capacity: 'حداقل ۵۰۰۰ قطعه'
            },
            appraisalFactors: ['ظرفیت', 'تجهیزات', 'سیستم تهویه']
        }
    }
};
