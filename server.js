import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Config and DB imports
import { connectDB, getMongoStatus } from './config/db.js';
import { reminderEngine } from './services/reminderEngine.js';

// Route imports
import authRouter from './routes/auth.js';
import familyRouter from './routes/family.js';
import schedulesRouter from './routes/schedules.js';
import vaccinesRouter from './routes/vaccines.js';
import notificationsRouter from './routes/notifications.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend dist if built
const frontendDistPath = path.resolve(__dirname, '../../evaccine-reminder-app/dist');
app.use(express.static(frontendDistPath));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/family', familyRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/vaccines', vaccinesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const metaConfigured = Boolean(process.env.META_WA_PHONE_NUMBER_ID && process.env.META_WA_ACCESS_TOKEN);
  const smtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'E-Vaccine Reminder System (India UIP Edition)',
    version: '2.0.0',
    database: getMongoStatus(),
    integrations: {
      whatsapp: {
        provider: metaConfigured ? 'Meta WhatsApp Cloud API' : 'Simulator Mode (Credentials missing in .env)',
        configured: metaConfigured
      },
      email: {
        provider: smtpConfigured ? 'Nodemailer SMTP' : 'Simulator Mode (Credentials missing in .env)',
        configured: smtpConfigured
      },
      scheduler: {
        cron: process.env.CRON_SCHEDULE || '0 8 * * *',
        timezone: 'Asia/Kolkata (IST)',
        active: reminderEngine.isRunning
      }
    }
  });
});

// Single Page Application fallback
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <h1>🏥 E-Vaccine Reminder API Server</h1>
        <p>API backend is running actively on port ${PORT}.</p>
        <p>Frontend can be accessed on Vite dev server (default http://localhost:5173).</p>
      `);
    }
  });
});

// Start Server & Connect MongoDB
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
========================================================================
   🇮🇳  E-VACCINE REMINDER SYSTEM (INDIA UIP EDITION)  🇮🇳
========================================================================
   🚀 Backend API Server:     http://localhost:${PORT}
   🩺 Program Standard:       Universal Immunization Programme (MoHFW)
   🛡️  Auth Engine:            JWT + Indian Mobile (+91) OTP Verification
   📱 WhatsApp Cloud API:     ${process.env.META_WA_PHONE_NUMBER_ID ? 'META CLOUD API (ACTIVE)' : 'SIMULATOR MODE'}
   ✉️  Email Service:          ${process.env.SMTP_USER ? 'SMTP ACTIVE' : 'SIMULATOR MODE'}
   ⏰ Reminder Scheduler:     ACTIVE (IST 08:00 AM • Daily)
========================================================================
`);

    // Start background reminder engine
    reminderEngine.start();
  });
}

startServer();
