/**
 * GPS Locator - مکانیاب با GPS
 */

class GPSLocator {
    constructor() {
        this.isReady = false;
        this.earthRadius = 6371000;
    }

    async initialize() {
        this.isReady = true;
        console.log('GPS Locator آماده شد');
    }

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

    calculateArea(coordinates) {
        if (!coordinates || coordinates.length < 3) return 0;

        let area = 0;
        const n = coordinates.length;

        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            const p1 = coordinates[i];
            const p2 = coordinates[j];

            area += (p2.lon - p1.lon) *
                    (2 + Math.sin(p1.lat * Math.PI / 180) +
                     Math.sin(p2.lat * Math.PI / 180));
        }

        area = Math.abs(area * this.earthRadius * this.earthRadius / 2);
        return area;
    }

    async findNearby(latitude, longitude, radius = 1000) {
        return {
            properties: [],
            infrastructure: [],
            green_spaces: [],
            water_resources: [],
            public_facilities: []
        };
    }
}

module.exports = GPSLocator;
