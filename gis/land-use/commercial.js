/**
 * اراضی تجاری
 */

module.exports = {
    category: 'commercial',
    name: 'اراضی تجاری',
    types: {
        store: {
            code: 'COM_STR',
            name: 'مغازه',
            requiredDocs: ['سند مالکیت', 'پایان کار', 'پروانه کسب'],
            legalRules: {
                minArea: 15,
                businessLicense: true
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'گذر', 'دسترسی']
        },
        mall: {
            code: 'COM_MAL',
            name: 'پاساژ',
            requiredDocs: ['سند', 'پایان کار', 'اساسنامه', 'پروانه کسب'],
            legalRules: {
                units: 'حداقل ۱۰ واحد',
                parkingRequired: true
            },
            appraisalFactors: ['واحد', 'موقعیت', 'امکانات', 'ترافیک']
        },
        office: {
            code: 'COM_OFF',
            name: 'اداری',
            requiredDocs: ['سند مالکیت', 'پایان کار', 'پروانه کسب'],
            legalRules: {
                minArea: 30,
                parkingRequired: true
            },
            appraisalFactors: ['متراژ', 'طبقه', 'امکانات', 'موقعیت']
        },
        restaurant: {
            code: 'COM_RST',
            name: 'رستوران',
            requiredDocs: ['سند', 'پایان کار', 'مجوز بهداشت', 'پروانه کسب'],
            legalRules: {
                healthPermit: true,
                fireSafety: true
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'تجهیزات']
        },
        hotel: {
            code: 'COM_HTL',
            name: 'هتل',
            requiredDocs: ['سند', 'پایان کار', 'مجوز گردشگری', 'پروانه کسب'],
            legalRules: {
                stars: 'حداقل ۲ ستاره',
                facilities: 'الزامی'
            },
            appraisalFactors: ['اتاق', 'امکانات', 'موقعیت', 'ستاره']
        },
        bank: {
            code: 'COM_BNK',
            name: 'بانک',
            requiredDocs: ['سند', 'پایان کار', 'مجوز بانک مرکزی'],
            legalRules: {
                centralBankPermit: true,
                security: 'بالا'
            },
            appraisalFactors: ['متراژ', 'موقعیت', 'امنیت']
        },
        shoppingCenter: {
            code: 'COM_SHP',
            name: 'مرکز خرید',
            requiredDocs: ['سند', 'پایان کار', 'اساسنامه'],
            legalRules: {
                parkingRequired: true,
                facilities: 'کامل'
            },
            appraisalFactors: ['متراژ', 'واحد', 'موقعیت', 'دسترسی']
        },
        gasStation: {
            code: 'COM_GAS',
            name: 'پمپ بنزین',
            requiredDocs: ['سند', 'مجوز شرکت نفت', 'مجوز محیط زیست'],
            legalRules: {
                oilCompanyPermit: true,
                safety: 'بالا'
            },
            appraisalFactors: ['موقعیت', 'ظرفیت', 'تجهیزات']
        }
    },
    restrictions: {
        distanceFromSchool: 100,
        distanceFromHospital: 50,
        noiseLevel: 'limited',
        parkingSpaces: 'required'
    }
};
