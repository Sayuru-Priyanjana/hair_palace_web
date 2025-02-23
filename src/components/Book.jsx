import React, { useState, useEffect, useRef } from 'react';
import '../styles/Book.css';
import { database, ref, push, get, child } from '../firebase'; // Import Firebase functions

const Book = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [time, setTime] = useState('');
  const [state, setState] = useState('Pending');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [services, setServices] = useState([]); // State to store services from Firebase

  const bookingFormRef = useRef(null);

  // Fetch services from Firebase on component mount
  useEffect(() => {
    const fetchServices = async () => {
      const categoriesRef = ref(database, 'categories');
      try {
        const snapshot = await get(categoriesRef);
        if (snapshot.exists()) {
          const servicesData = snapshot.val();
          const servicesList = Object.keys(servicesData).map((key) => ({
            id: key,
            ...servicesData[key],
          }));
          setServices(servicesList); // Set services in state
        } else {
          console.log('No services available');
        }
      } catch (error) {
        console.error('Error fetching services: ', error);
      }
    };

    fetchServices();
  }, []);

  // Update price and duration when a service is selected
  useEffect(() => {
    if (service) {
      const selectedService = services.find((s) => s.name === service);
      if (selectedService) {
        setPrice(selectedService.price);
        setDuration(selectedService.time);
      }
    }
  }, [service, services]);

  // Intersection Observer for animations
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
      price,
      duration,
      timestamp: new Date().toISOString(), // Add a timestamp for reference
    };

    // Push data to Firebase Realtime Database
    const appointmentsRef = ref(database, 'appointments');
    push(appointmentsRef, appointmentData)
      .then(() => {
        alert('Admin will accept your appointment soon.');
        // Clear the form
        setName('');
        setPhone('');
        setService('');
        setTime('');
        setState('Pending');
        setPrice(0);
        setDuration(0);
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
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
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