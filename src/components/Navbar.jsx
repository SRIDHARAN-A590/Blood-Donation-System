import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, Bell, HeartHandshake, User } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onSignInClick,
  onRegisterClick,
  onBecomeDonorClick,
  onLogoutClick,
  notifications = []
}) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="navbar">
      <a
        href="#home"
        className="brand"
        onClick={(e) => {
          e.preventDefault();
          setActiveTab('home');
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1271/1271101.png"
          alt="Logo"
          style={{ width: '32px', height: '32px', filter: 'hue-rotate(330deg) saturate(200%)' }}
        />
        <span style={{ color: '#c1121f', fontWeight: 800 }}>NeoBlood</span>
      </a>

      <ul className="nav-links">
        <li>
          <a
            href="#home"
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
            }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#about"
            className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('about');
            }}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#dashboard"
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dashboard');
            }}
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="#create-request"
            className={`nav-item ${activeTab === 'create-request' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('create-request');
            }}
          >
            Request Blood
          </a>
        </li>
      </ul>

      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!currentUser ? (
          <>
            {/* Dedicated Sign In Button */}
            <button
              className="btn btn-outline"
              id="navbar-signin-btn"
              onClick={onSignInClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                background: 'white',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <LogIn size={16} /> Sign In
            </button>

            {/* Dedicated Register Button */}
            <button
              className="btn btn-primary"
              id="navbar-register-btn"
              onClick={onRegisterClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #c1121f, #780000)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(193, 18, 31, 0.25)'
              }}
            >
              <UserPlus size={16} /> Register
            </button>
          </>
        ) : (
          <>
            {/* Become a Donor CTA if user is not yet a donor */}
            {(!currentUser.donorProfile && currentUser.role !== 'donor') && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={onBecomeDonorClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  borderColor: '#c1121f',
                  color: '#c1121f',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  background: '#fff5f5',
                  cursor: 'pointer'
                }}
              >
                <HeartHandshake size={16} /> Become a Donor
              </button>
            )}

            {/* Notification Bell */}
            <div
              className="notif-bell"
              id="notif-btn"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <Bell size={20} color="#475569" />
              {unreadCount > 0 && (
                <div className="notif-badge" id="notif-badge">
                  {unreadCount}
                </div>
              )}
              {showNotifDropdown && (
                <div
                  id="notif-dropdown"
                  className="glass-card"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '40px',
                    width: '320px',
                    padding: '15px',
                    zIndex: 1000,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    cursor: 'default'
                  }}
                >
                  <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', color: '#1e293b' }}>
                    Notifications
                  </h4>
                  <div
                    id="notif-list"
                    style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    {notifications.length === 0 ? (
                      <div style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', padding: '10px' }}>
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div
                          key={notif.id || idx}
                          style={{
                            padding: '8px 10px',
                            background: notif.read ? '#f8fafc' : '#fef2f2',
                            borderRadius: '8px',
                            borderLeft: `3px solid ${notif.read ? '#cbd5e1' : '#c1121f'}`,
                            fontSize: '0.85rem'
                          }}
                        >
                          <strong style={{ color: '#1e293b' }}>{notif.title}</strong>
                          <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.8rem' }}>{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div
              className="user-profile-btn"
              id="user-profile-display"
              onClick={() => setActiveTab('dashboard')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <div
                className="avatar"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c1121f, #780000)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                  {currentUser.name || 'User'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.2 }}>
                  {currentUser.email ? (currentUser.email.length > 18 ? currentUser.email.substring(0, 16) + '...' : currentUser.email) : 'Logged In'}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              className="btn btn-outline"
              id="logout-btn"
              onClick={onLogoutClick}
              title="Logout"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                borderColor: '#e2e8f0',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
