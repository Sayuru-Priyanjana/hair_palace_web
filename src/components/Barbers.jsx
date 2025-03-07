import React, { useEffect, useRef, useState } from 'react';
import '../styles/Barbers.css';
import { database, ref, onValue } from '../firebase'; // Import Firebase functions
import profile from '../assets/profile.jpg';

const Barbers = () => {
  const [isWorking, setIsWorking] = useState(false); // State to store barber's working status
  const [startTime, setStartTime] = useState('08:30'); // Default start time
  const [endTime, setEndTime] = useState('20:30'); // Default end time

  // Ref for the barber-status container
  const barberStatusRef = useRef(null);

  // Fetch barber's working status and times from Firebase
  useEffect(() => {
    const operationsRef = ref(database, 'operations'); // Reference to the 'operations' node
    onValue(operationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsWorking(data.is_working); // Update working status
        setStartTime(data.start_time || '08:30'); // Update start time
        setEndTime(data.end_time || '20:30'); // Update end time
      }
    });
  }, []);

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
        <img src={profile} alt="Harsha" />
        <div>
          <h3>Harsha</h3>
          <p>
            Status:{' '}
            <span className="status" style={{ color: isWorking ? 'green' : 'red' }}>
              {isWorking ? 'Working' : 'No more bookings for today'}
            </span>
          </p>
          {isWorking && (
            <p>
              Today Working Hours: {startTime} to {endTime}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Barbers;