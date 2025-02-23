import React, { useEffect, useRef } from 'react';
import '../styles/AboutUs.css';

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
      <h2>About Us</h2>
      <p>
        Welcome to Hair Palace, where we provide the best grooming experience for gentlemen. Our skilled barbers are dedicated to giving you the perfect look.
      </p>
    </section>
  );
};

export default AboutUs;