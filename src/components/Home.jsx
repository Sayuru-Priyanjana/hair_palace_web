import React, { useEffect, useRef } from 'react';
import '../styles/Home.css';
import Slider from './Slider';
import AboutUs from './AboutUs';

const Home = () => {
  // Create refs for the elements to animate
  const h1Ref = useRef(null);
  const typewriterRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Function to handle Intersection Observer
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

    // Observe the elements
    if (h1Ref.current) observer.observe(h1Ref.current);
    if (typewriterRef.current) observer.observe(typewriterRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);

    // Cleanup observer on unmount
    return () => {
      if (h1Ref.current) observer.unobserve(h1Ref.current);
      if (typewriterRef.current) observer.unobserve(typewriterRef.current);
      if (buttonRef.current) observer.unobserve(buttonRef.current);
    };
  }, []);

  return (
    <section id="home">
      <div className="hero">
        <div className="landing">
          <h1 ref={h1Ref}>
            <span className="green-text">Hair Palace</span>{' '}
            <span ref={typewriterRef} className="typewriter">
              Your Perfect Gents' Grooming Experience!
            </span>
          </h1>

          <a href="#book">
            <button ref={buttonRef} className="book-button">
              Book Now
            </button>
          </a>
        </div>
      </div>
      <section id="about">
        <AboutUs />
      </section>
    </section>
  );
};

export default Home;