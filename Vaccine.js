import mongoose from 'mongoose';

const vaccineSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hindiName: {
    type: String,
    default: ''
  },
  diseasePrevented: {
    type: String,
    required: true
  },
  milestoneCategory: {
    type: String,
    required: true
  },
  ageInDaysFromBirth: {
    type: Number,
    required: true
  },
  standardDose: {
    type: String,
    default: '0.5 ml'
  },
  route: {
    type: String,
    default: 'Intramuscular'
  },
  site: {
    type: String,
    default: 'Anterolateral aspect of mid-thigh'
  },
  isMandatory: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  },
  precautions: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Vaccine = mongoose.model('Vaccine', vaccineSchema);
export default Vaccine;
