import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Baby, 
  Calendar, 
  CheckCircle2, 
  Send, 
  Clock, 
  Play, 
  RefreshCw, 
  AlertTriangle,
  Award,
  Smartphone,
  Mail,
  Activity
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ currentUser }) {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggeringCron, setTriggeringCron] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [metricsRes, usersRes] = await Promise.all([
        api.getAdminMetrics().catch(() => ({ metrics: null })),
        api.getAdminUsers().catch(() => ({ users: [] }))
      ]);

      if (metricsRes.metrics) setMetrics(metricsRes.metrics);
      if (usersRes.users) setUsers(usersRes.users);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRunCron = async () => {
    setTriggeringCron(true);
    setStatusMsg(null);
    try {
      const res = await api.triggerCronNow();
      setStatusMsg(`✅ ${res.message}`);
      fetchAdminData();
    } catch (err) {
      setStatusMsg(`❌ Error: ${err.message}`);
    } finally {
      setTriggeringCron(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>ADMINISTRATION</span>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>System Health & Analytics Portal</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Universal Immunization Programme • MoHFW National Node Oversight
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={fetchAdminData} 
            className="btn btn-outline btn-sm"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh Metrics</span>
          </button>

          <button 
            onClick={handleRunCron}
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}
            disabled={triggeringCron}
          >
            <Play size={14} />
            <span>{triggeringCron ? 'Running Scanner...' : 'Trigger Node-Cron Scan (IST)'}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          {statusMsg}
        </div>
      )}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Families</p>
              <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.8rem', fontWeight: 800 }}>{metrics?.totalUsers || 0}</h3>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="var(--primary-teal-light)" />
            </div>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#10b981' }}>Verified Indian Mobile Users</p>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Children Enrolled</p>
              <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.8rem', fontWeight: 800 }}>{metrics?.totalChildren || 0}</h3>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Baby size={20} color="#60a5fa" />
            </div>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Linked with MCP Cards / ABHA</p>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Coverage Rate</p>
              <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.8rem', fontWeight: 800 }}>{metrics?.coverageRate || 0}%</h3>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} color="#34d399" />
            </div>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#34d399' }}>{metrics?.completedSchedules || 0} completed doses</p>
        </div>

        <div className="glass-card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp Dispatches</p>
              <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.8rem', fontWeight: 800 }}>{metrics?.whatsappNotifications || 0}</h3>
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} color="#25D366" />
            </div>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>+ {metrics?.emailNotifications || 0} Email Alerts</p>
        </div>
      </div>

      {/* Scheduler Info Box */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Node-Cron Scheduler Engine Status</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Runs automatically every morning at <strong>08:00 AM IST (Asia/Kolkata)</strong> to dispatch 7-day, 3-day, 1-day, and due-date alerts.
            </p>
          </div>
        </div>
        <span className="badge badge-success" style={{ padding: '0.4rem 0.85rem' }}>
          🟢 {metrics?.schedulerStatus || 'Running (IST 08:00 AM)'}
        </span>
      </div>

      {/* User Management Table */}
      <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Registered Parents & Guardians Directory</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Full Name</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Indian Mobile</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Email Address</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Registered Children</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Preferences</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                    {u.fullName}
                    {u.role === 'admin' && <span className="badge badge-warning" style={{ fontSize: '0.65rem', marginLeft: '0.5rem' }}>Admin</span>}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>{u.mobileNumber}</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-info">{u.childrenRegistered || 0} child</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem' }}>
                    {u.notificationPreferences?.whatsapp && <span style={{ marginRight: '0.5rem' }}>📱 WA</span>}
                    {u.notificationPreferences?.email && <span>✉️ Email</span>}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
