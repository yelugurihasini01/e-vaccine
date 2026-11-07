import React, { useState } from 'react';
import { BookOpen, Search, ShieldCheck, AlertCircle, Info, Filter } from 'lucide-react';
import { VACCINE_SCHEDULE_DEFINITIONS } from '../data/vaccineSchedule';

export default function VaccineLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMandatory, setFilterMandatory] = useState('All');

  // Flatten all vaccines from milestones
  const allVaccines = [];
  VACCINE_SCHEDULE_DEFINITIONS.forEach(group => {
    group.vaccines.forEach(v => {
      allVaccines.push({
        ...v,
        milestone: group.milestone
      });
    });
  });

  const filteredVaccines = allVaccines.filter(v => {
    const matchesSearch = v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.disease.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterMandatory === 'Mandatory') return matchesSearch && v.mandatory;
    if (filterMandatory === 'Optional') return matchesSearch && !v.mandatory;
    return matchesSearch;
  });

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Immunization & Vaccine Directory</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Official WHO & National Immunization Schedule reference guide, dosages, and target pathogens.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="form-control"
              placeholder="Search vaccine, disease..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <select 
            className="form-control"
            value={filterMandatory}
            onChange={(e) => setFilterMandatory(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="All">All Types</option>
            <option value="Mandatory">Mandatory Only</option>
            <option value="Optional">Optional / Routine</option>
          </select>
        </div>
      </div>

      {/* Vaccine Table / Cards */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vaccine Code & Name</th>
              <th>Target Disease / Pathogen</th>
              <th>Recommended Age</th>
              <th>Dose & Route</th>
              <th>Injection Site</th>
              <th>Classification</th>
            </tr>
          </thead>
          <tbody>
            {filteredVaccines.map((vac, idx) => (
              <tr key={idx}>
                <td>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>{vac.code}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-teal-light)' }}>{vac.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', maxWidth: '320px' }}>
                    {vac.description}
                  </div>
                </td>

                <td>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{vac.disease}</span>
                </td>

                <td>
                  <span className="badge badge-info" style={{ textTransform: 'none' }}>
                    {vac.milestone}
                  </span>
                </td>

                <td>
                  <div style={{ fontSize: '0.85rem' }}>{vac.dose}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vac.route}</div>
                </td>

                <td>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{vac.site}</span>
                </td>

                <td>
                  {vac.mandatory ? (
                    <span className="badge badge-success">Mandatory</span>
                  ) : (
                    <span className="badge badge-warning">Optional</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
