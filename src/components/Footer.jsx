import React from 'react';
import { Droplet, Heart, ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="brand-icon-wrap" style={{ width: '36px', height: '36px' }}>
                <Droplet size={18} fill="white" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>
                Neo<span style={{ color: '#e63946' }}>Blood</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>
              Every two seconds, someone needs blood. NeoBlood bridges the critical gap between emergency blood requests and willing donors with live telemetry and direct communication.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.84rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Verified Medical Community & Emergency Protocol</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); setActivePage('landing'); }}>Home Overview</a></li>
              <li><a href="#donors" onClick={(e) => { e.preventDefault(); setActivePage('donors'); }}>Browse Donors</a></li>
              <li><a href="#requests" onClick={(e) => { e.preventDefault(); setActivePage('requests'); }}>Emergency Board</a></li>
              <li><a href="#bloodbanks" onClick={(e) => { e.preventDefault(); setActivePage('bloodbanks'); }}>Blood Bank Stocks</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActivePage('contact'); }}>Donation Drives</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="footer-col">
            <h4>Blood Groups</h4>
            <ul>
              <li><span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>O- (Universal Donor)</span></li>
              <li><span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>AB+ (Universal Recipient)</span></li>
              <li><span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>A+, A-, B+, B-</span></li>
              <li><span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>Platelet & Plasma Needs</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="footer-col">
            <h4>24/7 Lifeline Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#cbd5e1', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#e63946" />
                <span>Emergency: <strong>1-800-LIFE-NOW</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#e63946" />
                <span>support@neoblood-network.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="#e63946" />
                <span>National Health Grid Central, Suite 400</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NeoBlood Network. Built with React & Vite. Saving lives together.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ color: '#64748b' }}>Privacy Policy</span>
            <span style={{ color: '#64748b' }}>Terms of Service</span>
            <span style={{ color: '#64748b' }}>Medical Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
