import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@hairpalace.com</p>
          <p>Phone: +94 763 421  567</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-media">
            <a href="https://www.facebook.com/share/1ByioovdQH/?mibextid=LQQJ4d" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.tiktok.com/@hairpalace5?_r=1&_d=egd04801bl1m4k&sec_uid=MS4wLjABAAAA3MxUx6vHhzbHd2L7fM3OBZFW9AC-pfyusJXFTtqd1ctCoQqik5mGj7aCnoKDJCFa&share_author_id=6975737609784067078&sharer_language=en&source=h5_m&u_code=dj755fh8729hj9&ug_btm=b8727,b0&sec_user_id=MS4wLjABAAAA3MxUx6vHhzbHd2L7fM3OBZFW9AC-pfyusJXFTtqd1ctCoQqik5mGj7aCnoKDJCFa&utm_source=more&social_share_type=5&utm_campaign=client_share&utm_medium=ios&tt_from=more&user_id=6975737609784067078&enable_checksum=1&share_link_id=7DBCC948-E92F-4B57-AE94-272B83A6E06B&share_app_id=1233" aria-label="Twitter"><i className="fab fa-tiktok"></i></a>
            <a href="https://www.instagram.com/_hair_palace_?igsh=OTE0YnV0ZG5obmIw&utm_source=qr" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Location</h3>
          <p>Hair palace, Shanthi mawatha, Padavi Parakramapura,</p>
          <p>Anuradhapura, Sri lanka</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Hair Palace. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;