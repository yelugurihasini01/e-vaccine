import React, { useState } from 'react';
import { 
  Droplets, 
  Calculator, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Printer, 
  Sparkles, 
  Info, 
  Thermometer, 
  ShieldCheck, 
  Baby, 
  Coffee,
  Check
} from 'lucide-react';
import { 
  calculateHollidaySegar, 
  AGE_HYDRATION_BENCHMARKS, 
  POST_VAX_24HR_TIMELINE, 
  DEHYDRATION_SYMPTOM_TRIAGE 
} from '../data/hydrationData';

export default function HydrationCareCenter({ patients }) {
  const [selectedWeight, setSelectedWeight] = useState(8.5);
  const [selectedChildId, setSelectedChildId] = useState(patients[0]?.id || '');
  const [completedSteps, setCompletedSteps] = useState({});
  const [copiedShareText, setCopiedShareText] = useState(false);

  const selectedChild = patients.find(p => p.id === selectedChildId) || patients[0];

  // Calculate fluid values
  const fluidResult = calculateHollidaySegar(selectedWeight);

  const toggleStep = (stepIdx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepIdx]: !prev[stepIdx]
    }));
  };

  const handleWeightPreset = (kg) => {
    setSelectedWeight(kg);
  };

  // WhatsApp Care Slip Generator
  const careSlipMessage = `💧 *PEDIATRIC HYDRATION & POST-VAX CARE SLIP*
Clinic: ${selectedChild?.clinicName || 'Pediatric Health Center'}
Child Name: *${selectedChild?.childName || 'Child'}* (Weight: ~${selectedWeight} kg)

📌 *Calculated Daily Fluid Target:*
• Maintenance Fluids: *${fluidResult.dailyMl} mL / day* (~${fluidResult.cups} cups)
• Hourly Target: ~${fluidResult.hourlyMl} mL / hour

🩺 *Clinical Advice:*
${fluidResult.guidance}

⏰ *Key Post-Shot Guidelines:*
1. Offer small frequent sips of water/milk every 45-60 mins.
2. Apply a clean cool damp cloth over injection site if tender.
3. Dress in loose, breathable cotton clothes.
4. Check for at least 4-6 wet diapers in 24 hours.

Stay hydrated & feel better soon! ❤️`;

  const handleShareWhatsApp = () => {
    const rawPhone = (selectedChild?.phone || '').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(careSlipMessage)}`;
    window.open(url, '_blank');
  };

  const handleCopySlip = () => {
    navigator.clipboard.writeText(careSlipMessage);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2000);
  };

  return (
    <div className="container" style={{ paddingBottom: '3.5rem' }}>
      
      {/* Top Banner */}
      <div className="quote-banner" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)', borderColor: 'var(--border-glow)' }}>
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
              <Droplets size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Clinical Pediatrics & Fluid Therapy</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Holliday-Segar Standard</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700 }}>Pediatric Hydration & Post-Vaccination Wellness Center</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Maintain optimal fluid balance, soothe post-injection fever, and assist antibody circulation.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button 
              onClick={handleShareWhatsApp}
              className="btn btn-outline btn-sm"
              style={{ borderColor: 'var(--accent-whatsapp)', color: 'var(--accent-whatsapp)' }}
              title="Share hydration care slip directly to parent WhatsApp"
            >
              <Share2 size={16} />
              <span>Share via WhatsApp</span>
            </button>
            <button 
              onClick={() => window.print()}
              className="btn btn-outline btn-sm"
              title="Print Clinical Care Slip"
            >
              <Printer size={16} />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        
        {/* Module 1: Interactive Fluid Calculator */}
        <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--primary-cyan)' }}>
                <Calculator size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Daily Water & Fluid Calculator</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Holliday-Segar Pediatric Clinical Formula</span>
              </div>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Evidence-Based</span>
          </div>

          {/* Child Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Select Registered Child (Optional Profile):
            </label>
            <select
              className="form-control"
              value={selectedChildId}
              onChange={(e) => {
                setSelectedChildId(e.target.value);
                const found = patients.find(p => p.id === e.target.value);
                if (found) {
                  // Rough weight heuristic if not stored
                  setSelectedWeight(8.5);
                }
              }}
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.childName} ({p.id}) — Parent: {p.parentName}
                </option>
              ))}
            </select>
          </div>

          {/* Weight Slider & Presets */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Child Body Weight:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-teal-light)' }}>
                  {selectedWeight}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>kg</span>
              </div>
            </div>

            <input 
              type="range" 
              min="3" 
              max="30" 
              step="0.5" 
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-teal)', cursor: 'pointer' }}
            />

            {/* Quick Weight Presets */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Newborn (4 kg)', kg: 4 },
                { label: '6 Months (8 kg)', kg: 8 },
                { label: '1 Year (10 kg)', kg: 10 },
                { label: '2 Years (12.5 kg)', kg: 12.5 },
                { label: '5 Years (18 kg)', kg: 18 }
              ].map(preset => (
                <button
                  key={preset.kg}
                  type="button"
                  onClick={() => handleWeightPreset(preset.kg)}
                  className={`btn btn-sm ${selectedWeight === preset.kg ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Output Display Card */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ borderRight: '1px solid var(--border-subtle)', paddingRight: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>24-Hr Fluid Target</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>{fluidResult.dailyMl}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)' }}>mL / day</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total daily intake</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>In Standard Cups</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-teal-light)' }}>{fluidResult.cups}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>cups (180ml)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>~{fluidResult.hourlyMl} mL/hour</span>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(13, 148, 136, 0.1)', borderLeft: '3px solid var(--primary-teal)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Info size={16} color="var(--primary-teal-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  <strong>Pediatric Note:</strong> {fluidResult.guidance}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleShareWhatsApp}
              className="btn btn-primary"
              style={{ flex: 1, fontSize: '0.85rem', background: 'var(--accent-whatsapp)', borderColor: 'var(--accent-whatsapp)', color: '#000000', fontWeight: 600 }}
            >
              <Share2 size={16} /> Send to WhatsApp
            </button>
            <button
              onClick={handleCopySlip}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              {copiedShareText ? <Check size={16} color="var(--accent-emerald)" /> : <Sparkles size={16} />}
              {copiedShareText ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
        </div>

        {/* Module 2: Age-Based Hydration Benchmarks */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)' }}>
                <Baby size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Age-Specific Fluid Milestones</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WHO & IAP Immunization Fluid Benchmarks</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {AGE_HYDRATION_BENCHMARKS.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>{item.ageGroup}</span>
                  <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{item.averageWeight}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Droplets size={14} color="var(--primary-cyan)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-teal-light)' }}>
                    Target: {item.recommendedFluid}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.35rem' }}>
                  {item.waterAdvice}
                </p>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.35rem' }}>
                  💡 <strong>Post-Vax:</strong> {item.postVaxTip}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Module 3: 24-Hour Post-Vaccination Recovery Protocol */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.55rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)' }}>
              <Clock size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>24-Hour Post-Vaccination Recovery Checklist</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Interactive protocol for parents to track comfort, hydration, and temperature control post-injection.
              </p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Check off steps as you complete them during recovery
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {POST_VAX_24HR_TIMELINE.map((step, idx) => {
            const isDone = completedSteps[idx];
            return (
              <div 
                key={idx}
                onClick={() => toggleStep(idx)}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-elevated)',
                  border: isDone ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                    {step.hourRange}
                  </span>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: isDone ? 'none' : '2px solid var(--border-subtle)',
                    background: isDone ? 'var(--accent-emerald)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    {isDone && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0', color: isDone ? 'var(--accent-emerald)' : '#FFFFFF' }}>
                  {step.focus}
                </h4>

                <div style={{ marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    <Droplets size={14} color="var(--primary-cyan)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span><strong>Hydration:</strong> {step.hydrationAction}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  <Heart size={14} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Care:</strong> {step.careAction}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module 4: Dehydration Diagnostic Triage (Normal vs Emergency) */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ padding: '0.55rem', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Dehydration & Symptom Triage Matrix</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Recognize expected post-vaccine immune signs versus early dehydration red flags requiring medical review.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {DEHYDRATION_SYMPTOM_TRIAGE.map((triage, idx) => {
            const isNormal = triage.severity === 'normal';
            const isWarning = triage.severity === 'warning';
            const isCritical = triage.severity === 'critical';

            const badgeClass = isNormal ? 'badge-success' : isWarning ? 'badge-warning' : 'badge-danger';
            const borderCol = isNormal ? 'rgba(16, 185, 129, 0.3)' : isWarning ? 'rgba(245, 158, 11, 0.3)' : 'rgba(244, 63, 94, 0.3)';

            return (
              <div 
                key={idx}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${borderCol}`,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span className={`badge ${badgeClass}`} style={{ fontSize: '0.7rem' }}>
                    {triage.sign}
                  </span>
                </div>

                <div style={{ flex: 1, marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Observable Symptoms:
                  </span>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {triage.symptoms.map((s, sIdx) => (
                      <li key={sIdx} style={{ marginBottom: '0.25rem' }}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: isCritical ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  borderLeft: `3px solid ${isNormal ? 'var(--accent-emerald)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-rose)'}`
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block' }}>
                    RECOMMENDED ACTION:
                  </span>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: isCritical ? 'var(--accent-rose)' : 'var(--text-main)', fontWeight: isCritical ? 600 : 400 }}>
                    {triage.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
