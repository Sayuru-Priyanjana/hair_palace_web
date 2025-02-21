import React, { useState, useEffect, useRef } from 'react';
import '../styles/Book.css';

const Book = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [barber, setBarber] = useState('');
  const [time, setTime] = useState('');

  // Ref for the booking-form container
  const bookingFormRef = useRef(null);

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

    if (bookingFormRef.current) {
      observer.observe(bookingFormRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (bookingFormRef.current) observer.unobserve(bookingFormRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appointment booked successfully!");
  };

  return (
    <section id="book" className="booking-form" ref={bookingFormRef}>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <select value={barber} onChange={(e) => setBarber(e.target.value)} required>
          <option value="">Select Barber</option>
          <option value="barber1">Barber 1</option>
          <option value="barber2">Barber 2</option>
        </select>
        <select value={time} onChange={(e) => setTime(e.target.value)} required>
          <option value="">Select Time</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="2:00 PM">2:00 PM</option>
          <option value="3:00 PM">3:00 PM</option>
        </select>
        <button type="submit">Book Now</button>
      </form>
    </section>
  );
};

export default Book;