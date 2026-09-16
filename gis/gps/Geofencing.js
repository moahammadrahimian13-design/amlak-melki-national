/**
 * Geofencing - محدوده‌های جغرافیایی
 */

class Geofencing {
    constructor() {
        this.earthRadius = 6371000;
    }

    async initialize() {
        console.log('Geofencing آماده شد');
    }

    /**
     * بررسی نقطه داخل محدوده دایره‌ای
     */
    checkCircle(latitude, longitude, centerLat, centerLon, radiusMeter) {
        const distance = this.calculateDistance(
            latitude, longitude,
            centerLat, centerLon
        );

        return {
            inside: distance <= radiusMeter,
            distance: Math.round(distance)
        };
    }

    /**
     * بررسی نقطه داخل چندضلعی
     */
    checkPolygon(latitude, longitude, polygon) {
        if (!polygon || polygon.length < 3) {
            return { inside: false };
        }

        let inside = false;
        const x = longitude;
        const y = latitude;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].lon;
            const yi = polygon[i].lat;
            const xj = polygon[j].lon;
            const yj = polygon[j].lat;

            const intersect = ((yi > y) !== (yj > y)) &&
                             (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return { inside };
    }

    /**
     * محاسبه فاصله
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const toRad = (deg) => deg * Math.PI / 180;

        const phi1 = toRad(lat1);
        const phi2 = toRad(lat2);
        const dPhi = toRad(lat2 - lat1);
        const dLambda = toRad(lon2 - lon1);

        const a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
                  Math.cos(phi1) * Math.cos(phi2) *
                  Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return this.earthRadius * c;
    }
}

module.exports = Geofencing;
