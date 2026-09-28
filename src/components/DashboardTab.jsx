import React from 'react';
import { User, Mail, Shield, HeartHandshake, MapPin, Phone, Droplet, CheckCircle, Clock } from 'lucide-react';

export default function DashboardTab({
  currentUser,
  donors,
  requests,
  onToggleAvailability,
  onBecomeDonor,
  onOpenCreateRequest,
  onSignInClick,
  onRegisterClick
}) {
  if (!currentUser) {
    return (
      <div id="view-dashboard" className="tab-view active" style={{ display: 'block', textAlign: 'center', padding: '60px 20px' }}>
        <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 30px', borderRadius: '20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>Sign In Required</h2>
          <p style={{ color: '#64748b', marginTop: '10px', marginBottom: '24px', lineHeight: 1.5 }}>
            Please sign in with your email and password or Google account to access your personal dashboard.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={onSignInClick} style={{ padding: '10px 20px' }}>
              Sign In
            </button>
            <button className="btn btn-primary" onClick={onRegisterClick} style={{ padding: '10px 22px' }}>
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if current user has an active donor profile
  const donorProfile = currentUser.donorProfile || donors.find(d =>
    (d.userId && (d.userId === currentUser.id || d.userId === currentUser._id || d.userId === currentUser.uid)) ||
    (d.email && d.email.toLowerCase() === currentUser.email?.toLowerCase())
  );

  const isDonor = !!donorProfile;
  const isAvailable = donorProfile ? (donorProfile.availability ?? donorProfile.isAvailable ?? true) : false;

  const myPledges = requests.filter(r =>
    r.acceptedDonorId === currentUser.id ||
    r.acceptedDonorId === currentUser.uid ||
    (donorProfile && r.acceptedDonorId === (donorProfile._id || donorProfile.uid))
  );

  const myRequests = requests.filter(r =>
    r.email === currentUser.email ||
    (donorProfile && r.mobile === donorProfile.phone)
  );

  return (
    <div id="view-dashboard" className="tab-view active" style={{ display: 'block', maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>

      {/* Grid: User Identity Card vs Donor Profile Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>

        {/* Card 1: User Account Profile */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800
              }}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                {currentUser.name}
              </h3>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  marginTop: '4px'
                }}
              >
                Role: {currentUser.role || 'user'}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
              <Mail size={16} color="#64748b" />
              <span><strong>Email:</strong> {currentUser.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
              <Shield size={16} color="#64748b" />
              <span><strong>Auth Provider:</strong> {currentUser.authProviders?.join(', ') || 'Email/Password'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
              <CheckCircle size={16} color="#10b981" />
              <span><strong>Database:</strong> MongoDB Atlas (users collection)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Blood Donor Profile (or Become a Donor CTA) */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: isDonor ? 'white' : '#fffaf0',
            border: isDonor ? '1px solid #e2e8f0' : '1.5px dashed #fbd38d'
          }}
        >
          {isDonor ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#c1121f' }}>
                    Verified Donor Profile
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                      {donorProfile.name || currentUser.name}
                    </h3>
                    <span className="blood-badge sm" style={{ background: '#c1121f', color: 'white', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                      {donorProfile.bloodGroup || 'O+'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                    Availability Status
                  </span>
                  <button
                    onClick={() => onToggleAvailability(!isAvailable)}
                    className="btn btn-sm"
                    style={{
                      borderRadius: '20px',
                      padding: '6px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: isAvailable ? '#ecfdf5' : '#f8fafc',
                      color: isAvailable ? '#059669' : '#64748b',
                      border: `1.5px solid ${isAvailable ? '#a7f3d0' : '#cbd5e1'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {isAvailable ? '🟢 Available' : '⚪ Unavailable'}
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="#c1121f" />
                  <span>{[donorProfile.address, donorProfile.city, donorProfile.state].filter(Boolean).join(', ')}</span>
                </div>
                {donorProfile.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={15} color="#c1121f" />
                    <span>{donorProfile.phone}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={15} color="#64748b" />
                  <span>Stored in MongoDB Atlas (<strong>bloodDonors</strong> collection)</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#feebc8',
                  color: '#c05621',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}
              >
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#7b341e' }}>
                Join the Donor Registry
              </h3>
              <p style={{ color: '#744210', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.4 }}>
                You have a user account, but you haven't created a blood donor profile yet. Register to start saving lives!
              </p>
              <button
                className="btn btn-primary"
                onClick={onBecomeDonor}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #c1121f, #780000)',
                  border: 'none',
                  fontWeight: 700
                }}
              >
                Become a Blood Donor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
          My Emergency Activity
        </h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenCreateRequest}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px' }}
        >
          + Request Blood Immediately
        </button>
      </div>

      {/* Grid: My Pledges & My Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Pledges */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '14px', background: 'white' }}>
          <h4 style={{ margin: '0 0 14px 0', color: '#1e293b', fontSize: '1.05rem', fontWeight: 700 }}>
            My Active Pledges ({myPledges.length})
          </h4>
          {myPledges.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
              You haven't pledged for any emergency requests yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myPledges.map((req, i) => (
                <div key={req._id || i} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.88rem' }}>
                    <span>{req.patientName}</span>
                    <span style={{ color: '#c1121f' }}>{req.bloodGroup}</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '3px' }}>
                    {req.hospitalName}, {req.city}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requests */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '14px', background: 'white' }}>
          <h4 style={{ margin: '0 0 14px 0', color: '#1e293b', fontSize: '1.05rem', fontWeight: 700 }}>
            My Blood Requests ({myRequests.length})
          </h4>
          {myRequests.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
              You haven't posted any emergency requests.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myRequests.map((req, i) => (
                <div key={req._id || i} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #c1121f' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.88rem' }}>
                    <span>{req.patientName}</span>
                    <span className="blood-badge sm">{req.bloodGroup} ({req.unitsRequired} units)</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '3px' }}>
                    Status: <strong style={{ color: req.status === 'PLEDGED' ? '#059669' : '#dc2626' }}>{req.status}</strong>
                    {req.acceptedDonorName && ` (Pledged by ${req.acceptedDonorName})`}
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
