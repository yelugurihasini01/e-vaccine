import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner User ID is required']
  },
  childName: {
    type: String,
    required: [true, 'Family member / child name is required'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male'
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  relationship: {
    type: String,
    enum: ['Child', 'Self', 'Spouse', 'Parent', 'Sibling', 'Other'],
    default: 'Child'
  },
  // Indian Health Identifiers (Optional for UIP / ABDM linkage)
  abhaId: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        // 14 digits format or 91-XXXX-XXXX-XXXX
        return /^(\d{14}|\d{2}-\d{4}-\d{4}-\d{4})$/.test(v);
      },
      message: 'ABHA ID must be a 14-digit Ayushman Bharat Health Account number.'
    }
  },
  mcpCardNumber: {
    type: String,
    trim: true,
    default: ''
  },
  birthWeightKg: {
    type: Number,
    default: null
  },
  primaryHospital: {
    type: String,
    default: 'Primary Health Centre (PHC)'
  },
  doctorOrAnmName: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: 'None'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);
export default FamilyMember;
