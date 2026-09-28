import React, { useState } from 'react';

export default function DashboardTab({
  currentUser,
  donors,
  requests,
  onToggleAvailability,
  onBecomeDonor,
  onOpenCreateRequest,
  onLoginClick
}) {
  if (!currentUser) {
    return (
      <div id="view-dashboard" className="tab-view active" style={{ display: 'block', textAlign: 'center', padding: '60px 20px' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h2>Sign in Required</h2>
          <p style={{ color: '#64748b', marginTop: '10px', marginBottom: '24px' }}>
            Please log in or register to access your personalized blood donation dashboard and pledges.
          </p>
          <button className="btn btn-primary" onClick={onLoginClick}>
            <i className="fab fa-google"></i> Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const isDonor = currentUser.role === 'donor';
  const myPledges = requests.filter(r => r.acceptedDonorId === currentUser.uid);
  const myRequests = requests.filter(r => r.mobile === currentUser.phone || r.email === currentUser.email);

  return (
    <div id="view-dashboard" className="tab-view active" style={{ display: 'block' }}>
      {/* Profile & Status Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.5rem', background: '#c1121f' }}>
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{currentUser.name}</h2>
              <span className="blood-badge sm">{currentUser.bloodGroup || 'O+'}</span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              <i className="fas fa-map-marker-alt"></i> {[currentUser.city, currentUser.state].filter(Boolean).join(', ') || 'India'}
              {currentUser.phone ? ` • ${currentUser.phone}` : ''}
            </p>
          </div>
        </div>

        {isDonor ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Availability Status
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: currentUser.isAvailable ? '#10b981' : '#64748b' }}>
                {currentUser.isAvailable ? '🟢 Ready to Donate' : '🔴 Currently Unavailable'}
              </span>
            </div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
              <input
                type="checkbox"
                checked={!!currentUser.isAvailable}
                onChange={(e) => onToggleAvailability(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: currentUser.isAvailable ? '#10b981' : '#cbd5e1',
                  borderRadius: '34px',
                  transition: '0.3s'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    height: '20px',
                    width: '20px',
                    left: currentUser.isAvailable ? '26px' : '4px',
                    bottom: '4px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: '0.3s'
                  }}
                />
              </span>
            </label>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onBecomeDonor}>
            ❤️ Enroll as a Blood Donor
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div id="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#c1121f', fontWeight: 800 }}>{myPledges.length}</div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Donation Pledges</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#10b981', fontWeight: 800 }}>{myPledges.length * 3}</div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Lives Impacted</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#3b82f6', fontWeight: 800 }}>{myRequests.length}</div>
          <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>My Blood Requests</div>
        </div>
      </div>

      {/* My Requests & Donation History */}
      <div id="dashboard-history" style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>My Active Requests & Pledges</h3>
          <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={onOpenCreateRequest}>
            + New Request
          </button>
        </div>

        {myRequests.length === 0 && myPledges.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <p>You have not made any blood requests or pledges yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Browse the Home tab to see emergency requests nearby.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Patient / Details</th>
                  <th>Blood Group</th>
                  <th>Hospital</th>
                  <th>Urgency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map(r => (
                  <tr key={r.requestId}>
                    <td><span style={{ background: '#fef2f2', color: '#c1121f', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>My Request</span></td>
                    <td><strong>{r.patientName}</strong></td>
                    <td><span className="blood-badge sm">{r.bloodGroup}</span></td>
                    <td>{r.hospitalName}</td>
                    <td>{r.emergencyLevel}</td>
                    <td><span style={{ color: r.status === 'OPEN' ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{r.status}</span></td>
                  </tr>
                ))}
                {myPledges.map(r => (
                  <tr key={'pledge-' + r.requestId}>
                    <td><span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Donation Pledge</span></td>
                    <td><strong>{r.patientName}</strong></td>
                    <td><span className="blood-badge sm">{r.bloodGroup}</span></td>
                    <td>{r.hospitalName}</td>
                    <td>{r.emergencyLevel}</td>
                    <td><span style={{ color: '#10b981', fontWeight: 600 }}>Accepted by You</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
