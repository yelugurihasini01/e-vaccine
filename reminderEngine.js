import cron from 'node-cron';
import { DataStore } from '../models/dataStore.js';
import { sendWhatsAppReminder } from './whatsappService.js';
import { sendEmailReminder } from './emailService.js';

class ReminderEngine {
  constructor() {
    this.cronTask = null;
    this.cronPattern = process.env.CRON_SCHEDULE || '0 8 * * *'; // 08:00 AM IST
    this.timezone = 'Asia/Kolkata';
    this.isRunning = false;
  }

  start() {
    if (this.cronTask) {
      this.cronTask.stop();
    }

    console.log(`⏰ [ReminderEngine] Initializing daily cron scheduler at '${this.cronPattern}' (Timezone: ${this.timezone})`);

    this.cronTask = cron.schedule(
      this.cronPattern,
      async () => {
        console.log(`⏰ [ReminderEngine] Cron trigger started at ${new Date().toISOString()} (IST)`);
        await this.runReminderScan();
      },
      {
        scheduled: true,
        timezone: this.timezone
      }
    );

    this.isRunning = true;
    console.log(`✅ [ReminderEngine] Automated scheduler is running active.`);
  }

  stop() {
    if (this.cronTask) {
      this.cronTask.stop();
      this.isRunning = false;
      console.log('🛑 [ReminderEngine] Automated scheduler stopped.');
    }
  }

  getDaysDifference(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  async runReminderScan() {
    try {
      console.log('🔍 [ReminderEngine] Scanning active vaccination schedules for due reminders...');

      const activeSchedules = await DataStore.getSchedules();

      let dispatchedCount = 0;
      let skippedCount = 0;

      for (const schedule of activeSchedules) {
        if (!schedule.familyMemberId || !schedule.vaccineId || !schedule.userId) {
          continue;
        }

        if (schedule.status === 'Completed' || schedule.status === 'Skipped') {
          continue;
        }

        const user = await DataStore.findUserById(schedule.userId);
        if (!user) continue;

        const child = schedule.familyMemberId;
        const vaccine = schedule.vaccineId;

        const diffDays = this.getDaysDifference(schedule.dueDate);

        // Update overdue status if past due date
        if (diffDays < 0 && schedule.status !== 'Overdue') {
          schedule.status = 'Overdue';
          await schedule.save();
        }

        // Determine trigger stage
        let stage = null;
        if (diffDays === 7) stage = '7_days';
        else if (diffDays === 3) stage = '3_days';
        else if (diffDays === 1) stage = '1_day';
        else if (diffDays === 0) stage = 'due_date';
        else if (diffDays < 0 && (diffDays === -1 || diffDays === -7)) stage = 'overdue_alert';

        if (!stage) {
          continue;
        }

        // Deduplication Check
        const alreadySent = schedule.remindersSent?.some(r => r.stage === stage);
        if (alreadySent) {
          skippedCount++;
          continue;
        }

        const formattedDate = new Date(schedule.dueDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });

        const channels = [];
        const isOverdue = schedule.status === 'Overdue';

        // 1. WhatsApp Notification
        if (user.notificationPreferences?.whatsapp && user.mobileNumber) {
          const waResult = await sendWhatsAppReminder({
            recipientPhone: user.mobileNumber,
            parentName: user.fullName,
            childName: child.childName,
            vaccineName: `${vaccine.code} (${vaccine.name})`,
            dueDate: formattedDate,
            clinicName: child.primaryHospital || 'Primary Health Centre',
            isOverdue
          });

          await DataStore.createNotification({
            userId: user._id,
            scheduleId: schedule._id,
            familyMemberId: child._id,
            childName: child.childName,
            channel: 'whatsapp',
            recipient: user.mobileNumber,
            vaccineName: vaccine.code,
            stage,
            messageBody: waResult.messageText || 'WhatsApp Vaccine Reminder',
            status: waResult.status || 'sent',
            externalId: waResult.messageId || null
          });

          channels.push('whatsapp');
        }

        // 2. Email Notification
        if (user.notificationPreferences?.email && user.email) {
          const emailResult = await sendEmailReminder({
            recipientEmail: user.email,
            parentName: user.fullName,
            childName: child.childName,
            vaccineName: `${vaccine.code} (${vaccine.name})`,
            diseasePrevented: vaccine.diseasePrevented,
            dueDate: formattedDate,
            clinicName: child.primaryHospital || 'Primary Health Centre',
            isOverdue
          });

          await DataStore.createNotification({
            userId: user._id,
            scheduleId: schedule._id,
            familyMemberId: child._id,
            childName: child.childName,
            channel: 'email',
            recipient: user.email,
            vaccineName: vaccine.code,
            stage,
            messageBody: `Email reminder sent for ${vaccine.code}`,
            status: emailResult.status || 'sent',
            externalId: emailResult.messageId || null
          });

          channels.push('email');
        }

        if (channels.length > 0) {
          if (!schedule.remindersSent) schedule.remindersSent = [];
          schedule.remindersSent.push({
            stage,
            sentAt: new Date().toISOString(),
            channels
          });
          await schedule.save();
          dispatchedCount++;
        }
      }

      console.log(`🏁 [ReminderEngine] Scan completed. Dispatched: ${dispatchedCount}, Skipped (Deduplicated): ${skippedCount}`);
      return { success: true, dispatchedCount, skippedCount };
    } catch (err) {
      console.error('❌ [ReminderEngine] Error during reminder scan:', err.message);
      return { success: false, error: err.message };
    }
  }
}

export const reminderEngine = new ReminderEngine();
export default reminderEngine;
