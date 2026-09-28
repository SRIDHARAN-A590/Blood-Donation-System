import React, { useState, useMemo, useEffect } from 'react';
import { indiaStates } from '../data/indiaStates';
import { HeartHandshake, MapPin, Phone, User, Droplet } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, onSave, currentUser }) {
  if (!isOpen) return null;

  const [name, setName] = useState(currentUser?.name || '');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Madurai');
  const [area, setArea] = useState('KK Nagar');
  const [isDonorOptIn, setIsDonorOptIn] = useState(true);

  useEffect(() => {
    if (currentUser?.name) setName(currentUser.name);
  }, [currentUser]);

  const availableDistricts = useMemo(() => {
    if (!state || !indiaStates[state]) return [];
    return indiaStates[state];
  }, [state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      bloodGroup,
      phone: phone.trim(),
      age: age ? parseInt(age, 10) : null,
      gender,
      state,
      city: district,
      district,
      address: area.trim(),
      role: 'donor',
      availability: isDonorOptIn,
      isAvailable: isDonorOptIn,
      userId: currentUser?.id || currentUser?._id || currentUser?.uid || null
    });
  };

  return (
    <div id="donor-modal-overlay" className="modal-overlay" style={{ display: 'flex', zIndex: 1100 }} onClick={onClose}>
      <div
        className="glass-card modal-content"
        style={{ maxWidth: '540px', width: '92%', position: 'relative', borderRadius: '20px', padding: '36px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            fontSize: '1.3rem',
            cursor: 'pointer',
            color: '#94a3b8'
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c1121f, #780000)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <HeartHandshake size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>
              Become a Blood Donor
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '2px 0 0' }}>
              Join our active registry to receive emergency donation alerts.
            </p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '16px 0 20px' }} />

        <form id="onboarding-form" onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Donor Full Name
            </label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Sridharan"
            />
          </div>

          <div className="grid-2" style={{ marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Blood Group
              </label>
              <select
                className="form-control"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Contact Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Age
              </label>
              <input
                type="number"
                min="18"
                max="65"
                className="form-control"
                placeholder="18 - 65"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Gender
              </label>
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                State
              </label>
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
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                District / City
              </label>
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

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Local Area / Address
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. KK Nagar, Anna Nagar"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div
            style={{
              padding: '12px 14px',
              background: '#fef2f2',
              borderRadius: '10px',
              border: '1px solid #fee2e2',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <input
              type="checkbox"
              id="donor-optin-checkbox"
              checked={isDonorOptIn}
              onChange={(e) => setIsDonorOptIn(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#c1121f' }}
            />
            <label htmlFor="donor-optin-checkbox" style={{ fontWeight: 600, color: '#991b1b', fontSize: '0.88rem', cursor: 'pointer', margin: 0 }}>
              Mark me as Available for emergency blood donation
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #c1121f, #780000)'
            }}
          >
            Save Donor Profile in MongoDB
          </button>
        </form>
      </div>
    </div>
  );
}
