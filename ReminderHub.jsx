import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Play, 
  Settings, 
  AlertCircle,
  Eye,
  Copy,
  Check,
  FileText,
  Clock,
  Droplets,
  Smartphone,
  Globe,
  Share2
} from 'lucide-react';
import { PREDEFINED_TEMPLATES } from '../data/initialData';

export default function ReminderHub({ patients, onAddLog }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [vaccineName, setVaccineName] = useState('Pentavalent-1 / Rotavirus-1');
  const [dueDate, setDueDate] = useState('15-Nov-2026');
  const [selectedTemplateId, setSelectedTemplateId] = useState('wa-standard');
  const [language, setLanguage] = useState('en');
  const [includeHydrationTip, setIncludeHydrationTip] = useState(true);

  const [copied, setCopied] = useState(false);
  const [activeChannel, setActiveChannel] = useState('whatsapp'); // 'whatsapp' | 'email'
  const [simulationStatus, setSimulationStatus] = useState(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Base message templates by language
  const getTemplateContent = () => {
    const pName = selectedPatient?.parentName || 'Parent';
    const cName = selectedPatient?.childName || 'Child';
    const clinic = selectedPatient?.clinicName || 'City Pediatric Health Center';
    const doc = selectedPatient?.doctorName || 'Dr. Priya V. Nambiar';

    let hydrationSnippet = '';
    if (includeHydrationTip) {
      if (language === 'hi') {
        hydrationSnippet = `\n\n💧 *जल व देखभाल टिप:* टीकाकरण के बाद बच्चे को पर्याप्त पानी व स्तनपान कराएं ताकि हल्का बुखार व चिड़चिड़ापन शांत रहे।`;
      } else if (language === 'es') {
        hydrationSnippet = `\n\n💧 *Consejo de Hidratación:* Mantenga a su hijo bien hidratado con agua o leche materna después de la vacuna para aliviar la fiebre leve.`;
      } else {
        hydrationSnippet = `\n\n💧 *Hydration & Recovery Tip:* Keep ${cName} well-hydrated with fluids/milk post-vaccination. Adequate hydration prevents fever spikes and promotes gentle recovery.`;
      }
    }

    if (language === 'hi') {
      if (selectedTemplateId === 'wa-overdue') {
        return `🚨 *अति आवश्यक टीकाकरण सूचना — ${clinic}*\n\nआदरणीय *${pName}* जी,\n\nरिकॉर्ड के अनुसार *${cName}* का आवश्यक टीकाकरण अभी **अतिदेय (Overdue)** है।\n\n💉 *टीका:* ${vaccineName}\n📅 *तारीख:* ${dueDate} (देय)\n📍 *क्लिनिक:* ${clinic}\n\nकृपया बच्चे की सुरक्षा के लिए तुरंत क्लिनिक पधारें या अपॉइंटमेंट बुक करें।${hydrationSnippet}`;
      }
      return `✨ *टीकाकरण अनुस्मारक — ${clinic}*\n\nआदरणीय *${pName}* जी,\n\nयह एक अनुस्मारक है कि *${cName}* का आगामी टीकाकरण निर्धारित है।\n\n💉 *टीका:* ${vaccineName}\n📅 *नियत तिथि:* ${dueDate}\n📍 *क्लिनिक:* ${clinic}\n👩‍⚕️ *डॉक्टर:* ${doc}${hydrationSnippet}\n\nपुष्टि करने के लिए *हाँ (CONFIRM)* लिखकर उत्तर दें।`;
    }

    if (language === 'es') {
      if (selectedTemplateId === 'wa-overdue') {
        return `🚨 *AVISO URGENTE DE VACUNACIÓN — ${clinic}*\n\nEstimado/a *${pName}*,\n\nEl registro médico indica que la vacunación de *${cName}* está **VENCIDA**.\n\n💉 *Vacuna:* ${vaccineName}\n📅 *Fecha límite:* ${dueDate}\n📍 *Clínica:* ${clinic}${hydrationSnippet}\n\nPor favor contáctenos de inmediato para reagendar.`;
      }
      return `✨ *RECORDATORIO DE VACUNACIÓN — ${clinic}*\n\nEstimado/a *${pName}*,\n\nLe recordamos la próxima cita de vacunación para *${cName}*.\n\n💉 *Vacuna:* ${vaccineName}\n📅 *Fecha:* ${dueDate}\n📍 *Clínica:* ${clinic}\n👩‍⚕️ *Doctor(a):* ${doc}${hydrationSnippet}\n\nResponda *CONFIRMAR* para asegurar su cita.`;
    }

    // Default English
    if (selectedTemplateId === 'wa-overdue') {
      return `🚨 *URGENT VACCINE NOTICE — ${clinic}*\n\nDear *${pName}*,\n\nOur pediatric records indicate that *${cName}*'s essential immunization is currently **OVERDUE**.\n\n💉 *Overdue Vaccine:* ${vaccineName}\n📅 *Target Due Date:* ${dueDate} (OVERDUE)\n📍 *Location:* ${clinic}\n👩‍⚕️ *Consultant:* ${doc}${hydrationSnippet}\n\nTimely immunization provides critical disease defense. Please call or reply *RESCHEDULE* today to secure your slot!`;
    } else if (selectedTemplateId === 'wa-postcare') {
      return `💧 *POST-VACCINATION CARE GUIDE — ${clinic}*\n\nDear *${pName}*,\n\nThank you for completing *${cName}*'s vaccination (*${vaccineName}*) today!\n\n📋 *24-Hour Home Care Checklist:*\n1. *Hydration:* Offer frequent sips of clean water or breastmilk to maintain cellular fluid balance.\n2. *Mild Fever:* A normal immune response. Apply a cool, damp washcloth over the forehead and injection thigh.\n3. *No Massaging:* Do not rub the injection site.\n\nWishing ${cName} a speedy, comfortable day! ❤️`;
    }

    return `✨ *IMMUNIZATION APPOINTMENT REMINDER — ${clinic}*\n\nDear *${pName}*,\n\nThis is a friendly alert that *${cName}* is scheduled for an essential childhood vaccination.\n\n💉 *Vaccine:* ${vaccineName}\n📅 *Appointment Date:* ${dueDate}\n📍 *Clinic:* ${clinic}\n👩‍⚕️ *Pediatrician:* ${doc}${hydrationSnippet}\n\nPlease reply *CONFIRM* to lock in your appointment time.`;
  };

  const formattedMessage = getTemplateContent();

  const emailSubject = selectedTemplateId === 'wa-overdue'
    ? `🚨 URGENT: Overdue Immunization Alert for ${selectedPatient?.childName} (${vaccineName})`
    : `🗓️ Childhood Immunization Reminder: ${selectedPatient?.childName} (${vaccineName})`;

  // WhatsApp wa.me link
  const rawPhone = (selectedPatient?.phone || '').replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${rawPhone}?text=${encodeURIComponent(formattedMessage)}`;

  // Mailto link for direct launch of default email client
  const mailtoLink = `mailto:${selectedPatient?.email || ''}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(formattedMessage.replace(/\*/g, ''))}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dispatch real WhatsApp via wa.me + Log record
  const handleLaunchWhatsApp = () => {
    if (!selectedPatient) return;
    
    onAddLog({
      patientId: selectedPatient.id,
      childName: selectedPatient.childName,
      parentName: selectedPatient.parentName,
      channel: 'WhatsApp',
      recipient: selectedPatient.phone,
      vaccineName: `${vaccineName} (${selectedTemplateId})`,
      messagePreview: formattedMessage.substring(0, 95) + '...',
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Sent',
      statusBadge: 'success'
    });

    window.open(waLink, '_blank');
  };

  // Dispatch email via mailto + Log record
  const handleLaunchEmail = () => {
    if (!selectedPatient) return;

    onAddLog({
      patientId: selectedPatient.id,
      childName: selectedPatient.childName,
      parentName: selectedPatient.parentName,
      channel: 'Email (SMTP)',
      recipient: selectedPatient.email,
      vaccineName: `${vaccineName} (Email Alert)`,
      messagePreview: formattedMessage.substring(0, 95) + '...',
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Sent',
      statusBadge: 'success'
    });

    window.open(mailtoLink, '_blank');
  };

  // Simulate automated multi-step dispatch queue
  const handleSimulateAutomatedCron = () => {
    if (!selectedPatient) return;

    setSimulationStatus({ step: '1/3 Initializing secure Redis task queue & cron trigger...', progress: 30 });
    
    setTimeout(() => {
      setSimulationStatus({ step: `2/3 Authenticating Meta WhatsApp Business & SendGrid SMTP payload for ${selectedPatient.phone}...`, progress: 70 });
    }, 800);

    setTimeout(() => {
      setSimulationStatus({ step: '3/3 Payload delivered! Provider 200 OK ACK logged to SQLite database.', progress: 100 });
      
      onAddLog({
        patientId: selectedPatient.id,
        childName: selectedPatient.childName,
        parentName: selectedPatient.parentName,
        channel: 'WhatsApp & Email Cloud Cron',
        recipient: `${selectedPatient.phone} | ${selectedPatient.email}`,
        vaccineName: `${vaccineName} (Automated Scheduler)`,
        messagePreview: formattedMessage.substring(0, 95) + '...',
        timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        status: 'Delivered',
        statusBadge: 'success'
      });

      setTimeout(() => setSimulationStatus(null), 3000);
    }, 1700);
  };

  return (
    <div className="container" style={{ paddingBottom: '3.5rem' }}>
      
      {/* Header Banner */}
      <div className="quote-banner" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '280px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #25D366 0%, #0D9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 6px 18px rgba(37, 211, 102, 0.35)'
            }}>
              <Send size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Multi-Channel Dispatch Engine</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>WhatsApp Web Deep Links & SMTP Gateway</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700 }}>WhatsApp & Email Immunization Reminder Hub</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Compose, preview on simulated mobile screens, and trigger real-time reminder alerts to parents.
              </p>
            </div>
          </div>

          {/* Channel Selector Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-elevated)', padding: '0.3rem', borderRadius: '10px' }}>
            <button
              onClick={() => setActiveChannel('whatsapp')}
              className={`btn btn-sm ${activeChannel === 'whatsapp' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none', background: activeChannel === 'whatsapp' ? 'var(--accent-whatsapp)' : 'transparent', color: activeChannel === 'whatsapp' ? '#000000' : 'var(--text-muted)', fontWeight: 600 }}
            >
              <MessageSquare size={16} /> WhatsApp Dispatch
            </button>
            <button
              onClick={() => setActiveChannel('email')}
              className={`btn btn-sm ${activeChannel === 'email' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none', background: activeChannel === 'email' ? 'var(--primary-teal)' : 'transparent', color: activeChannel === 'email' ? '#FFFFFF' : 'var(--text-muted)', fontWeight: 600 }}
            >
              <Mail size={16} /> Email (SMTP) Dispatch
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Form Controls & Template Customizer */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Settings size={18} color="var(--primary-teal-light)" />
            Configure Reminder Parameters
          </h3>

          {/* Child Select */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Select Child Recipient:
            </label>
            <select
              className="form-control"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.childName} (Parent: {p.parentName} • {p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Vaccine & Due Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Vaccine Dose:
              </label>
              <input
                type="text"
                className="form-control"
                value={vaccineName}
                onChange={(e) => setVaccineName(e.target.value)}
                placeholder="e.g. Pentavalent-1 / OPV-1"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Target Due Date:
              </label>
              <input
                type="text"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. 15-Nov-2026"
              />
            </div>
          </div>

          {/* Template Category Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Message Template Preset:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {[
                { id: 'wa-standard', label: '🗓️ Upcoming (7-Day)' },
                { id: 'wa-overdue', label: '🚨 Urgent Overdue' },
                { id: 'wa-postcare', label: '💧 Post-Vax Care' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`btn btn-sm ${selectedTemplateId === t.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem', padding: '0.45rem 0.5rem' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector & Hydration Checkbox */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem', background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.3rem' }}>
                <Globe size={13} /> Language:
              </label>
              <select
                className="form-control"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
              >
                <option value="en">English (Default)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="es">Español (Spanish)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <Droplets size={13} color="var(--primary-cyan)" /> Hydration Guidance:
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeHydrationTip}
                  onChange={(e) => setIncludeHydrationTip(e.target.checked)}
                  style={{ accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
                />
                Include Fluid Tips
              </label>
            </div>
          </div>

          {/* Action Dispatch Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeChannel === 'whatsapp' ? (
              <button
                onClick={handleLaunchWhatsApp}
                className="btn btn-primary"
                style={{ background: 'var(--accent-whatsapp)', borderColor: 'var(--accent-whatsapp)', color: '#000000', fontWeight: 700, padding: '0.75rem' }}
              >
                <ExternalLink size={18} />
                <span>🚀 Launch Real WhatsApp Message (wa.me)</span>
              </button>
            ) : (
              <button
                onClick={handleLaunchEmail}
                className="btn btn-primary"
                style={{ padding: '0.75rem', fontWeight: 700 }}
              >
                <Mail size={18} />
                <span>📧 Open in Email Client (mailto:)</span>
              </button>
            )}

            <button
              onClick={handleSimulateAutomatedCron}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', borderColor: 'var(--border-subtle)' }}
            >
              <Play size={15} />
              <span>Simulate Cloud Background Dispatch Job (Cron)</span>
            </button>
          </div>

          {/* Simulation Progress Card */}
          {simulationStatus && (
            <div style={{ marginTop: '1rem', padding: '0.85rem', borderRadius: '8px', background: 'rgba(13, 148, 136, 0.15)', border: '1px solid var(--primary-teal)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--primary-teal-light)' }}>
                <span>{simulationStatus.step}</span>
                <span>{simulationStatus.progress}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${simulationStatus.progress}%`, height: '100%', background: 'var(--primary-teal)', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Realistic Device Preview Screen */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone size={18} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                {activeChannel === 'whatsapp' ? 'Live WhatsApp Phone Mockup' : 'Live HTML Email Preview'}
              </h3>
            </div>
            
            <button
              onClick={handleCopyMessage}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', gap: '0.35rem' }}
              title="Copy message content"
            >
              {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {activeChannel === 'whatsapp' ? (
            /* Smartphone Chat Bezel */
            <div style={{
              flex: 1,
              borderRadius: '24px',
              border: '6px solid #1E293B',
              background: '#0B141A',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* WhatsApp App Header */}
              <div style={{
                background: '#1F2C34',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  VA
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E9EDEF', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>{selectedPatient?.clinicName || 'VaxAlert Health'}</span>
                    <span style={{ fontSize: '0.65rem', background: '#00A884', color: '#FFFFFF', padding: '0.05rem 0.35rem', borderRadius: '4px' }}>VERIFIED</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8696A0' }}>Official Child Immunization Service</div>
                </div>
              </div>

              {/* Chat Message Bubble Body */}
              <div style={{
                flex: 1,
                padding: '1.25rem',
                background: 'radial-gradient(circle, rgba(17, 27, 33, 0.8) 0%, rgba(11, 20, 26, 1) 100%)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  maxWidth: '92%',
                  background: '#005C4B',
                  color: '#E9EDEF',
                  borderRadius: '12px 12px 2px 12px',
                  padding: '0.9rem 1rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  position: 'relative'
                }}>
                  {formattedMessage}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', marginTop: '0.4rem', fontSize: '0.65rem', color: '#8696A0' }}>
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span style={{ color: '#53BDEB' }}>✓✓</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Input Footer Simulation */}
              <div style={{
                background: '#1F2C34',
                padding: '0.6rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#8696A0',
                fontSize: '0.8rem'
              }}>
                <div style={{ flex: 1, background: '#2A3942', padding: '0.45rem 0.75rem', borderRadius: '18px', color: '#8696A0' }}>
                  Reply CONFIRM or RESCHEDULE...
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#00A884', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                  <Send size={14} />
                </div>
              </div>
            </div>
          ) : (
            /* HTML Email Preview Card */
            <div style={{
              flex: 1,
              background: '#FFFFFF',
              color: '#0F172A',
              borderRadius: '14px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              overflowY: 'auto'
            }}>
              {/* Email Clinic Header Banner */}
              <div style={{ borderBottom: '2px solid #0D9488', paddingBottom: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: '#0F172A', margin: 0, fontWeight: 700 }}>{selectedPatient?.clinicName}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>Department of Pediatric Medicine & Preventative Health</span>
                </div>
                <div style={{ background: '#E6FFFA', color: '#0D9488', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                  CONFIDENTIAL PATIENT ADVISORY
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.75rem' }}>
                <strong>To:</strong> {selectedPatient?.parentName} &lt;{selectedPatient?.email}&gt;<br />
                <strong>Subject:</strong> {emailSubject}
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '1rem', border: '1px solid #E2E8F0', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: '1.25rem' }}>
                {formattedMessage.replace(/\*/g, '')}
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem', fontSize: '0.75rem', color: '#94A3B8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Official Health Dispatcher ID: VAX-{selectedPatient?.id}</span>
                <span>Powered by VaxAlert Pro</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
