import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <p>Contact: info@hairpalace.com </p>
      <p> Phone: +123 456 7890</p>
      <div className="social-media">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
      </div>
      <p>&copy; 2025 Hair Palace. All rights reserved.</p>
    </footer>
  );
};

export default Footer;