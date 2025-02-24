import React, { useEffect, useRef } from 'react';
import '../styles/AboutUs.css';
import logo1 from '../assets/logo1.jpg';

const AboutUs = () => {
  // Ref for the about-us container
  const aboutUsRef = useRef(null);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add class when in view
          } else {
            entry.target.classList.remove('visible'); // Remove class when out of view
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    if (aboutUsRef.current) {
      observer.observe(aboutUsRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (aboutUsRef.current) observer.unobserve(aboutUsRef.current);
    };
  }, []);

  return (
    <section id="about" className="about-us" ref={aboutUsRef}>
      <div className="about-content">
        <img
          src={logo1} // Replace with your image URL
          alt="About Us"
          className="about-image"
        />
        <div className="about-text">
          <h2>About Us</h2>
          <p>
            Welcome to <strong>Hair Palace</strong>, where we provide the best grooming experience for gentlemen. Our skilled barbers are dedicated to giving you the perfect look.
          </p>
          {/* Additional content for desktop view */}
          <div className="desktop-content">
            <p>
              At <strong>Hair Palace</strong>, we believe that every gentleman deserves to look and feel his best. That's why we use only the finest products and techniques to ensure you leave our salon feeling confident and refreshed.
            </p>
            <p>
              Whether you're here for a classic haircut, a beard trim, or a relaxing shave, our team is here to make your experience unforgettable. Visit us today and discover the difference!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;