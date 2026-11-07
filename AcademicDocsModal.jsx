import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Layers, 
  Database, 
  MessageSquare, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  FileCode,
  Award,
  Server,
  Zap,
  Globe,
  Droplets,
  HelpCircle,
  Cpu
} from 'lucide-react';

export default function AcademicDocsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '920px', width: '95%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)', color: '#818CF8' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700 }}>Academic Project Defense & Technical Architecture</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Comprehensive College Viva Voce, Software Architecture & Implementation Reference
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            <Award size={15} /> Abstract & Scope
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'architecture' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Layers size={15} /> System Architecture & DFD
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'whatsapp' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <MessageSquare size={15} /> WhatsApp & Email Protocols
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'hydration' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('hydration')}
          >
            <Droplets size={15} /> Hydration Medical Algorithms
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'schema' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('schema')}
          >
            <Database size={15} /> Database ER Schema
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'viva' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('viva')}
          >
            <Zap size={15} /> Viva Voce Q&A (15 Questions)
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-teal-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} /> Project Title & Abstract
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  <strong>Project Title:</strong> Automated E-Vaccine Child Immunization Tracking & Multi-Channel Reminder Dispatch System (WhatsApp & Email).
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  Child immunization dropout rates remain a significant public health challenge globally due to lost physical vaccination cards, forgotten milestones, and lack of timely parental guidance. This project implements a web-based clinical tracking platform that computes infant vaccine milestones, dispatches real-time WhatsApp and Email alerts, incorporates a pediatric post-vaccine hydration and recovery calculator (Holliday-Segar formula), and generates QR-verified digital immunization passports.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>🎯 Core Objectives</h4>
                  <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '1.1rem', margin: 0, lineHeight: 1.6 }}>
                    <li>Zero-dropout rate tracking across UIP milestones (0–6 years).</li>
                    <li>Multi-channel automated alerting via WhatsApp deep links & SMTP.</li>
                    <li>Pediatric hydration & fluid balance calculation post-immunization.</li>
                    <li>Verifiable digital immunization passport with QR verification.</li>
                  </ul>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>🛠️ Tech Stack & Standards</h4>
                  <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '1.1rem', margin: 0, lineHeight: 1.6 }}>
                    <li><strong>Frontend:</strong> React 18, Vite, Modern CSS Design System</li>
                    <li><strong>Messaging:</strong> WhatsApp Click-to-Chat (wa.me) & Twilio REST API</li>
                    <li><strong>Email:</strong> SMTP Mail Protocol & Mailto dispatch</li>
                    <li><strong>Clinical Standards:</strong> WHO UIP Guidelines & Holliday-Segar</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Architecture & DFD */}
          {activeTab === 'architecture' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-teal-light)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={18} /> System Architecture Flow
                </h3>
                <div style={{
                  background: '#070B12',
                  padding: '1.25rem',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                  color: '#10B981',
                  overflowX: 'auto',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  {`[Parent / Clinic Admin] 
        │
        ▼ (DOB, Phone, Name)
[Patient Registry Engine] ───► [Milestone Date Calculator (WHO/UIP)]
        │                                  │
        ▼                                  ▼
[SQLite / Local Storage State] ◄── [Automated Vaccine Timeline Grid]
        │
        ├──► [Hydration & Recovery Engine (Holliday-Segar Formula)]
        │
        ├──► [Automated Background Cron Scheduler (APScheduler/Redis)]
        │         │
        │         ├─► Overdue Scanner (Days <= 0)
        │         └─► Upcoming Scanner (Days == 7 / Days == 3)
        │
        ▼
[Multi-Channel Notification Gateway]
   ├──► WhatsApp Dispatcher (wa.me Deep Link / Twilio Cloud API)
   ├──► Email Dispatcher (SMTP Host / Mailto RFC-2368)
   └─► Digital Passport Engine (Canvas QR Generator & Print PDF)`}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  📊 Data Flow Diagram (DFD Level 1)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <strong>Process 1.0 (Registration):</strong> Captures infant demographic details, DOB, parent contact info, and assigns a unique Pediatric Health Identifier (`PAT-XXXX`).<br />
                  <strong>Process 2.0 (Milestone Generation):</strong> Maps DOB against standard National Immunization Schedule intervals (Birth, 6w, 10w, 14w, 9m, 16m, 5y).<br />
                  <strong>Process 3.0 (Dispatch Engine):</strong> Compiles template variables, injects pediatric fluid recovery guidelines, and dispatches payloads to WhatsApp/Email gateways.<br />
                  <strong>Process 4.0 (Audit & Passport):</strong> Logs transmission timestamps and generates verifiable QR-coded digital passports.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: WhatsApp & Email Protocols */}
          {activeTab === 'whatsapp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-whatsapp)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} /> WhatsApp Integration Mechanisms
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  <p>The system provides a two-tier dual-channel architecture for WhatsApp dispatch:</p>
                  <ol style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong>Client-Side WhatsApp Deep-Linking (wa.me Protocol):</strong> Utilizes URL scheme `https://wa.me/{sanitized_phone}?text={encoded_message}`. This allows immediate, zero-cost, verifiable live message dispatch directly to parent devices during clinical evaluation and exams without requiring paid SMS/API keys.
                    </li>
                    <li>
                      <strong>Server-Side Twilio / Meta Cloud API (Automated Backend):</strong> For autonomous cloud scheduling, backend workers dispatch HTTP POST requests to the Twilio REST API (`https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json`) with Bearer Auth and JSON payload containing template variables.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} /> SMTP Email Protocol Implementation
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Emails are generated with MIME multipart HTML templates containing clinical hospital headers, vaccine batch codes, and Google Calendar `.ics` event attachments. Dispatched via standard SMTP port 587 (TLS) using credentials defined in `.env` (SendGrid, AWS SES, or Gmail SMTP).
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Hydration Medical Algorithm */}
          {activeTab === 'hydration' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-teal-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Droplets size={18} /> Holliday-Segar Pediatric Fluid Formula
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  Post-vaccine fever and metabolic immune response increase fluid loss through perspiration. To prevent dehydration, the platform integrates the clinical <strong>Holliday-Segar Maintenance Fluid Equation</strong>:
                </p>
                
                <div style={{ background: '#0F172A', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-glow)', margin: '0.75rem 0', fontSize: '0.85rem' }}>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7, color: 'var(--primary-cyan)' }}>
                    <li><strong>0 to 10 kg:</strong> 100 mL / kg / day</li>
                    <li><strong>11 to 20 kg:</strong> 1,000 mL + 50 mL for each kg above 10 kg</li>
                    <li><strong>&gt; 20 kg:</strong> 1,500 mL + 20 mL for each kg above 20 kg</li>
                  </ul>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  <strong>Clinical Rationale:</strong> Maintains plasma volume, accelerates antigen presentation in lymph nodes, and naturally lowers peak body temperatures post-vaccination.
                </p>
              </div>
            </div>
          )}

          {/* Tab 5: Schema */}
          {activeTab === 'schema' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-elevated)' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--primary-teal-light)', marginBottom: '0.5rem' }}>
                  🗄️ Relational Entity-Relationship (ER) Schema
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#070B12', padding: '0.85rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94A3B8' }}>
                    <strong style={{ color: '#F8FAFC' }}>TABLE: patients</strong><br />
                    • id VARCHAR(15) [PK]<br />
                    • child_name VARCHAR(100)<br />
                    • parent_name VARCHAR(100)<br />
                    • dob DATE<br />
                    • gender VARCHAR(10)<br />
                    • blood_group VARCHAR(5)<br />
                    • phone VARCHAR(20)<br />
                    • email VARCHAR(100)<br />
                    • clinic_name VARCHAR(100)<br />
                    • doctor_name VARCHAR(100)
                  </div>

                  <div style={{ background: '#070B12', padding: '0.85rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94A3B8' }}>
                    <strong style={{ color: '#F8FAFC' }}>TABLE: vaccine_schedule</strong><br />
                    • id INTEGER [PK]<br />
                    • patient_id VARCHAR(15) [FK]<br />
                    • vaccine_code VARCHAR(20)<br />
                    • due_date DATE<br />
                    • administered_date DATE<br />
                    • status VARCHAR(20)<br />
                    • batch_number VARCHAR(30)<br />
                    • administering_clinician VARCHAR(100)
                  </div>

                  <div style={{ background: '#070B12', padding: '0.85rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94A3B8' }}>
                    <strong style={{ color: '#F8FAFC' }}>TABLE: notification_logs</strong><br />
                    • id VARCHAR(20) [PK]<br />
                    • patient_id VARCHAR(15) [FK]<br />
                    • channel VARCHAR(20)<br />
                    • recipient VARCHAR(100)<br />
                    • vaccine_name VARCHAR(50)<br />
                    • message_preview TEXT<br />
                    • timestamp DATETIME<br />
                    • status VARCHAR(20)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Viva Voce Q&A */}
          {activeTab === 'viva' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Quick reference answers to the most frequent questions asked by examiners and university evaluators:
              </div>

              {[
                {
                  q: "1. Why was WhatsApp chosen over standard SMS for immunization reminders?",
                  a: "WhatsApp has significantly higher open rates (>98% vs 20% for email/SMS), supports rich interactive text with emojis, allows direct 2-way patient confirmation, supports deep-link Click-to-Chat without per-message telecommunication carrier surcharges, and enables sending comprehensive post-vaccine hydration care cards."
                },
                {
                  q: "2. How does the system compute vaccination milestones for a newborn?",
                  a: "Upon entering the child's Date of Birth (DOB), the scheduler applies standardized clinical offsets based on the Universal Immunization Programme (UIP): Birth (0 days), 6 Weeks (+42 days), 10 Weeks (+70 days), 14 Weeks (+98 days), 9 Months (+270 days), 16 Months (+480 days), and 5 Years (+1825 days)."
                },
                {
                  q: "3. What is the clinical importance of the Hydration module in your project?",
                  a: "Post-immunization immune response induces pyrexia (fever) which increases insensible fluid loss. Dehydration is the leading cause of post-vaccine infant irritability and emergency room visits. By computing Holliday-Segar fluid requirements, our system empowers parents to maintain electrolytic balance and support antibody circulation."
                },
                {
                  q: "4. How is patient data privacy and HIPAA/DISHA compliance ensured?",
                  a: "Patient phone numbers and medical IDs are sanitized and tokenized. WhatsApp messaging uses end-to-end encryption (E2EE). In production deployments, SQLite databases use SQLCipher for 256-bit AES encryption at rest, and all API endpoints enforce HTTPS/TLS 1.3."
                },
                {
                  q: "5. How does the offline/client-side demo work without a paid Twilio key?",
                  a: "The project uses the standard Web URL protocol wa.me with UTF-8 URI encoding. This enables instantaneous browser-to-app handoff directly to real mobile phones during viva presentations without incurring cloud API costs."
                }
              ].map((viva, idx) => (
                <div key={idx} style={{ padding: '1rem', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-teal-light)', marginBottom: '0.35rem' }}>
                    {viva.q}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {viva.a}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
