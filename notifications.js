import express from 'express';
import { DataStore } from '../models/dataStore.js';
import { protect } from '../middleware/authMiddleware.js';
import { reminderEngine } from '../services/reminderEngine.js';
import { sendWhatsAppReminder } from '../services/whatsappService.js';
import { sendEmailReminder } from '../services/emailService.js';

const router = express.Router();
router.use(protect);

/**
 * @route   GET /api/notifications
 * @desc    Get notification dispatch logs for current user (or all logs if admin)
 */
router.get('/', async (req, res) => {
  try {
    const { channel, status, search, limit = 50 } = req.query;

    let query = {};
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    if (channel && channel !== 'All') {
      query.channel = channel.toLowerCase();
    }

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    let logs = await DataStore.getNotifications(query);

    if (search) {
      const term = search.toLowerCase();
      logs = logs.filter(l =>
        l.childName?.toLowerCase().includes(term) ||
        l.recipient?.includes(term) ||
        l.vaccineName?.toLowerCase().includes(term) ||
        l.stage?.toLowerCase().includes(term)
      );
    }

    res.json({
      success: true,
      count: logs.length,
      logs: logs.slice(0, parseInt(limit, 10))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/notifications/trigger-cron
 * @desc    Manually trigger the daily reminder engine scan
 */
router.post('/trigger-cron', async (req, res) => {
  try {
    console.log(`⚡ [Manual Trigger] Reminder engine scan initiated by ${req.user.fullName}`);
    const result = await reminderEngine.runReminderScan();

    res.json({
      success: true,
      message: `Automated scan completed! Dispatched ${result.dispatchedCount} reminders, skipped ${result.skippedCount} (deduplicated).`,
      result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/notifications/quick-test
 * @desc    Test WhatsApp or Email directly with custom parameters
 */
router.post('/quick-test', async (req, res) => {
  try {
    const {
      channel,
      recipient,
      childName = 'Aarav Sharma',
      vaccineName = 'Pentavalent-1 & Rotavirus-1',
      dueDate = new Date().toISOString().split('T')[0],
      clinicName = 'Urban Primary Health Centre (UPHC)'
    } = req.body;

    if (!channel || !recipient) {
      return res.status(400).json({ success: false, message: 'Please specify channel (whatsapp/email) and recipient.' });
    }

    let dispatchResult;
    const formattedDate = new Date(dueDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    if (channel === 'whatsapp') {
      dispatchResult = await sendWhatsAppReminder({
        recipientPhone: recipient,
        parentName: req.user.fullName,
        childName,
        vaccineName,
        dueDate: formattedDate,
        clinicName,
        isOverdue: false
      });
    } else {
      dispatchResult = await sendEmailReminder({
        recipientEmail: recipient,
        parentName: req.user.fullName,
        childName,
        vaccineName,
        dueDate: formattedDate,
        clinicName,
        isOverdue: false
      });
    }

    const log = await DataStore.createNotification({
      userId: req.user._id,
      childName,
      channel: channel.toLowerCase(),
      recipient,
      vaccineName,
      stage: 'manual_test',
      messageBody: dispatchResult.messageText || `Test notification sent via ${channel}`,
      status: dispatchResult.status || 'sent',
      externalId: dispatchResult.messageId || null
    });

    res.json({
      success: true,
      message: `Test ${channel.toUpperCase()} reminder triggered successfully!`,
      dispatchResult,
      log
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/notifications/clear
 * @desc    Clear logs
 */
router.delete('/clear', async (req, res) => {
  try {
    const targetUserId = req.user.role === 'admin' ? null : req.user._id;
    await DataStore.clearNotifications(targetUserId);

    res.json({
      success: true,
      message: 'Notification dispatch logs cleared successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
