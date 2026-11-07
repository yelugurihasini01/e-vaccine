import express from 'express';
import { db } from '../models/db.js';
import { config } from '../config/config.js';
import { reminderEngine } from '../services/reminderEngine.js';

const router = express.Router();

/**
 * GET /api/stats
 * Global stats for dashboard overview
 */
router.get('/stats', (req, res) => {
  const beneficiaries = db.getAll('beneficiaries');
  const schedules = db.getAll('schedules');
  const notifications = db.getAll('notifications');

  const todayStr = new Date().toISOString().split('T')[0];

  const totalBeneficiaries = beneficiaries.length;
  const totalSchedules = schedules.length;
  const completed = schedules.filter(s => s.status === 'completed').length;

  let upcomingNext7Days = 0;
  let overdue = 0;
  let dueToday = 0;

  schedules.forEach(s => {
    if (s.status !== 'completed') {
      const diff = reminderEngine.getDaysDifference(s.dueDate);
      if (diff < 0) {
        overdue++;
      } else if (diff === 0) {
        dueToday++;
      } else if (diff <= 7) {
        upcomingNext7Days++;
      }
    }
  });

  const remindersSentToday = notifications.filter(n => (n.sentAt || '').startsWith(todayStr)).length;
  const totalRemindersDispatched = notifications.length;

  res.json({
    success: true,
    data: {
      totalBeneficiaries,
      totalSchedules,
      completed,
      overdue,
      dueToday,
      upcomingNext7Days,
      remindersSentToday,
      totalRemindersDispatched,
      completionRate: totalSchedules > 0 ? Math.round((completed / totalSchedules) * 100) : 0
    }
  });
});

/**
 * GET /api/settings
 * Safe representation of settings
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      clinic: config.clinic,
      email: {
        enabled: config.email.enabled,
        provider: config.email.provider,
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        user: config.email.smtp.auth.user ? config.email.smtp.auth.user.replace(/(.{3})(.*)(@.*)/, '$1***$3') : '',
        from: config.email.from
      },
      whatsapp: {
        provider: config.whatsapp.provider,
        twilioConfigured: Boolean(config.whatsapp.twilio.accountSid && config.whatsapp.twilio.authToken),
        twilioNumber: config.whatsapp.twilio.fromNumber,
        metaConfigured: Boolean(config.whatsapp.meta.accessToken)
      },
      reminder: config.reminder
    }
  });
});

/**
 * PUT /api/settings
 * Update editable clinic parameters
 */
router.put('/', (req, res) => {
  const { clinicName, clinicPhone, clinicEmail, clinicAddress, whatsappProvider, emailEnabled } = req.body;

  if (clinicName) config.clinic.name = clinicName.trim();
  if (clinicPhone) config.clinic.phone = clinicPhone.trim();
  if (clinicEmail) config.clinic.email = clinicEmail.trim();
  if (clinicAddress) config.clinic.address = clinicAddress.trim();
  if (whatsappProvider) config.whatsapp.provider = whatsappProvider;
  if (typeof emailEnabled === 'boolean') config.email.enabled = emailEnabled;

  res.json({
    success: true,
    message: 'Configuration settings updated.',
    data: {
      clinic: config.clinic,
      whatsappProvider: config.whatsapp.provider,
      emailEnabled: config.email.enabled
    }
  });
});

export default router;
