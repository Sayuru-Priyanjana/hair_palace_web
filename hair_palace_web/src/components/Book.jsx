import React, { useState, useEffect, useRef } from 'react';
import '../styles/Book.css';
import { database, ref, push } from '../firebase'; // Import Firebase functions

const Book = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [time, setTime] = useState('');
  const [state, setState] = useState('Pending');

  const bookingFormRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (bookingFormRef.current) {
      observer.observe(bookingFormRef.current);
    }

    return () => {
      if (bookingFormRef.current) observer.unobserve(bookingFormRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object with the form data
    const appointmentData = {
      name,
      phone,
      service,
      time,
      state,
      timestamp: new Date().toISOString(), // Add a timestamp for reference
    };

    // Push data to Firebase Realtime Database
    const appointmentsRef = ref(database, 'appointments');
    push(appointmentsRef, appointmentData)
      .then(() => {
        alert('Admin will accept your appointment soon. When accept it your appointment shown in appointment table');
        // Clear the form
        setName('');
        setPhone('');
        setService('');
        setTime('');
        setState('Pending');
      })
      .catch((error) => {
        console.error('Error submitting appointment: ', error);
        alert('There was an error booking your appointment. Please try again.');
      });
  };

  return (
    <section id="book" className="booking-form" ref={bookingFormRef}>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <select value={service} onChange={(e) => setService(e.target.value)} required>
          <option value="">Select Service</option>
          <option value="HairCut">HairCut</option>
          <option value="Facial">Facial</option>
        </select>
        <select value={time} onChange={(e) => setTime(e.target.value)} required>
          <option value="">Select Time</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
        </select>
        <button type="submit">Book Now</button>
      </form>
    </section>
  );
};

export default Book;