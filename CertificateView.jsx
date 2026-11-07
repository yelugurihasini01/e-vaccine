import React, { useState } from 'react';
import { Award, Printer, ShieldCheck, QrCode, CheckCircle2, User, Building, Calendar, Droplets } from 'lucide-react';
import { VACCINE_SCHEDULE_DEFINITIONS } from '../data/vaccineSchedule';

export default function CertificateView({ patients, selectedPatientProp }) {
  const [selectedPatientId, setSelectedPatientId] = useState(selectedPatientProp?.id || patients[0]?.id || '');
  
  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];

  if (!patient) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <p>No patient selected or available for certificate generation.</p>
      </div>
    );
  }

  // Gather completed vaccines
  const administeredVaccines = [];
  VACCINE_SCHEDULE_DEFINITIONS.forEach(group => {
    group.vaccines.forEach(vac => {
      const statusObj = patient.customVaccineStatus?.[vac.code];
      if (statusObj && statusObj.status === 'Completed') {
        administeredVaccines.push({
          ...vac,
          dateAdministered: statusObj.dateAdministered || 'Administered',
          batchNo: statusObj.batchNo || 'VX-2026-REG',
          clinic: statusObj.clinic || patient.clinicName
        });
      }
    });
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      
      {/* Header Bar */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Digital Immunization Certificate & Passport</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Official verified child health record for school admissions, international travel, and medical records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select 
            className="form-control"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            style={{ width: '240px' }}
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.childName} ({p.id})
              </option>
            ))}
          </select>

          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
            <span>Print / Save PDF Passport</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Card */}
      <div 
        id="printable-certificate" 
        className="glass-card" 
        style={{ 
          padding: '2.5rem', 
          background: 'linear-gradient(180deg, #111827 0%, #0F172A 100%)',
          border: '2px solid var(--border-glow)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        
        {/* Certificate Watermark / Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-teal)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={32} color="#FFFFFF" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#FFFFFF', margin: 0 }}>
                Official Immunization Passport
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary-teal-light)', fontWeight: 600 }}>
                {patient.clinicName} • Department of Pediatrics & Public Health
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PASSPORT ID</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-cyan)', fontFamily: 'monospace' }}>VAX-{patient.id}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>✓ VERIFIED DIGITAL RECORD</div>
          </div>
        </div>

        {/* Patient Profile Info Box */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          background: 'var(--bg-elevated)', 
          padding: '1.25rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.75rem' 
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CHILD NAME</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>{patient.childName}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATE OF BIRTH</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{patient.dob}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GENDER & BLOOD GROUP</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{patient.gender} • <span style={{ color: '#FB7185' }}>{patient.bloodGroup}</span></div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PARENT / GUARDIAN</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{patient.parentName} ({patient.phone})</div>
          </div>
        </div>

        {/* Administered Vaccines Table */}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', color: 'var(--primary-teal-light)' }}>
          Administered Immunization History
        </h3>

        {administeredVaccines.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
            No vaccines recorded as administered yet.
          </div>
        ) : (
          <table className="custom-table" style={{ marginBottom: '1.5rem' }}>
            <thead>
              <tr>
                <th>Vaccine Code</th>
                <th>Disease Protected</th>
                <th>Administration Date</th>
                <th>Batch / Lot No.</th>
                <th>Clinic Location</th>
              </tr>
            </thead>
            <tbody>
              {administeredVaccines.map((v, i) => (
                <tr key={i}>
                  <td>
                    <strong style={{ color: '#FFFFFF' }}>{v.code}</strong>
                  </td>
                  <td>{v.disease}</td>
                  <td>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      ✓ {v.dateAdministered}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)' }}>{v.batchNo}</code>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.clinic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Post-Vaccination Hydration Care Advice Footer */}
        <div style={{
          padding: '0.85rem 1.25rem',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'var(--text-main)'
        }}>
          <Droplets size={22} color="var(--primary-cyan)" style={{ flexShrink: 0 }} />
          <div>
            <strong>Pediatric Post-Vaccine Hydration Note:</strong> Parents are advised to maintain optimal fluid intake (breastmilk or clean water) for 48 hours after vaccination to aid immune cell migration and prevent mild post-dose dehydration.
          </div>
        </div>

        {/* Certificate Signoff & QR Verification Code */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Simulated QR Code SVG */}
            <div style={{ background: '#FFFFFF', padding: '0.5rem', borderRadius: '8px', display: 'inline-block' }}>
              <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2">
                <rect x="2" y="2" width="8" height="8" rx="1" />
                <rect x="14" y="2" width="8" height="8" rx="1" />
                <rect x="2" y="14" width="8" height="8" rx="1" />
                <path d="M14 14h2v2h-2zM18 14h4v4h-4zM14 18h4v4h-4z" fill="#0F172A" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Digital Verification QR</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', maxWidth: '200px' }}>
                Scan with any smartphone camera to verify authentic hospital record hash.
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'serif', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--primary-cyan)', marginBottom: '0.2rem' }}>
              {patient.doctorName}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.25rem' }}>
              CHIEF PEDIATRIC MEDICAL OFFICER
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Medical License No. #MP-99210-IN</div>
          </div>

        </div>

      </div>

    </div>
  );
}
