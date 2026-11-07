import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Send, 
  BookOpen, 
  Award, 
  History, 
  Plus, 
  Sun, 
  Moon,
  Droplets,
  Milestone,
  GraduationCap,
  Download,
  ShieldAlert,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAddPatient, 
  onOpenAcademicDocs, 
  onOpenAuthModal,
  currentUser,
  onLogout,
  stats, 
  theme, 
  toggleTheme 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Child Records', icon: Users, badge: stats.totalPatients },
    { id: 'milestones', label: 'Milestone Journey', icon: Milestone },
    { id: 'reminder', label: 'WhatsApp & Email Hub', icon: Send, badge: stats.overdueCount > 0 ? `${stats.overdueCount} Alert` : null, badgeColor: 'badge-danger' },
    { id: 'hydration', label: '💧 Hydration & Care', icon: Droplets },
    { id: 'library', label: 'Vaccine Library', icon: BookOpen },
    { id: 'certificate', label: 'Digital Passport', icon: Award },
    { id: 'logs', label: 'Dispatch Logs', icon: History, badge: stats.sentLogsCount },
    { id: 'admin', label: 'Admin Node', icon: ShieldAlert, badge: 'Live', badgeColor: 'badge-warning' }
  ];

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 50, marginBottom: '1.5rem' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)'
          }}>
            <ShieldCheck size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', margin: 0, fontWeight: 800 }}>VaxAlert<span className="gradient-text">Pro</span></h1>
              <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>UIP India v3.0</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>National Child Immunization WhatsApp & Email Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', overflowX: 'auto', padding: '0.2rem 0' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  border: isActive ? 'none' : '1px solid transparent',
                  background: isActive ? undefined : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.825rem',
                  padding: '0.45rem 0.75rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={item.badgeColor || 'badge badge-success'} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', marginLeft: '0.25rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Action & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '0.25rem 0.6rem' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={14} color="#ffffff" />
              </div>
              <div style={{ lineHeight: 1.1, textAlign: 'left' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>{currentUser.fullName}</span>
                <span style={{ fontSize: '0.65rem', color: '#f59e0b' }}>{currentUser.mobileNumber || '🇮🇳 India'}</span>
              </div>
              <button
                onClick={onLogout}
                className="btn btn-outline btn-sm"
                title="Log out of account"
                style={{ padding: '0.25rem 0.4rem', borderRadius: '50%', marginLeft: '0.2rem', border: 'none' }}
              >
                <LogOut size={14} color="var(--text-muted)" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.8rem', background: 'linear-gradient(135deg, #0284c7, #0369a1)', border: 'none' }}
            >
              <LogIn size={15} />
              <span>Login (+91 OTP)</span>
            </button>
          )}

          <button
            onClick={onOpenAcademicDocs}
            className="btn btn-academic btn-sm"
            title="Academic Project Docs & Viva Reference"
            style={{ fontSize: '0.8rem' }}
          >
            <GraduationCap size={16} />
            <span>Docs</span>
          </button>

          <button 
            onClick={toggleTheme} 
            className="btn btn-outline btn-sm"
            title="Toggle Light/Dark Theme"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            {theme === 'dark' ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#6366F1" />}
          </button>

          <button
            onClick={onOpenAddPatient}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.35rem', fontSize: '0.8rem' }}
          >
            <Plus size={16} />
            <span>Register Child</span>
          </button>
        </div>

      </div>
    </header>
  );
}
