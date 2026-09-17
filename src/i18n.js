/**
 * ============================================================
 *  🌐 سیستم چندزبانه (i18n)
 *  پلتفرم ملی املاک ملکی
 *  نسخه: 1.0.0
 * ============================================================
 */

const translations = {
    fa: {
        platform_name: 'پلتفرم ملی املاک ملکی',
        welcome: 'خوش آمدید',
        login: 'ورود',
        register: 'ثبت‌نام',
        search: 'جستجو',
        buy: 'خرید',
        sell: 'فروش',
        rent: 'اجاره',
        property: 'ملک',
        apartment: 'آپارتمان',
        villa: 'ویلا',
        land: 'زمین',
        office: 'اداری',
        price: 'قیمت',
        area: 'متراژ',
        bedrooms: 'اتاق خواب',
        bathrooms: 'سرویس',
        parking: 'پارکینگ',
        location: 'موقعیت',
        city: 'شهر',
        region: 'منطقه',
        contact_us: 'تماس با ما',
        about_us: 'درباره ما',
        services: 'خدمات',
        legal_services: 'خدمات حقوقی',
        engineering: 'نظام مهندسی',
        registry: 'ثبت اسناد',
        tax: 'مالیات',
        municipality: 'شهرداری',
        judicial: 'خدمات قضایی',
        expert: 'کارشناس قضایی',
        appointment: 'نوبت‌دهی',
        automation: 'اتوماسیون',
        ai_assistant: 'مشاور هوشمند',
        map: 'نقشه',
        gps: 'موقعیت‌یابی',
        export_import: 'صادرات و واردات',
        settings: 'تنظیمات',
        profile: 'پروفایل',
        logout: 'خروج',
        inquiry: 'استعلام',
        document: 'سند',
        verification: 'اعتبارسنجی',
        success: 'عملیات با موفقیت انجام شد',
        error: 'خطایی رخ داده است',
        loading: 'در حال بارگذاری...',
        no_results: 'نتیجه‌ای یافت نشد'
    },
    en: {
        platform_name: 'National Real Estate Platform',
        welcome: 'Welcome',
        login: 'Login',
        register: 'Register',
        search: 'Search',
        buy: 'Buy',
        sell: 'Sell',
        rent: 'Rent',
        property: 'Property',
        apartment: 'Apartment',
        villa: 'Villa',
        land: 'Land',
        office: 'Office',
        price: 'Price',
        area: 'Area',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        parking: 'Parking',
        location: 'Location',
        city: 'City',
        region: 'Region',
        contact_us: 'Contact Us',
        about_us: 'About Us',
        services: 'Services',
        legal_services: 'Legal Services',
        engineering: 'Engineering',
        registry: 'Registry',
        tax: 'Tax',
        municipality: 'Municipality',
        judicial: 'Judicial Services',
        expert: 'Judicial Expert',
        appointment: 'Appointment',
        automation: 'Automation',
        ai_assistant: 'AI Assistant',
        map: 'Map',
        gps: 'GPS',
        export_import: 'Export & Import',
        settings: 'Settings',
        profile: 'Profile',
        logout: 'Logout',
        inquiry: 'Inquiry',
        document: 'Document',
        verification: 'Verification',
        success: 'Operation successful',
        error: 'An error occurred',
        loading: 'Loading...',
        no_results: 'No results found'
    },
    ar: {
        platform_name: 'المنصة الوطنية للعقارات',
        welcome: 'مرحباً',
        login: 'تسجيل الدخول',
        register: 'تسجيل',
        search: 'بحث',
        buy: 'شراء',
        sell: 'بيع',
        rent: 'إيجار',
        property: 'عقار',
        apartment: 'شقة',
        villa: 'فيلا',
        land: 'أرض',
        office: 'مكتب',
        price: 'السعر',
        area: 'المساحة',
        bedrooms: 'غرف النوم',
        bathrooms: 'الحمامات',
        parking: 'موقف سيارات',
        location: 'الموقع',
        city: 'المدينة',
        region: 'المنطقة',
        contact_us: 'اتصل بنا',
        about_us: 'من نحن',
        services: 'الخدمات',
        legal_services: 'الخدمات القانونية',
        engineering: 'الهندسة',
        registry: 'السجل العقاري',
        tax: 'الضرائب',
        municipality: 'البلدية',
        judicial: 'الخدمات القضائية',
        expert: 'خبير قضائي',
        appointment: 'المواعيد',
        automation: 'الأتمتة',
        ai_assistant: 'المساعد الذكي',
        map: 'الخريطة',
        gps: 'تحديد الموقع',
        export_import: 'التصدير والاستيراد',
        settings: 'الإعدادات',
        profile: 'الملف الشخصي',
        logout: 'تسجيل الخروج',
        inquiry: 'استعلام',
        document: 'وثيقة',
        verification: 'التحقق',
        success: 'تمت العملية بنجاح',
        error: 'حدث خطأ',
        loading: 'جار التحميل...',
        no_results: 'لا توجد نتائج'
    }
};

class I18n {
    constructor(defaultLang = 'fa') {
        this.currentLang = defaultLang;
        this.supportedLanguages = Object.keys(translations);
    }

    setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            throw new Error(`زبان ${lang} پشتیبانی نمی‌شود`);
        }
        this.currentLang = lang;
        return true;
    }

    t(key) {
        const lang = translations[this.currentLang];
        return lang[key] || key;
    }

    getLanguages() {
        return this.supportedLanguages;
    }
}

module.exports = new I18n('fa');
