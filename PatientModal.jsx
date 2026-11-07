import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Baby, Phone, Mail, MapPin, Calendar, Activity } from 'lucide-react';

export default function PatientModal({ isOpen, onClose, onSave, patientToEdit }) {
  const [formData, setFormData] = useState({
    childName: '',
    gender: 'Male',
    dob: '',
    bloodGroup: 'O+',
    parentName: '',
    parentRelation: 'Father',
    phone: '',
    email: '',
    address: '',
    clinicName: 'Sunrise Pediatric Care Hospital',
    doctorName: 'Dr. Priya V. Nambiar',
    notes: ''
  });

  useEffect(() => {
    if (patientToEdit) {
      setFormData(patientToEdit);
    } else {
      setFormData({
        childName: '',
        gender: 'Male',
        dob: new Date().toISOString().split('T')[0],
        bloodGroup: 'O+',
        parentName: '',
        parentRelation: 'Mother',
        phone: '+91 ',
        email: '',
        address: '',
        clinicName: 'Sunrise Pediatric Care Hospital',
        doctorName: 'Dr. Priya V. Nambiar',
        notes: ''
      });
    }
  }, [patientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.childName || !formData.parentName || !formData.phone || !formData.dob) {
      alert('Please fill in all mandatory fields (Child Name, Parent Name, DOB, and Phone Number).');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Baby size={20} color="var(--primary-teal-light)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
              {patientToEdit ? 'Edit Infant Profile' : 'Register New Infant / Child'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            
            <div className="form-group">
              <label className="form-label">Child Full Name *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Aarav Sharma"
                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth (DOB) *</label>
              <input 
                type="date" 
                className="form-control"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select 
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select 
                className="form-control"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Parent / Guardian Name *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Ramesh Sharma"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parent Relation</label>
              <select 
                className="form-control"
                value={formData.parentRelation}
                onChange={(e) => setFormData({ ...formData, parentRelation: e.target.value })}
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Phone Number *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="e.g. parent@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pediatric Clinic Name</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Doctor</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              />
            </div>

          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Home Address</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Full residence address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Medical Notes / Allergies</label>
            <textarea 
              className="form-control"
              rows={2}
              placeholder="Known allergies, lactose sensitivity, or birth notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{patientToEdit ? 'Update Record' : 'Register & Auto-Generate Schedule'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
