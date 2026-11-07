import express from 'express';
import { DataStore } from '../models/dataStore.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendWhatsAppReminder } from '../services/whatsappService.js';
import { sendEmailReminder } from '../services/emailService.js';

const router = express.Router();
router.use(protect);

/**
 * @route   GET /api/schedules
 * @desc    Query schedules belonging to current user with rich filters
 */
router.get('/', async (req, res) => {
  try {
    const { status, familyMemberId, timeframe, search } = req.query;

    const query = { userId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (familyMemberId) {
      query.familyMemberId = familyMemberId;
    }

    let schedules = await DataStore.getSchedules(query);

    if (timeframe === 'upcoming_7_days') {
      const now = new Date();
      const in7Days = new Date();
      in7Days.setDate(now.getDate() + 7);
      schedules = schedules.filter(s => {
        const d = new Date(s.dueDate);
        return d >= now && d <= in7Days && s.status === 'Scheduled';
      });
    } else if (timeframe === 'overdue') {
      const now = new Date();
      schedules = schedules.filter(s => new Date(s.dueDate) < now && s.status !== 'Completed');
    }

    if (search) {
      const term = search.toLowerCase();
      schedules = schedules.filter(s =>
        s.vaccineId?.name?.toLowerCase().includes(term) ||
        s.vaccineId?.code?.toLowerCase().includes(term) ||
        s.familyMemberId?.childName?.toLowerCase().includes(term)
      );
    }

    res.json({
      success: true,
      count: schedules.length,
      schedules
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/schedules/:id/status
 * @desc    Toggle or update vaccination status (Completed <-> Scheduled)
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { status, administeredDate, batchNumber, administeredBy, centreName, remarks } = req.body;

    const schedule = await DataStore.findScheduleById(req.params.id, req.user._id);

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Vaccination schedule not found.' });
    }

    const prevStatus = schedule.status;
    schedule.status = status || (prevStatus === 'Completed' ? 'Scheduled' : 'Completed');

    if (schedule.status === 'Completed') {
      await DataStore.createOrUpdateRecord({
        scheduleId: schedule._id,
        familyMemberId: schedule.familyMemberId?._id || schedule.familyMemberId,
        vaccineId: schedule.vaccineId?._id || schedule.vaccineId,
        administeredDate: administeredDate ? new Date(administeredDate).toISOString() : new Date().toISOString(),
        batchNumber: batchNumber || `GOI-UIP-${Math.floor(100000 + Math.random() * 900000)}`,
        administeredBy: administeredBy || 'Medical Officer / ANM Staff',
        centreName: centreName || schedule.familyMemberId?.primaryHospital || 'Primary Health Centre (PHC)',
        remarks: remarks || 'Administered successfully according to UIP protocol.'
      });
    } else {
      await DataStore.deleteRecords({ scheduleId: schedule._id });
    }

    await schedule.save();

    res.json({
      success: true,
      message: `Vaccine ${schedule.vaccineId?.code} marked as ${schedule.status}.`,
      schedule
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/schedules/:id/test-remind
 * @desc    Instant test reminder dispatch for a single schedule via WhatsApp & Email
 */
router.post('/:id/test-remind', async (req, res) => {
  try {
    const schedule = await DataStore.findScheduleById(req.params.id, req.user._id);

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule record not found.' });
    }

    const { channels = ['whatsapp', 'email'], customNotes = '' } = req.body;
    const results = {};

    const formattedDate = new Date(schedule.dueDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const childName = schedule.familyMemberId?.childName || 'Child';
    const vacCode = schedule.vaccineId?.code || 'Vaccine';
    const vacName = schedule.vaccineId?.name || '';
    const hospital = schedule.familyMemberId?.primaryHospital || 'Primary Health Centre';

    // 1. WhatsApp Dispatch
    if (channels.includes('whatsapp') && req.user.mobileNumber) {
      const waResult = await sendWhatsAppReminder({
        recipientPhone: req.user.mobileNumber,
        parentName: req.user.fullName,
        childName,
        vaccineName: `${vacCode} (${vacName})`,
        dueDate: formattedDate,
        clinicName: hospital,
        isOverdue: schedule.status === 'Overdue',
        notes: customNotes
      });

      results.whatsapp = waResult;

      await DataStore.createNotification({
        userId: req.user._id,
        scheduleId: schedule._id,
        familyMemberId: schedule.familyMemberId?._id || schedule.familyMemberId,
        childName,
        channel: 'whatsapp',
        recipient: req.user.mobileNumber,
        vaccineName: vacCode,
        stage: 'manual_test',
        messageBody: waResult.messageText || 'Test WhatsApp Reminder',
        status: waResult.status || 'sent',
        externalId: waResult.messageId || null
      });
    }

    // 2. Email Dispatch
    if (channels.includes('email') && req.user.email) {
      const emailResult = await sendEmailReminder({
        recipientEmail: req.user.email,
        parentName: req.user.fullName,
        childName,
        vaccineName: `${vacCode} (${vacName})`,
        diseasePrevented: schedule.vaccineId?.diseasePrevented || 'Infectious Disease',
        dueDate: formattedDate,
        clinicName: hospital,
        isOverdue: schedule.status === 'Overdue',
        notes: customNotes
      });

      results.email = emailResult;

      await DataStore.createNotification({
        userId: req.user._id,
        scheduleId: schedule._id,
        familyMemberId: schedule.familyMemberId?._id || schedule.familyMemberId,
        childName,
        channel: 'email',
        recipient: req.user.email,
        vaccineName: vacCode,
        stage: 'manual_test',
        messageBody: `Test Email Reminder sent for ${vacCode}`,
        status: emailResult.status || 'sent',
        externalId: emailResult.messageId || null
      });
    }

    res.json({
      success: true,
      message: 'Test reminder dispatched successfully!',
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
