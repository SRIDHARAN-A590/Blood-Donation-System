import React, { useState } from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onLoginClick,
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
        <span style={{ color: '#c1121f' }}>NeoBlood</span>
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

      <div className="nav-actions">
        {!currentUser ? (
          <button className="auth-google-btn" id="google-login-btn" onClick={onLoginClick}>
            <i className="fab fa-google"></i> Sign in / Register
          </button>
        ) : (
          <>
            {/* Notification Bell */}
            <div
              className="notif-bell"
              id="notif-btn"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              style={{ position: 'relative' }}
            >
              <i className="far fa-bell"></i>
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
            >
              <div className="avatar">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{currentUser.name || 'User'}</span>
            </div>

            {/* Logout button */}
            <button
              className="btn btn-danger"
              id="logout-btn"
              onClick={onLogoutClick}
              style={{ borderRadius: '20px', padding: '8px 16px', fontSizes: '0.8rem' }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
