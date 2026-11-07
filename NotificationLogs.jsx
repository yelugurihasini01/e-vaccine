import React, { useState } from 'react';
import { History, Search, MessageSquare, Mail, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export default function NotificationLogs({ logs, onResendLog }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.recipient.includes(searchQuery) ||
                          log.vaccineName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (channelFilter === 'WhatsApp') return matchesSearch && log.channel.includes('WhatsApp');
    if (channelFilter === 'Email') return matchesSearch && log.channel === 'Email';
    return matchesSearch;
  });

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Notification Dispatch Logs & Audit Trail</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Timestamped history of all WhatsApp messages and Email reminders sent to parents.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="form-control"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          <select 
            className="form-control"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="All">All Channels</option>
            <option value="WhatsApp">WhatsApp Only</option>
            <option value="Email">Email Only</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: 0 }}>
        {filteredLogs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <History size={40} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
            <p>No dispatch logs matching your criteria.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Channel</th>
                <th>Child & Parent</th>
                <th>Target Recipient</th>
                <th>Vaccine Alert Details</th>
                <th>Delivery Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{log.timestamp}</div>
                  </td>

                  <td>
                    {log.channel.includes('WhatsApp') ? (
                      <span className="badge" style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
                        <MessageSquare size={12} />
                        <span>WhatsApp</span>
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38BDF8', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                        <Mail size={12} />
                        <span>Email</span>
                      </span>
                    )}
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{log.childName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Parent: {log.parentName}</div>
                  </td>

                  <td>
                    <code style={{ fontSize: '0.825rem', color: 'var(--primary-teal-light)' }}>{log.recipient}</code>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.vaccineName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      "{log.messagePreview}"
                    </div>
                  </td>

                  <td>
                    <span className={`badge ${log.statusBadge === 'danger' ? 'badge-danger' : log.statusBadge === 'info' ? 'badge-info' : 'badge-success'}`}>
                      {log.status}
                    </span>
                  </td>

                  <td>
                    <button 
                      onClick={() => onResendLog(log)} 
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                      title="Re-trigger reminder"
                    >
                      <RefreshCw size={13} />
                      <span>Re-send</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
