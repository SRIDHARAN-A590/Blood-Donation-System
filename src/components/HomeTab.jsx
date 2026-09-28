import React, { useState, useMemo } from 'react';
import { indiaStates } from '../data/indiaStates';

export default function HomeTab({
  currentUser,
  donors,
  requests,
  loadingData,
  dbError,
  onRetryConnection,
  onAcceptRequest,
  onOpenCreateRequest,
  onLoginClick
}) {
  const [filterBlood, setFilterBlood] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterArea, setFilterArea] = useState('');

  // Available districts for the selected state
  const availableDistricts = useMemo(() => {
    if (!filterState || !indiaStates[filterState]) return [];
    return indiaStates[filterState];
  }, [filterState]);

  // Filtered Donors
  const filteredDonors = useMemo(() => {
    return donors.filter(d => {
      if (!d.isAvailable) return false;
      if (filterBlood && d.bloodGroup !== filterBlood) return false;
      if (filterState && (!d.state || d.state.toLowerCase() !== filterState.toLowerCase())) return false;
      if (filterDistrict && (!d.city || d.city.toLowerCase() !== filterDistrict.toLowerCase())) return false;
      if (filterArea && (!d.address || !d.address.toLowerCase().includes(filterArea.toLowerCase()))) return false;
      return true;
    });
  }, [donors, filterBlood, filterState, filterDistrict, filterArea]);

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (r.status !== 'OPEN') return false;
      if (filterBlood && r.bloodGroup !== filterBlood) return false;
      if (filterState && (!r.state || r.state.toLowerCase() !== filterState.toLowerCase())) return false;
      if (filterDistrict && (!r.city || r.city.toLowerCase() !== filterDistrict.toLowerCase())) return false;
      if (filterArea && (!r.address || !r.address.toLowerCase().includes(filterArea.toLowerCase()))) return false;
      return true;
    });
  }, [requests, filterBlood, filterState, filterDistrict, filterArea]);

  return (
    <div id="view-home" className="tab-view active" style={{ display: 'block' }}>
      {/* DB Connection Error Banner if server unreachable */}
      {dbError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #ef4444',
            borderRadius: '10px',
            padding: '14px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#b91c1c'
          }}
        >
          <div>
            <strong>⚠️ Database Connection Warning:</strong> Could not connect to MongoDB API. Please ensure the backend server is running.
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            onClick={onRetryConnection}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section-clean">
        <h1 className="hero-title">
          No life lost for<br />the want of <span>blood.</span>
        </h1>
        <p className="hero-subtitle">
          Connecting blood donors and recipients through a <strong>community-driven web platform.</strong>
        </p>

        <div className="app-store-buttons" id="home-cta-container">
          {!currentUser ? (
            <button
              className="btn btn-primary"
              style={{
                borderRadius: '30px',
                padding: '14px 32px',
                fontSize: '1.1rem',
                boxShadow: '0 10px 20px rgba(230,57,70,0.3)'
              }}
              onClick={onLoginClick}
            >
              Login / Register to Continue <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{
                borderRadius: '30px',
                padding: '14px 32px',
                fontSize: '1.1rem',
                boxShadow: '0 10px 20px rgba(230,57,70,0.3)'
              }}
              onClick={onOpenCreateRequest}
            >
              Request Blood Immediately <i className="fas fa-plus"></i>
            </button>
          )}
        </div>
      </div>

      {/* Feature Section: Blood Inventory */}
      <div style={{ marginTop: '60px' }}>
        <span
          style={{
            color: '#c1121f',
            border: '1px solid #c1121f',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          BLOOD INVENTORY
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: '#1e293b' }}>
              Real-Time Blood <span style={{ color: '#c1121f' }}>Inventory</span>
            </h2>
            <p style={{ color: '#64748b', maxWidth: '600px', marginTop: '12px' }}>
              Instantly check blood stock at hospitals near you. During emergencies, every second counts — know exactly where life-saving units are available.
            </p>
          </div>
          <a
            href="https://eraktkosh.mohfw.gov.in/eraktkoshPortal/#/publicPages/bloodAvailabilitySearch"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ borderRadius: '20px', textDecoration: 'none' }}
          >
            Check Availability
          </a>
        </div>
      </div>

      {/* Modern Find Blood Donors Filter */}
      <div className="glass-card" style={{ marginTop: '40px', padding: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#1e293b' }}>
          Find Blood Donors & Active Requests
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Blood Group</label>
            <select
              id="filter-blood"
              className="form-control"
              style={{ padding: '10px' }}
              value={filterBlood}
              onChange={(e) => setFilterBlood(e.target.value)}
            >
              <option value="">Any</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Country</label>
            <select id="filter-country" className="form-control" style={{ padding: '10px' }} defaultValue="India">
              <option value="India">India</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>State</label>
            <select
              id="filter-state"
              className="form-control"
              style={{ padding: '10px' }}
              value={filterState}
              onChange={(e) => {
                setFilterState(e.target.value);
                setFilterDistrict('');
              }}
            >
              <option value="">All States</option>
              {Object.keys(indiaStates).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>District</label>
            <select
              id="filter-district"
              className="form-control"
              style={{ padding: '10px' }}
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              disabled={!filterState}
            >
              <option value="">All Districts</option>
              {availableDistricts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Specific Area</label>
            <input
              type="text"
              id="filter-area"
              className="form-control"
              style={{ padding: '10px' }}
              placeholder="Search area..."
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="filter-bar" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Search Results / Active Requests</h2>
        <button className="btn btn-primary" onClick={onOpenCreateRequest}>
          Create Blood Request <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Requests & Donors Grid */}
      <div className="grid-3" id="requests-grid" style={{ marginTop: '20px' }}>
        {/* Loading Skeletons */}
        {loadingData && donors.length === 0 && requests.length === 0 && (
          [1, 2, 3].map(n => (
            <div key={'skeleton-' + n} className="glass-card card-item" style={{ padding: '24px', opacity: 0.6 }}>
              <div style={{ height: '20px', width: '50%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '12px' }} />
              <div style={{ height: '28px', width: '75%', background: '#cbd5e1', borderRadius: '4px', marginBottom: '16px' }} />
              <div style={{ height: '14px', width: '60%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }} />
              <div style={{ height: '14px', width: '40%', background: '#e2e8f0', borderRadius: '4px' }} />
            </div>
          ))
        )}

        {/* Render Donor Cards */}
        {filteredDonors.map(donor => {
          const isMe = currentUser && (donor.uid === currentUser.uid || donor._id === currentUser._id);
          return (
            <div key={donor._id || donor.uid} className="glass-card card-item" style={{ borderLeft: '4px solid #10b981', position: 'relative' }}>
              {isMe && (
                <div style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '0.7rem', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>
                  You
                </div>
              )}
              <div className="card-header">
                <div>
                  <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', marginBottom: '8px', display: 'inline-block' }}>
                    🟢 Available Donor
                  </div>
                  <h3 className="card-title" style={{ margin: 0 }}>{donor.name}</h3>
                </div>
                <div className="blood-badge sm">{donor.bloodGroup}</div>
              </div>
              <div className="card-meta" style={{ marginTop: '10px' }}>
                <div className="meta-row">
                  <i className="fas fa-map-marker-alt"></i> {[donor.city, donor.state].filter(Boolean).join(', ')}{donor.address && donor.address !== donor.city ? ' • ' + donor.address : ''}
                </div>
                {donor.phone && (
                  <div className="meta-row">
                    <i className="fas fa-phone"></i> {donor.phone}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Render Request Cards */}
        {filteredRequests.map(req => {
          const isCritical = req.emergencyLevel === 'CRITICAL';
          const isUrgent = req.emergencyLevel === 'URGENT';
          const borderColor = isCritical ? '#ef4444' : isUrgent ? '#f59e0b' : '#c1121f';
          const canAccept = currentUser && currentUser.role === 'donor' && !req.acceptedDonorId;

          return (
            <div key={req._id || req.requestId} className="glass-card card-item" style={{ borderLeft: `4px solid ${borderColor}` }}>
              <div className="card-header">
                <div>
                  <div
                    style={{
                      background: isCritical ? 'rgba(239,68,68,0.1)' : 'rgba(193,18,31,0.1)',
                      color: borderColor,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 10px',
                      borderRadius: '20px',
                      marginBottom: '8px',
                      display: 'inline-block'
                    }}
                  >
                    {isCritical ? '🚨 Critical Emergency' : isUrgent ? '⚡ Urgent' : '🩸 Need Blood'}
                  </div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    {req.bloodGroup} — {req.patientName || 'Patient'}
                  </h3>
                </div>
                <div className="blood-badge sm">{req.bloodGroup}</div>
              </div>

              <div className="card-meta" style={{ marginTop: '10px' }}>
                <div className="meta-row"><i className="fas fa-hospital"></i> {req.hospitalName}</div>
                <div className="meta-row"><i className="fas fa-map-marker-alt"></i> {[req.city, req.state].filter(Boolean).join(', ')}{req.address && req.address !== req.city ? ' • ' + req.address : ''}</div>
                <div className="meta-row"><i className="fas fa-tint"></i> {req.unitsRequired} unit(s) needed</div>
                <div className="meta-row"><i className="far fa-clock"></i> {new Date(req.createdAt).toLocaleString()}</div>
                {req.purpose && <div className="meta-row"><i className="fas fa-notes-medical"></i> {req.purpose}</div>}
              </div>

              {req.acceptedDonorId && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                  ✅ Donor {req.acceptedDonorName} has pledged for this request
                </div>
              )}

              {canAccept && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    className="btn btn-success"
                    style={{ flex: 1 }}
                    onClick={() => onAcceptRequest(req._id || req.requestId)}
                  >
                    ✅ Accept & Donate
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {!loadingData && filteredDonors.length === 0 && filteredRequests.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>No donors or active requests found matching your search.</p>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '8px' }}>Try a different blood group, state, or district.</p>
          </div>
        )}
      </div>
    </div>
  );
}
