import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Baby, 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Edit3, 
  Trash2,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { VACCINE_SCHEDULE_DEFINITIONS } from '../data/vaccineSchedule';

export default function PatientList({ 
  patients, 
  onOpenAddModal, 
  onEditPatient, 
  onDeletePatient,
  onSendWhatsApp,
  onSendEmail,
  onOpenCertificate,
  onToggleVaccineStatus
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientForTimeline, setSelectedPatientForTimeline] = useState(null);

  // Filter patients by search query
  const filteredPatients = patients.filter(p => 
    p.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper: calculate age string from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const now = new Date();
    const diffTime = Math.abs(now - dob);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days old`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} old`;
    } else {
      const years = (diffDays / 365).toFixed(1);
      return `${years} years old`;
    }
  };

  // Helper: calculate completion percentage
  const calculateProgress = (patient) => {
    let total = 0;
    let completed = 0;

    VACCINE_SCHEDULE_DEFINITIONS.forEach(group => {
      group.vaccines.forEach(vac => {
        total++;
        const statusObj = patient.customVaccineStatus?.[vac.code];
        if (statusObj && statusObj.status === 'Completed') {
          completed++;
        }
      });
    });

    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      
      {/* Top Search & Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Registered Children & Patients</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Manage child immunization records, schedules, and reminders.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="form-control"
              placeholder="Search child, parent, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <button onClick={() => onOpenAddModal(null)} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Child</span>
          </button>
        </div>
      </div>

      {/* Patient Cards Grid */}
      {filteredPatients.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Baby size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3>No children matching your search</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Try modifying your query or click "Add Child" to register a new infant.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredPatients.map(patient => {
            const ageStr = calculateAge(patient.dob);
            const { completed, total, percent } = calculateProgress(patient);

            return (
              <div key={patient.id} className="glass-card glass-card-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                <div>
                  {/* Header Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ 
                        width: '46px', 
                        height: '46px', 
                        borderRadius: '12px', 
                        background: patient.gender === 'Female' ? 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)' : 'linear-gradient(135deg, #0D9488 0%, #0284C7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}>
                        <Baby size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', margin: 0, letterSpacing: '-0.01em' }}>{patient.childName}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span>{patient.id}</span> • <span>{patient.gender}</span> • <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>{ageStr}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button 
                        onClick={() => onEditPatient(patient)} 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.3rem 0.5rem' }} 
                        title="Edit Record"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => onDeletePatient(patient.id)} 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.3rem 0.5rem', color: '#FB7185' }} 
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata List */}
                  <div style={{ fontSize: '0.85rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Parent ({patient.parentRelation}):</span>
                      <strong style={{ color: 'var(--text-main)' }}>{patient.parentName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>WhatsApp Contact:</span>
                      <span style={{ color: 'var(--accent-whatsapp)', fontWeight: 600 }}>{patient.phone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Date of Birth:</span>
                      <span>{patient.dob}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Clinic:</span>
                      <span style={{ fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>{patient.clinicName}</span>
                    </div>
                  </div>

                  {/* Vaccine Progress Bar */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Immunization Progress</span>
                      <span style={{ color: 'var(--primary-teal-light)' }}>{completed} / {total} Vaccines ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #0D9488 0%, #10B981 100%)', transition: 'width 0.5s ease-out' }}></div>
                    </div>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button 
                    onClick={() => setSelectedPatientForTimeline(patient)} 
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <Calendar size={14} />
                    <span>Timeline</span>
                  </button>

                  <button 
                    onClick={() => onOpenCertificate(patient)} 
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <Award size={14} color="var(--primary-cyan)" />
                    <span>Passport</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Vaccine Timeline Modal */}
      {selectedPatientForTimeline && (
        <div className="modal-overlay" onClick={() => setSelectedPatientForTimeline(null)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Immunization Schedule — {selectedPatientForTimeline.childName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  DOB: {selectedPatientForTimeline.dob} ({calculateAge(selectedPatientForTimeline.dob)}) • Parent: {selectedPatientForTimeline.parentName}
                </p>
              </div>
              <button onClick={() => setSelectedPatientForTimeline(null)} className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.5rem', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            {/* Vaccine Milestones list */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div className="timeline">
                {VACCINE_SCHEDULE_DEFINITIONS.map(group => (
                  <div key={group.id} className="timeline-item">
                    <div className="timeline-dot completed">
                      <ShieldCheck size={12} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-cyan)', marginBottom: '0.5rem' }}>
                      {group.milestone}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {group.vaccines.map(vac => {
                        const statusObj = selectedPatientForTimeline.customVaccineStatus?.[vac.code] || { status: 'Scheduled' };
                        const isDone = statusObj.status === 'Completed';
                        const isOverdue = statusObj.status === 'Overdue';

                        return (
                          <div key={vac.code} style={{
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isDone ? 'rgba(16, 185, 129, 0.06)' : isOverdue ? 'rgba(244, 63, 94, 0.08)' : 'var(--bg-elevated)',
                            border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.25)' : isOverdue ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-subtle)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            flexWrap: 'wrap'
                          }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>{vac.code} — {vac.name}</span>
                                {vac.mandatory && <span className="badge badge-info" style={{ fontSize: '0.6rem', padding: '0.05rem 0.35rem' }}>Mandatory</span>}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                Target: {vac.disease} • Route: {vac.route} ({vac.dose})
                              </div>
                              {isDone && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.2rem', fontWeight: 600 }}>
                                  ✓ Administered on {statusObj.dateAdministered || 'Schedule'} {statusObj.batchNo ? `(Batch: ${statusObj.batchNo})` : ''}
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <button
                                onClick={() => {
                                  onToggleVaccineStatus(selectedPatientForTimeline.id, vac.code);
                                  // refresh local selected patient reference
                                  const updated = patients.find(p => p.id === selectedPatientForTimeline.id);
                                  if (updated) setSelectedPatientForTimeline({ ...updated });
                                }}
                                className={`btn btn-sm ${isDone ? 'btn-secondary' : 'btn-primary'}`}
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                              >
                                {isDone ? (
                                  <>
                                    <CheckCircle2 size={13} color="var(--accent-emerald)" />
                                    <span>Mark Pending</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 size={13} />
                                    <span>Mark Completed</span>
                                  </>
                                )}
                              </button>

                              {!isDone && (
                                <button
                                  onClick={() => onSendWhatsApp(selectedPatientForTimeline, vac.code, statusObj.dueDate || group.milestone, isOverdue)}
                                  className="btn btn-whatsapp btn-sm"
                                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                                  title="Send WhatsApp Reminder"
                                >
                                  <MessageSquare size={13} />
                                  <span>WhatsApp</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={() => {
                  const current = selectedPatientForTimeline;
                  setSelectedPatientForTimeline(null);
                  onOpenCertificate(current);
                }} 
                className="btn btn-secondary btn-sm"
              >
                <Award size={15} color="var(--primary-cyan)" />
                <span>View Official Certificate</span>
              </button>
              <button onClick={() => setSelectedPatientForTimeline(null)} className="btn btn-primary btn-sm">
                Done Viewing
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
