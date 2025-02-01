import React, { useState } from 'react';
import '../styles/Book.css';

const Book = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [barber, setBarber] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appointment booked successfully!");
  };

  return (
    <section id="book" className="booking-form">
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