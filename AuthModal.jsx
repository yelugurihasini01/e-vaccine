import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Lock, 
  User, 
  Calendar, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  X,
  PhoneCall
} from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  // Modes: 'login-password' | 'login-otp' | 'register' | 'forgot-password'
  const [mode, setMode] = useState('login-password');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // OTP Timer & Dev helper
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState(null);

  // Form Fields
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');

  // Register Fields
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('1995-01-01');
  const [gender, setGender] = useState('Female');
  const [regPhone10, setRegPhone10] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regOtp, setRegOtp] = useState('');

  // Forgot Password Fields
  const [forgotLoginId, setForgotLoginId] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const startOtpTimer = () => {
    setOtpCountdown(60);
    const interval = setInterval(() => {
      setOtpCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 1. Send OTP for Registration
  const handleSendRegOtp = async () => {
    if (!regPhone10 || regPhone10.length !== 10 || !/^[6-9]\d{9}$/.test(regPhone10)) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 starting with 6-9).');
      return;
    }
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const fullPhone = `+91${regPhone10}`;
      const res = await api.sendOtp(fullPhone, 'registration');
      setOtpSent(true);
      startOtpTimer();
      setMessage(`Verification OTP sent to ${fullPhone}.`);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
        setRegOtp(res.devOtp); // Auto-fill in dev mode for testing convenience
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Send OTP for Mobile Login
  const handleSendLoginOtp = async () => {
    if (!loginPhone || loginPhone.length !== 10 || !/^[6-9]\d{9}$/.test(loginPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const fullPhone = `+91${loginPhone}`;
      const res = await api.sendOtp(fullPhone, 'login');
      setOtpSent(true);
      startOtpTimer();
      setMessage(`Login OTP sent to ${fullPhone}.`);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
        setLoginOtp(res.devOtp);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!regOtp) {
      setError('Please enter the OTP sent to your Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91${regPhone10}`;
      const res = await api.register({
        fullName,
        dob,
        gender,
        mobileNumber: fullPhone,
        email: regEmail,
        password: regPassword,
        confirmPassword: regConfirmPassword,
        otp: regOtp
      });

      localStorage.setItem('evaccine_token', res.token);
      localStorage.setItem('evaccine_user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit Password Login
  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.loginWithPassword(loginId, password);
      localStorage.setItem('evaccine_token', res.token);
      localStorage.setItem('evaccine_user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Submit Mobile OTP Login
  const handleOtpLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fullPhone = `+91${loginPhone}`;
      const res = await api.loginWithOtp(fullPhone, loginOtp);
      localStorage.setItem('evaccine_token', res.token);
      localStorage.setItem('evaccine_user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login for presentation
  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.loginWithPassword('+919876543210', 'Password@123');
      localStorage.setItem('evaccine_token', res.token);
      localStorage.setItem('evaccine_user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-content glass-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '520px', width: '92%', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--border-subtle)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0D9488, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {mode === 'register' && 'Parent Registration (India)'}
                {mode === 'login-password' && 'Welcome Back • Log In'}
                {mode === 'login-otp' && 'Fast Mobile Login (+91)'}
                {mode === 'forgot-password' && 'Reset Password'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Universal Immunization Programme • MoHFW India
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ borderRadius: '50%', padding: '0.35rem 0.5rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', marginBottom: '1.25rem', gap: '4px' }}>
          <button 
            type="button"
            className={`btn btn-sm ${mode === 'login-password' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, fontSize: '0.75rem', border: 'none' }}
            onClick={() => { setMode('login-password'); setError(null); setMessage(null); }}
          >
            Password
          </button>
          <button 
            type="button"
            className={`btn btn-sm ${mode === 'login-otp' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, fontSize: '0.75rem', border: 'none' }}
            onClick={() => { setMode('login-otp'); setError(null); setMessage(null); }}
          >
            📱 Mobile OTP
          </button>
          <button 
            type="button"
            className={`btn btn-sm ${mode === 'register' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, fontSize: '0.75rem', border: 'none' }}
            onClick={() => { setMode('register'); setError(null); setMessage(null); }}
          >
            Register
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.65rem 0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#f87171' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', padding: '0.65rem 0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#34d399' }}>
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {devOtpHint && (
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px dashed #3b82f6', borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#60a5fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🔑 <strong>Demo OTP Code:</strong> {devOtpHint} (auto-filled)</span>
          </div>
        )}

        {/* ----------------- 1. PASSWORD LOGIN FORM ----------------- */}
        {mode === 'login-password' && (
          <form onSubmit={handlePasswordLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Email or Indian Mobile Number (+91)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. parent@example.in or 9876543210"
                  style={{ paddingLeft: '2.4rem' }}
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button 
                  type="button" 
                  onClick={() => setMode('forgot-password')} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter your account password"
                  style={{ paddingLeft: '2.4rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In with Password'}
            </button>
          </form>
        )}

        {/* ----------------- 2. MOBILE OTP LOGIN FORM ----------------- */}
        {mode === 'login-otp' && (
          <form onSubmit={handleOtpLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Registered Indian Mobile Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', padding: '0 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#f59e0b' }}>
                  🇮🇳 +91
                </div>
                <input 
                  type="tel" 
                  maxLength={10}
                  className="form-control" 
                  placeholder="10-digit mobile number"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={handleSendLoginOtp}
                  disabled={loading || otpCountdown > 0}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {otpCountdown > 0 ? `${otpCountdown}s` : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Enter 6-Digit OTP Received on Mobile</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    maxLength={6}
                    className="form-control" 
                    placeholder="Enter 6-digit OTP"
                    style={{ paddingLeft: '2.4rem', letterSpacing: '3px', fontWeight: 'bold' }}
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }} disabled={loading || !otpSent}>
              {loading ? 'Verifying OTP...' : 'Verify & Log In'}
            </button>
          </form>
        )}

        {/* ----------------- 3. REGISTER FORM ----------------- */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Parent Full Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Ananya Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Indian Mobile Number with +91 fixed badge */}
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Indian Mobile Number (+91) *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.08)', padding: '0 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', color: '#f59e0b' }}>
                  🇮🇳 +91
                </div>
                <input 
                  type="tel" 
                  maxLength={10}
                  className="form-control" 
                  placeholder="10 digits (e.g. 9876500001)"
                  value={regPhone10}
                  onChange={(e) => setRegPhone10(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={handleSendRegOtp}
                  disabled={loading || otpCountdown > 0}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {otpCountdown > 0 ? `${otpCountdown}s` : 'Send OTP'}
                </button>
              </div>
            </div>

            {/* OTP Input */}
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Mobile OTP Code *</label>
              <input 
                type="text" 
                maxLength={6}
                className="form-control" 
                placeholder="Enter 6-digit code sent to mobile"
                value={regOtp}
                onChange={(e) => setRegOtp(e.target.value)}
                style={{ letterSpacing: '2px', fontWeight: 700 }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="e.g. ananya.patel@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Create Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Min 6 chars"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Confirm password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {/* ----------------- 4. FORGOT PASSWORD ----------------- */}
        {mode === 'forgot-password' && (
          <div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Enter Registered Mobile or Email</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. 9876543210 or email@domain.com"
                value={forgotLoginId}
                onChange={(e) => setForgotLoginId(e.target.value)}
              />
            </div>

            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await api.forgotPassword(forgotLoginId);
                  setMessage(res.message);
                  if (res.devOtp) setDevOtpHint(res.devOtp);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              Send Password Reset OTP
            </button>

            <button 
              type="button" 
              className="btn btn-outline btn-sm" 
              style={{ width: '100%' }}
              onClick={() => setMode('login-password')}
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Quick Demo Login Pill for Evaluation */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            College Viva / Quick Evaluation Demo:
          </p>
          <button 
            type="button" 
            onClick={handleQuickDemoLogin}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', background: 'rgba(13, 148, 136, 0.1)', borderColor: 'var(--primary-teal)', color: 'var(--primary-teal-light)', fontSize: '0.775rem' }}
          >
            ⚡ 1-Click Demo Login (Rajesh Sharma • +919876543210)
          </button>
        </div>

      </div>
    </div>
  );
}
