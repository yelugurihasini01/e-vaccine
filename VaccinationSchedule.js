import mongoose from 'mongoose';

const vaccinationScheduleSchema = new mongoose.Schema({
  familyMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vaccineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Overdue', 'Skipped'],
    default: 'Scheduled'
  },
  remindersSent: [{
    stage: {
      type: String,
      enum: ['7_days', '3_days', '1_day', 'due_date', 'overdue_alert']
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    channels: [String] // ['whatsapp', 'email']
  }],
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

vaccinationScheduleSchema.index({ familyMemberId: 1, vaccineId: 1 }, { unique: true });
vaccinationScheduleSchema.index({ dueDate: 1, status: 1 });

export const VaccinationSchedule = mongoose.model('VaccinationSchedule', vaccinationScheduleSchema);
export default VaccinationSchedule;
