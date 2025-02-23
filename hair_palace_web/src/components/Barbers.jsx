import React, { useEffect, useRef } from 'react';
import '../styles/Barbers.css';

const Barbers = () => {
  // Ref for the barber-status container
  const barberStatusRef = useRef(null);

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

    if (barberStatusRef.current) {
      observer.observe(barberStatusRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (barberStatusRef.current) observer.unobserve(barberStatusRef.current);
    };
  }, []);

  return (
    <section id="status" className="barber-status" ref={barberStatusRef}>
      <h2>Barber Status</h2>
      <div className="barber-card">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuX4uyt248q609zQoYNaati7dWu6pF2Tif_w&s" alt="Barber 1" />
        <div>
          <h3>Harsha</h3>
          <p>Status: <span className="status">Working</span></p>
          <p>Next Available Slot: 3:00 PM</p>
        </div>
      </div>
     
    </section>
  );
};

export default Barbers;