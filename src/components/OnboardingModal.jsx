import React, { useState, useMemo } from 'react';
import { indiaStates } from '../data/indiaStates';

export default function OnboardingModal({ isOpen, onClose, onSave, currentUser }) {
  if (!isOpen) return null;

  const [name, setName] = useState(currentUser?.name || 'Sridharan');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || 'O+');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [state, setState] = useState(currentUser?.state || 'Tamil Nadu');
  const [district, setDistrict] = useState(currentUser?.city || 'Madurai');
  const [area, setArea] = useState(currentUser?.address || 'KK Nagar');
  const [isDonorOptIn, setIsDonorOptIn] = useState(true);

  const availableDistricts = useMemo(() => {
    if (!state || !indiaStates[state]) return [];
    return indiaStates[state];
  }, [state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      bloodGroup,
      phone,
      state,
      city: district,
      address: area,
      role: isDonorOptIn ? 'donor' : 'requester',
      isAvailable: isDonorOptIn
    });
  };

  return (
    <div id="onboarding-modal" className="modal-overlay" style={{ display: 'flex' }} onClick={onClose}>
      <div
        className="glass-card modal-content"
        style={{ maxWidth: '500px', width: '90%', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: '#94a3b8'
          }}
        >
          ✕
        </button>

        <h2 style={{ marginBottom: '10px' }}>Complete Your Profile</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          Welcome to NeoBlood! Please provide your details to join the network.
        </p>

        <form id="onboarding-form" onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">State</label>
              <select
                className="form-control"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  const dists = indiaStates[e.target.value] || [];
                  setDistrict(dists[0] || '');
                }}
                required
              >
                <option value="">Select State</option>
                {Object.keys(indiaStates).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">District / City</label>
              <select
                className="form-control"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              >
                <option value="">Select District</option>
                {availableDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Local Area</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Anna Nagar, KK Nagar"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="onboard-donor-optin"
              checked={isDonorOptIn}
              onChange={(e) => setIsDonorOptIn(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#c1121f' }}
            />
            <label htmlFor="onboard-donor-optin" style={{ fontWeight: 600, color: '#b91c1c', cursor: 'pointer' }}>
              Yes, add me to the Blood Donor list so I can save lives.
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
