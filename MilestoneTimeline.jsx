import React, { useState } from 'react';
import { 
  Milestone, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  Baby, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';
import { VACCINE_SCHEDULE_DEFINITIONS } from '../data/vaccineSchedule';

export default function MilestoneTimeline({ patients, onToggleVaccineStatus, onSendWhatsApp }) {
  const [selectedChildId, setSelectedChildId] = useState(patients[0]?.id || '');

  const selectedPatient = patients.find(p => p.id === selectedChildId) || patients[0];

  if (!selectedPatient) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p>No patient records available.</p>
      </div>
    );
  }

  // Calculate stats for this specific child
  let totalDoses = 0;
  let completedDoses = 0;
  let overdueDoses = 0;

  VACCINE_SCHEDULE_DEFINITIONS.forEach(group => {
    group.vaccines.forEach(vac => {
      totalDoses++;
      const st = selectedPatient.customVaccineStatus?.[vac.code];
      if (st?.status === 'Completed') completedDoses++;
      else if (st?.status === 'Overdue') overdueDoses++;
    });
  });

  const percent = totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

  return (
    <div className="container" style={{ paddingBottom: '3.5rem' }}>
      
      {/* Top Banner */}
      <div className="quote-banner" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '280px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 6px 18px rgba(13, 148, 136, 0.4)'
            }}>
              <Milestone size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>UIP / WHO Roadmap</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>0 to 6 Years Lifespan Schedule</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700 }}>Child Immunization Milestone Journey</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Chronological developmental pathway from birth to school age with one-click administration tracking.
              </p>
            </div>
          </div>

          {/* Child Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Viewing:</span>
            <select
              className="form-control"
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              style={{ width: '240px', fontWeight: 600 }}
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.childName} ({p.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Child Summary Stats Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Child Profile
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>{selectedPatient.childName}</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-teal-light)' }}>
              DOB: {selectedPatient.dob} • Parent: {selectedPatient.parentName}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Immunization Progress
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)', height: '10px', borderRadius: '999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${percent}%`, 
                    background: 'linear-gradient(90deg, var(--primary-teal) 0%, var(--primary-cyan) 100%)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>{percent}%</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {completedDoses} of {totalDoses} vaccines administered
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-start' }}>
            <div style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'block' }}>Administered</span>
              <strong style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>{completedDoses}</strong>
            </div>
            <div style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', background: overdueDoses > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)', border: overdueDoses > 0 ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: overdueDoses > 0 ? 'var(--accent-rose)' : 'var(--text-muted)', display: 'block' }}>Overdue</span>
              <strong style={{ fontSize: '1.1rem', color: overdueDoses > 0 ? 'var(--accent-rose)' : '#FFFFFF' }}>{overdueDoses}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Journey Cards */}
      <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '3px solid var(--border-glow)' }}>
        {VACCINE_SCHEDULE_DEFINITIONS.map((group, groupIdx) => {
          // Check status of vaccines in this group
          const groupCompleted = group.vaccines.every(v => selectedPatient.customVaccineStatus?.[v.code]?.status === 'Completed');
          const groupHasOverdue = group.vaccines.some(v => selectedPatient.customVaccineStatus?.[v.code]?.status === 'Overdue');

          return (
            <div 
              key={groupIdx} 
              style={{ 
                marginBottom: '2.5rem', 
                position: 'relative',
                animation: `fadeIn 0.3s ease-in-out ${groupIdx * 0.05}s`
              }}
            >
              {/* Timeline Marker Pin */}
              <div style={{
                position: 'absolute',
                left: '-2.35rem',
                top: '0',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: groupCompleted ? 'var(--accent-emerald)' : groupHasOverdue ? 'var(--accent-rose)' : 'var(--bg-card)',
                border: '3px solid var(--primary-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 0 12px rgba(13, 148, 136, 0.5)'
              }}>
                {groupCompleted ? <CheckCircle2 size={16} /> : <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{groupIdx + 1}</span>}
              </div>

              {/* Milestone Box Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#FFFFFF' }}>{group.milestone}</h3>
                  <span className={`badge ${groupCompleted ? 'badge-success' : groupHasOverdue ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                    {groupCompleted ? 'All Administered' : groupHasOverdue ? 'Action Needed' : 'Milestone Target'}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {group.description}
                </span>
              </div>

              {/* Vaccines Grid in this Milestone */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {group.vaccines.map((vac) => {
                  const statusObj = selectedPatient.customVaccineStatus?.[vac.code] || { status: 'Scheduled' };
                  const isDone = statusObj.status === 'Completed';
                  const isOverdue = statusObj.status === 'Overdue';

                  return (
                    <div 
                      key={vac.code}
                      className="glass-card"
                      style={{
                        padding: '1.25rem',
                        borderLeft: `4px solid ${isDone ? 'var(--accent-emerald)' : isOverdue ? 'var(--accent-rose)' : 'var(--primary-cyan)'}`,
                        background: 'var(--bg-elevated)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <div>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{vac.code}</span>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary-teal-light)' }}>{vac.name}</div>
                          </div>
                          <span className={`badge ${isDone ? 'badge-success' : isOverdue ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                            {statusObj.status}
                          </span>
                        </div>

                        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {vac.description}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.85rem' }}>
                          <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                            💉 {vac.dose}
                          </span>
                          <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                            📍 {vac.route}
                          </span>
                          {vac.mandatory && (
                            <span style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                              Mandatory
                            </span>
                          )}
                        </div>

                        {isDone && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginBottom: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                            ✓ Administered: <strong>{statusObj.dateAdministered || 'Recorded'}</strong> (Batch: {statusObj.batchNo || 'VX-REG'})
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                        <button
                          onClick={() => onToggleVaccineStatus(selectedPatient.id, vac.code)}
                          className={`btn btn-sm ${isDone ? 'btn-outline' : 'btn-primary'}`}
                          style={{ flex: 1, fontSize: '0.75rem' }}
                        >
                          <CheckCircle2 size={14} />
                          <span>{isDone ? 'Mark as Pending' : 'Mark Administered'}</span>
                        </button>

                        <button
                          onClick={() => onSendWhatsApp(selectedPatient, vac.code, group.milestone, isOverdue)}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--accent-whatsapp)', color: 'var(--accent-whatsapp)', padding: '0.35rem 0.6rem' }}
                          title="Send milestone reminder via WhatsApp"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
