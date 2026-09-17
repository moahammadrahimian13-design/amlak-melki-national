/**
 * ============================================================
 *  🏛️ پلتفرم ملی املاک ملکی
 *  فایل اصلی سرور (Core Server) - نسخه 1.0.0
 * ============================================================
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// ==================== وارد کردن ماژول‌ها ====================
const aiModule = require('./ai');
const auditModule = require('./audit');
const appointmentModule = require('./appointment');
const automationModule = require('./automation');
const coreModule = require('./core');
const i18nModule = require('./i18n');
const integrationsModule = require('./integrations');
const translatorModule = require('./translator');
const voiceModule = require('./voice');
const workflowModule = require('./workflow');

// ==================== راه‌اندازی اپلیکیشن ====================
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== میدل‌ورها ====================
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==================== لاگ درخواست‌ها ====================
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ==================== مسیرها ====================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        platform: 'پلتفرم ملی املاک ملکی',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        modules: {
            ai: !!aiModule,
            audit: !!auditModule,
            appointment: !!appointmentModule,
            automation: !!automationModule,
            core: !!coreModule,
            i18n: !!i18nModule,
            integrations: !!integrationsModule,
            translator: !!translatorModule,
            voice: !!voiceModule,
            workflow: !!workflowModule
        }
    });
});

// --- هوش مصنوعی ---
app.post('/api/ai/recommend', (req, res) => {
    try {
        const { preferences, properties } = req.body;
        const result = aiModule.recommendProperties(preferences, properties);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/ai/estimate', (req, res) => {
    try {
        const result = aiModule.estimatePrice(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- حسابرسی ---
app.post('/api/audit/log', (req, res) => {
    try {
        const result = auditModule.logAction(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- نوبت‌دهی ---
app.post('/api/appointment/book', (req, res) => {
    try {
        const result = appointmentModule.bookAppointment(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- اتوماسیون ---
app.post('/api/automation/run', (req, res) => {
    try {
        const result = automationModule.runTask(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- استعلام از ادارات ---
app.post('/api/integrations/inquiry', (req, res) => {
    try {
        const { office, propertyId } = req.body;
        const result = integrationsModule.inquiry(office, propertyId);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- گردش کار ---
app.post('/api/workflow/start', (req, res) => {
    try {
        const result = workflowModule.startWorkflow(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- جستجوی صوتی ---
app.post('/api/voice/search', (req, res) => {
    try {
        const result = voiceModule.searchByVoice(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- مترجم ---
app.post('/api/translator/translate', (req, res) => {
    try {
        const result = translatorModule.translate(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== مدیریت خطا ====================
app.use((err, req, res, next) => {
    console.error('خطای سرور:', err.stack);
    res.status(500).json({ success: false, error: 'خطای داخلی سرور' });
});

// ==================== راه‌اندازی ====================
app.listen(PORT, () => {
    console.log('============================================');
    console.log('🏛️  پلتفرم ملی املاک ملکی');
    console.log(`🚀  سرور روی پورت ${PORT} اجرا شد`);
    console.log(`🌐  http://localhost:${PORT}/api/health`);
    console.log('============================================');
});

module.exports = app;
