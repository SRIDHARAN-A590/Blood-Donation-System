import React, { useState } from 'react';
import { Droplet, Users, AlertCircle, Building2, Calendar, Phone, LogIn, UserPlus, LogOut, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activePage, setActivePage }) => {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadMessagesCount = currentUser?.messages?.filter((m) => !m.read)?.length || 0;

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => handleNavClick('landing')}>
          <div className="brand-icon-wrap" style={{ overflow: 'hidden', padding: 0 }}>
            <img src="/logo.jpg" alt="LifeFlow Logo" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '10px' }} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Life<span>Flow</span></span>
            <span className="brand-subtitle">Blood Network</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          <li>
            <button
              className={`nav-item-btn ${activePage === 'landing' ? 'active' : ''}`}
              onClick={() => handleNavClick('landing')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activePage === 'donors' ? 'active' : ''}`}
              onClick={() => handleNavClick('donors')}
            >
              <Users size={16} /> Donors
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activePage === 'requests' ? 'active' : ''}`}
              onClick={() => handleNavClick('requests')}
            >
              <AlertCircle size={16} /> Emergency Requests
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activePage === 'bloodbanks' ? 'active' : ''}`}
              onClick={() => handleNavClick('bloodbanks')}
            >
              <Building2 size={16} /> Blood Banks
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activePage === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavClick('contact')}
            >
              <Phone size={16} /> Contact & Camps
            </button>
          </li>
        </ul>

        {/* Action Controls */}
        <div className="nav-actions">
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className={`btn ${activePage === 'dashboard' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => handleNavClick('dashboard')}
                style={{ position: 'relative' }}
              >
                <span>Dashboard</span>
                <span className="bg-badge bg-badge-red" style={{ fontSize: '0.75rem', padding: '2px 6px', marginLeft: '4px' }}>
                  {currentUser?.bloodGroup}
                </span>
                {unreadMessagesCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '0.7rem',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={logout} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => handleNavClick('login')}>
                <LogIn size={15} /> Sign In
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => handleNavClick('register')}>
                <UserPlus size={15} /> Join as Donor
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav open">
          <ul className="mobile-nav-list">
            <li>
              <button className={`nav-item-btn ${activePage === 'landing' ? 'active' : ''}`} onClick={() => handleNavClick('landing')}>
                Home
              </button>
            </li>
            <li>
              <button className={`nav-item-btn ${activePage === 'donors' ? 'active' : ''}`} onClick={() => handleNavClick('donors')}>
                <Users size={16} /> Find Donors
              </button>
            </li>
            <li>
              <button className={`nav-item-btn ${activePage === 'requests' ? 'active' : ''}`} onClick={() => handleNavClick('requests')}>
                <AlertCircle size={16} /> Emergency Requests
              </button>
            </li>
            <li>
              <button className={`nav-item-btn ${activePage === 'bloodbanks' ? 'active' : ''}`} onClick={() => handleNavClick('bloodbanks')}>
                <Building2 size={16} /> Nearby Blood Banks
              </button>
            </li>
            <li>
              <button className={`nav-item-btn ${activePage === 'contact' ? 'active' : ''}`} onClick={() => handleNavClick('contact')}>
                <Phone size={16} /> Contact & Drives
              </button>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <button className={`nav-item-btn ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavClick('dashboard')}>
                    My Dashboard ({currentUser?.name})
                  </button>
                </li>
                <li>
                  <button className="nav-item-btn" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleNavClick('login')} style={{ flex: 1 }}>
                  Sign In
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => handleNavClick('register')} style={{ flex: 1 }}>
                  Register
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};
