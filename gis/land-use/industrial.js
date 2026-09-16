/**
 * اراضی صنعتی
 */

module.exports = {
    category: 'industrial',
    name: 'اراضی صنعتی',
    types: {
        factory: {
            code: 'IND_FAC',
            name: 'کارخانه',
            requiredDocs: ['سند مالکیت', 'پروانه بهره‌برداری', 'مجوز محیط زیست'],
            legalRules: {
                minArea: 1000,
                bufferZone: 500,
                environmentalPermit: true
            },
            appraisalFactors: ['متراژ', 'تجهیزات', 'موقعیت', 'دسترسی']
        },
        workshop: {
            code: 'IND_WRK',
            name: 'کارگاه',
            requiredDocs: ['سند مالکیت', 'پروانه کسب', 'مجوز شهرداری'],
            legalRules: {
                minArea: 200,
                maxArea: 1000
            },
            appraisalFactors: ['متراژ', 'تجهیزات', 'برق سه‌فاز']
        },
        mine: {
            code: 'IND_MIN',
            name: 'معدن',
            requiredDocs: ['سند', 'پروانه بهره‌برداری', 'مجوز وزارت صمت'],
            legalRules: {
                miningLaw: 'قانون معادن',
                environmentalAssessment: true
            },
            appraisalFactors: ['نوع ماده', 'ذخیره', 'موقعیت', 'دسترسی']
        },
        refinery: {
            code: 'IND_REF',
            name: 'پالایشگاه',
            requiredDocs: ['سند', 'مجوز وزارت نفت', 'مجوز محیط زیست'],
            legalRules: {
                specialPermit: true,
                highSecurity: true
            },
            appraisalFactors: ['ظرفیت', 'تجهیزات', 'موقعیت']
        },
        warehouse: {
            code: 'IND_WHS',
            name: 'انبار صنعتی',
            requiredDocs: ['سند مالکیت', 'پایان کار', 'مجوز آتش‌نشانی'],
            legalRules: {
                fireSafety: 'الزامی',
                minHeight: 6
            },
            appraisalFactors: ['متراژ', 'ارتفاع', 'دسترسی', 'تجهیزات']
        },
        industrialPark: {
            code: 'IND_PRK',
            name: 'شهرک صنعتی',
            requiredDocs: ['سند', 'مجوز شهرک', 'اساسنامه'],
            legalRules: {
                infrastructure: 'کامل',
                sharedFacilities: true
            },
            appraisalFactors: ['واحد', 'زیرساخت', 'موقعیت']
        }
    },
    restrictions: {
        distanceFromResidential: 500,
        distanceFromWater: 1000,
        environmentalImpact: 'required',
        noiseLevel: 'limited',
        wasteManagement: 'required'
    }
};
