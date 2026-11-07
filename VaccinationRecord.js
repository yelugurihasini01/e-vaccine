import mongoose from 'mongoose';

const vaccinationRecordSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VaccinationSchedule',
    required: true
  },
  familyMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    required: true
  },
  vaccineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine',
    required: true
  },
  administeredDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  batchNumber: {
    type: String,
    trim: true,
    default: () => `GOI-UIP-${Math.floor(100000 + Math.random() * 900000)}`
  },
  administeredBy: {
    type: String,
    trim: true,
    default: 'ANM Staff / Medical Officer'
  },
  centreName: {
    type: String,
    trim: true,
    default: 'Primary Health Centre (PHC)'
  },
  adverseReactions: {
    type: String,
    default: 'None reported'
  },
  remarks: {
    type: String,
    default: 'Vaccination successful under Universal Immunization Programme'
  }
}, {
  timestamps: true
});

export const VaccinationRecord = mongoose.model('VaccinationRecord', vaccinationRecordSchema);
export default VaccinationRecord;
