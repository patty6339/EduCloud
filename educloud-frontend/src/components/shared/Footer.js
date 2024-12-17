import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: '#222', color: '#fff', padding: '10px 0', textAlign: 'center' }}>
      <p>© 2024 EduCloud. All Rights Reserved.</p>
      <div>
        <a href="/privacy-policy" style={{ color: '#fff', margin: '0 10px' }}>Privacy Policy</a>
        <a href="/terms-of-service" style={{ color: '#fff', margin: '0 10px' }}>Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
