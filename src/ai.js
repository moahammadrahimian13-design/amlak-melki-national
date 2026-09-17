/**
 * ============================================================
 *  🤖 ماژول هوش مصنوعی (AI)
 *  پلتفرم ملی املاک ملکی
 *  نسخه: 1.0.0
 * ============================================================
 */

class AIEngine {
    constructor() {
        this.modelVersion = '1.0.0';
        this.trainedData = {
            cities: ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'قم'],
            propertyTypes: ['آپارتمان', 'ویلا', 'زمین', 'اداری', 'تجاری'],
            priceRanges: {
                'تهران': { min: 50000000, max: 500000000 },
                'مشهد': { min: 20000000, max: 200000000 },
                'اصفهان': { min: 25000000, max: 250000000 },
                'شیراز': { min: 20000000, max: 180000000 }
            }
        };
    }

    // ==================== پیشنهاد هوشمند ملک ====================
    recommendProperties(preferences, properties) {
        const { budget, city, type, bedrooms, area } = preferences;
        const scored = properties.map(property => {
            let score = 0;
            if (city && property.city === city) score += 30;
            if (type && property.type === type) score += 25;
            if (budget && property.price <= budget) score += 20;
            if (bedrooms && property.bedrooms >= bedrooms) score += 15;
            if (area && property.area >= area) score += 10;
            return { ...property, aiScore: score };
        });
        return scored.filter(p => p.aiScore > 0).sort((a, b) => b.aiScore - a.aiScore);
    }

    // ==================== تخمین قیمت ====================
    estimatePrice(features) {
        const { area, bedrooms, hasPool, hasParking, city } = features;
        const basePrice = 10000000;
        let multiplier = 1;
        if (hasPool) multiplier += 0.3;
        if (hasParking) multiplier += 0.1;
        if (city === 'تهران') multiplier += 0.5;
        else if (city === 'مشهد') multiplier += 0.2;
        return Math.round((area * basePrice * multiplier) + (bedrooms * 50000000));
    }

    // ==================== تحلیل بازار ====================
    analyzeMarket(city) {
        const range = this.trainedData.priceRanges[city] || { min: 10000000, max: 100000000 };
        return {
            city,
            averagePrice: Math.round((range.min + range.max) / 2),
            minPrice: range.min,
            maxPrice: range.max,
            trend: 'صعودی',
            lastUpdate: new Date().toISOString()
        };
    }

    // ==================== تشخیص نوع ملک از متن ====================
    detectPropertyType(text) {
        for (const type of this.trainedData.propertyTypes) {
            if (text.includes(type)) return type;
        }
        return 'نامشخص';
    }
}

module.exports = new AIEngine();
