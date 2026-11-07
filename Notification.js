import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VaccinationSchedule',
    default: null
  },
  familyMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    default: null
  },
  childName: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    enum: ['whatsapp', 'email', 'sms'],
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  vaccineName: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    enum: ['7_days', '3_days', '1_day', 'due_date', 'manual_test', 'overdue_alert'],
    default: 'due_date'
  },
  messageBody: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'failed', 'simulated'],
    default: 'sent'
  },
  externalId: {
    type: String,
    default: null
  },
  error: {
    type: String,
    default: null
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

notificationSchema.index({ scheduleId: 1, stage: 1, channel: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
