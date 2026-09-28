import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { api } from '../services/api';

export default function AuthModal({ isOpen, initialMode = 'login', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync mode whenever initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setLoading(false);
    setGoogleLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Google Sign-In & Registration handler via Firebase + MongoDB Atlas Sync
  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    try {
      // 1. Authenticate with Google via Firebase Auth
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // 2. Sync verified Google identity into MongoDB Atlas 'users' collection
      const syncResult = await api.googleAuth({
        email: fbUser.email,
        name: fbUser.displayName || 'Google User',
        googleId: fbUser.uid,
        photoURL: fbUser.photoURL
      });

      const authenticatedUser = syncResult.user;
      onSuccess(authenticatedUser, `Welcome, ${authenticatedUser.name}! Signed in via Google.`);
      handleClose();
    } catch (err) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Please try again.');
      } else {
        setErrorMsg(err.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Email/Password Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();

    // REGISTER VALIDATION
    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!trimmedEmail) {
        setErrorMsg('Please enter a valid Gmail / Email address.');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
        setErrorMsg('Please enter a valid phone number with at least 10 digits.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }

      setLoading(true);
      try {
        // Create account in Firebase Auth (if available) for client sync
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName: name.trim() });
          }
        } catch (fbErr) {
          // If already in Firebase or Firebase error, continue to backend verification
          console.warn('Firebase register notice:', fbErr.message);
        }

        // Register and persist user into MongoDB Atlas 'users' collection
        const res = await api.register({
          name: name.trim(),
          email: trimmedEmail,
          phone: phone.trim(),
          password
        });

        onSuccess(res.user, `Account created successfully! Welcome, ${res.user.name}.`);
        handleClose();
      } catch (err) {
        setErrorMsg(err.message || 'Failed to create account. Please check details.');
      } finally {
        setLoading(false);
      }
    } else {
      // SIGN IN (LOGIN) VALIDATION: "only ask Email & password"
      if (!trimmedEmail || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }

      setLoading(true);
      try {
        // Optional Firebase Auth sign-in
        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, password);
        } catch (fbErr) {
          console.warn('Firebase login notice:', fbErr.message);
        }

        // Authenticate against MongoDB Atlas
        const res = await api.login({
          email: trimmedEmail,
          password
        });

        onSuccess(res.user, `Welcome back, ${res.user.name}!`);
        handleClose();
      } catch (err) {
        setErrorMsg(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="modal-overlay"
      style={{ display: 'flex', zIndex: 1200 }}
      onClick={handleClose}
    >
      <div
        className="glass-card modal-content"
        style={{
          maxWidth: '460px',
          width: '92%',
          position: 'relative',
          padding: '36px 32px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            fontSize: '1.3rem',
            cursor: 'pointer',
            color: '#94a3b8',
            transition: 'color 0.2s'
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px'
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '9px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              background: mode === 'login' ? 'white' : 'transparent',
              color: mode === 'login' ? '#c1121f' : '#64748b',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '9px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              background: mode === 'register' ? 'white' : 'transparent',
              color: mode === 'register' ? '#c1121f' : '#64748b',
              boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Register
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            {mode === 'login'
              ? 'Enter your email and password to access your account'
              : 'Join NeoBlood to access blood donation and community services'}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Continue Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading || loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'white',
            border: '1.5px solid #e2e8f0',
            borderRadius: '10px',
            color: '#1e293b',
            fontWeight: 600,
            fontSize: '0.92rem',
            cursor: (googleLoading || loading) ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          {googleLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            color: '#94a3b8',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}
        >
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ padding: '0 12px' }}>or with email</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit}>
          {/* Register Mode Only: Full Name */}
          {mode === 'register' && (
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '38px', height: '44px', borderRadius: '10px' }}
                  placeholder="e.g. Sridharan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Both Modes: Email Address */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {mode === 'register' ? 'Gmail / Email Address' : 'Email Address'}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '38px', height: '44px', borderRadius: '10px' }}
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Register Mode Only: Phone Number */}
          {mode === 'register' && (
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <input
                  type="tel"
                  className="form-control"
                  style={{ paddingLeft: '38px', height: '44px', borderRadius: '10px' }}
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Both Modes: Password */}
          <div className="form-group" style={{ marginBottom: mode === 'register' ? '14px' : '20px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '38px', height: '44px', borderRadius: '10px' }}
                placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Register Mode Only: Confirm Password */}
          {mode === 'register' && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '38px', height: '44px', borderRadius: '10px' }}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #c1121f, #780000)',
              border: 'none',
              cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        {/* Footer switch */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: '#64748b' }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c1121f',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c1121f',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
