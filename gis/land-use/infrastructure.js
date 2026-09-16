/**
 * زیرساخت‌های حمل و نقل
 */

module.exports = {
    category: 'infrastructure',
    name: 'زیرساخت‌های حمل و نقل',
    types: {
        highway: {
            code: 'INF_HWY',
            name: 'اتوبان',
            specifications: {
                minLanes: 4,
                minWidth: 20,
                maxSpeed: 120,
                hasBarrier: true
            }
        },
        freeway: {
            code: 'INF_FRW',
            name: 'آزادراه',
            specifications: {
                minLanes: 4,
                minWidth: 25,
                maxSpeed: 120,
                hasBarrier: true,
                hasToll: true
            }
        },
        mainRoad: {
            code: 'INF_MRD',
            name: 'جاده اصلی',
            specifications: {
                minLanes: 2,
                minWidth: 12,
                maxSpeed: 90
            }
        },
        secondaryRoad: {
            code: 'INF_SRD',
            name: 'جاده فرعی',
            specifications: {
                minLanes: 2,
                minWidth: 8,
                maxSpeed: 60
            }
        },
        street: {
            code: 'INF_STR',
            name: 'خیابان',
            specifications: {
                minLanes: 2,
                minWidth: 10,
                maxSpeed: 50
            }
        },
        alley: {
            code: 'INF_ALY',
            name: 'کوچه',
            specifications: {
                minWidth: 4,
                maxSpeed: 30
            }
        },
        ruralRoad: {
            code: 'INF_RRD',
            name: 'جاده روستایی',
            specifications: {
                minWidth: 6,
                maxSpeed: 60
            }
        },
        bridge: {
            code: 'INF_BRG',
            name: 'پل',
            specifications: {
                minWidth: 8,
                maxLoad: 40,
                inspectionRequired: true
            }
        },
        tunnel: {
            code: 'INF_TNL',
            name: 'تونل',
            specifications: {
                minHeight: 5,
                ventilation: 'required',
                lighting: 'required'
            }
        },
        roundabout: {
            code: 'INF_RAB',
            name: 'میدان',
            specifications: {
                minRadius: 10,
                lanes: 'variable'
            }
        }
    }
};
