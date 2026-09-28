import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1e293b', color: 'white', padding: '40px 20px', textAlign: 'center', marginTop: '60px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#c1121f', marginBottom: '10px' }}>NeoBlood</h3>
        <p style={{ color: '#cbd5e1' }}>Connecting lives, one drop at a time.</p>
      </div>
      <div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} NeoBlood. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
