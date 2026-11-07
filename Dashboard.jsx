import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  Send, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  Quote, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Calendar,
  Droplets,
  HeartHandshake,
  Activity,
  Award,
  BellRing,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { IMMUNIZATION_QUOTES } from '../data/quotesData';

export default function Dashboard({ 
  patients, 
  logs, 
  setActiveTab, 
  onSendWhatsApp, 
  onSendEmail, 
  onMarkCompleted,
  onOpenAddPatient,
  onBatchDispatchWhatsApp
}) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteCategory, setQuoteCategory] = useState('All');
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Filter quotes by category
  const filteredQuotes = quoteCategory === 'All' 
    ? IMMUNIZATION_QUOTES 
    : IMMUNIZATION_QUOTES.filter(q => q.category === quoteCategory);

  const currentQuote = filteredQuotes[quoteIndex % filteredQuotes.length] || IMMUNIZATION_QUOTES[0];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % filteredQuotes.length);
  };

  const handlePrevQuote = () => {
    setQuoteIndex((prev) => (prev - 1 + filteredQuotes.length) % filteredQuotes.length);
  };

  const handleShareQuoteWA = () => {
    const text = `💡 *Child Health & Hydration Insight*\n\n"${currentQuote.text}"\n\n— *${currentQuote.author}* (${currentQuote.tag})\n\nShared via VaxAlert Pro Pediatric Immunization Platform.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyQuote = () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  // Compute upcoming and overdue vaccine items
  const upcomingItems = [];
  const overdueItems = [];
  let totalDosesCompleted = 0;
  let totalDosesTracked = 0;

  patients.forEach(patient => {
    if (patient.customVaccineStatus) {
      Object.entries(patient.customVaccineStatus).forEach(([vacName, info]) => {
        totalDosesTracked++;
        if (info.status === 'Completed') {
          totalDosesCompleted++;
        } else if (info.status === 'Overdue') {
          overdueItems.push({
            patient,
            vaccineName: vacName,
            dueDate: info.dueDate || 'Overdue'
          });
        } else if (info.status === 'Scheduled') {
          upcomingItems.push({
            patient,
            vaccineName: vacName,
            dueDate: info.dueDate || 'Upcoming'
          });
        }
      });
    }
  });

  const totalPatientsCount = patients.length;
  const overdueCount = overdueItems.length;
  const upcomingCount = upcomingItems.length;
  const totalLogsCount = logs.length;
  const complianceRate = totalDosesTracked > 0 ? Math.round((totalDosesCompleted / totalDosesTracked) * 100) : 100;

  return (
    <div className="container" style={{ paddingBottom: '3.5rem' }}>
      
      {/* Dynamic Health & Hydration Quotes Banner with Category Switcher */}
      <div className="quote-banner" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'var(--primary-teal-light)'
            }}>
              {currentQuote.category === 'Hydration' ? <Droplets size={24} color="var(--primary-cyan)" /> : <Quote size={24} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                <span className={`badge ${currentQuote.category === 'Hydration' ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '0.7rem' }}>
                  {currentQuote.tag}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Quote #{currentQuote.id} of {filteredQuotes.length}
                </span>

                {/* Filter buttons */}
                <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                  {['All', 'Hydration', 'Immunology', 'ParentalCare'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setQuoteCategory(cat);
                        setQuoteIndex(0);
                      }}
                      className={`btn btn-sm ${quoteCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                      style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', border: 'none' }}
                    >
                      {cat === 'ParentalCare' ? 'Care' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <p style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5, color: '#FFFFFF' }}>
                "{currentQuote.text}"
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--primary-teal-light)', fontWeight: 600 }}>
                  — {currentQuote.author}
                </span>

                {/* Share actions */}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={handleShareQuoteWA}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderColor: 'var(--accent-whatsapp)', color: 'var(--accent-whatsapp)' }}
                    title="Share this health quote to WhatsApp"
                  >
                    <Share2 size={12} /> WhatsApp
                  </button>
                  <button
                    onClick={handleCopyQuote}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    title="Copy quote"
                  >
                    {copiedQuote ? <Check size={12} color="var(--accent-emerald)" /> : <Sparkles size={12} />}
                    {copiedQuote ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Next / Prev Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button 
              onClick={handlePrevQuote} 
              className="btn btn-outline btn-sm"
              style={{ padding: '0.4rem 0.5rem' }}
              title="Previous Quote"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextQuote} 
              className="btn btn-outline btn-sm"
              style={{ padding: '0.4rem 0.5rem' }}
              title="Next Quote"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* KPI Clinical Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        {/* Card 1: Registered Children */}
        <div className="glass-card stat-card" onClick={() => setActiveTab('patients')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <span className="stat-label">Active Infant Registry</span>
              <div className="stat-value">{totalPatientsCount}</div>
            </div>
            <div style={{ padding: '0.65rem', borderRadius: '12px', background: 'rgba(13, 148, 136, 0.2)', color: 'var(--primary-teal-light)' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Active Cohort</span>
            <span>• Universal Immunization</span>
          </div>
        </div>

        {/* Card 2: Upcoming Doses */}
        <div className="glass-card stat-card" onClick={() => setActiveTab('milestones')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <span className="stat-label">Upcoming Vaccinations</span>
              <div className="stat-value" style={{ color: 'var(--primary-cyan)' }}>{upcomingCount}</div>
            </div>
            <div style={{ padding: '0.65rem', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--primary-cyan)' }}>
              <Calendar size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={13} color="var(--primary-cyan)" />
            <span>Scheduled in next 14-30 days</span>
          </div>
        </div>

        {/* Card 3: Overdue Alerts */}
        <div className="glass-card stat-card" onClick={() => setActiveTab('reminder')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <span className="stat-label">Critical Overdue Alerts</span>
              <div className="stat-value" style={{ color: overdueCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                {overdueCount}
              </div>
            </div>
            <div style={{ padding: '0.65rem', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: overdueCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            <BellRing size={13} />
            <span>{overdueCount > 0 ? 'Immediate WhatsApp outreach needed' : 'All cohorts up to date'}</span>
          </div>
        </div>

        {/* Card 4: Compliance Rate */}
        <div className="glass-card stat-card" onClick={() => setActiveTab('hydration')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <span className="stat-label">Full Compliance Rate</span>
              <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>{complianceRate}%</div>
            </div>
            <div style={{ padding: '0.65rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)' }}>
              <Award size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Droplets size={13} color="var(--primary-cyan)" />
            <span>{totalDosesCompleted} doses completed & verified</span>
          </div>
        </div>

      </div>

      {/* Quick Action Clinical Banner */}
      <div className="glass-card" style={{ padding: '1.25rem 1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(13, 148, 136, 0.15) 100%)' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary-teal-light)" />
            Hospital Pediatric Clinical Actions
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Dispatch automated WhatsApp reminders, register newborn babies, or compute fluid recovery plans.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={onOpenAddPatient} className="btn btn-primary btn-sm">
            + Register Newborn Child
          </button>
          <button 
            onClick={onBatchDispatchWhatsApp} 
            className="btn btn-outline btn-sm"
            style={{ borderColor: 'var(--accent-whatsapp)', color: 'var(--accent-whatsapp)' }}
          >
            <MessageSquare size={14} />
            <span>Broadcast Overdue WhatsApp ({overdueCount})</span>
          </button>
          <button onClick={() => setActiveTab('hydration')} className="btn btn-outline btn-sm">
            <Droplets size={14} color="var(--primary-cyan)" />
            <span>Hydration Calculator</span>
          </button>
        </div>
      </div>

      {/* Main Content Split: Overdue Queue & Upcoming Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
        
        {/* Left Box: Urgent Overdue Priority Action Queue */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="var(--accent-rose)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>High-Priority Overdue Alerts</h3>
            </div>
            <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>{overdueCount} Pending</span>
          </div>

          {overdueItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 0.75rem auto', display: 'block' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Zero Overdue Vaccines!</p>
              <span style={{ fontSize: '0.8rem' }}>All registered children are fully up-to-date with their milestones.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {overdueItems.slice(0, 5).map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)',
                    borderLeft: '4px solid var(--accent-rose)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>
                      {item.patient.childName} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({item.patient.id})</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                      ⚠️ {item.vaccineName} (Target: {item.dueDate})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Parent: {item.patient.parentName} • {item.patient.phone}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => onSendWhatsApp(item.patient, item.vaccineName, item.dueDate, true)}
                      className="btn btn-sm"
                      style={{ background: 'var(--accent-whatsapp)', color: '#000000', padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 600 }}
                      title="Launch Urgent WhatsApp reminder"
                    >
                      <MessageSquare size={13} /> Send Alert
                    </button>
                    <button
                      onClick={() => onMarkCompleted(item.patient.id, item.vaccineName)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                      title="Mark as Administered"
                    >
                      <CheckCircle2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Box: Upcoming Milestone Appointments */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Upcoming Vaccine Appointments</h3>
            </div>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{upcomingCount} Scheduled</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {upcomingItems.slice(0, 5).map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  borderLeft: '4px solid var(--primary-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>
                    {item.patient.childName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-teal-light)' }}>
                    💉 {item.vaccineName} • Due: {item.dueDate}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Parent: {item.patient.parentName} • {item.patient.phone}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => onSendWhatsApp(item.patient, item.vaccineName, item.dueDate, false)}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: 'var(--accent-whatsapp)', color: 'var(--accent-whatsapp)', padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    title="Send WhatsApp Reminder"
                  >
                    <Send size={13} /> Remind
                  </button>
                  <button
                    onClick={() => onMarkCompleted(item.patient.id, item.vaccineName)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                    title="Mark as Administered"
                  >
                    <CheckCircle2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button 
              onClick={() => setActiveTab('milestones')}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', fontSize: '0.8rem' }}
            >
              View Full Interactive Milestone Timeline <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
