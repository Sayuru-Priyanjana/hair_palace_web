import React, { useState, useEffect, useRef } from 'react';
import '../styles/Book.css';
import { database, ref, push, get } from '../firebase';

const Book = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [time, setTime] = useState(''); // Time as a string (HH:mm)
  const [state, setState] = useState('Pending');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [workingHours, setWorkingHours] = useState({ start: '08:30', end: '18:00' });
  const [error, setError] = useState('');

  const bookingFormRef = useRef(null);

  // Fetch services, working hours, and appointments on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch services
      const categoriesRef = ref(database, 'categories');
      const categoriesSnapshot = await get(categoriesRef);
      if (categoriesSnapshot.exists()) {
        const servicesData = categoriesSnapshot.val();
        const servicesList = Object.keys(servicesData).map((key) => ({
          id: key,
          ...servicesData[key],
        }));
        setServices(servicesList);
      }

      // Fetch working hours
      const operationsRef = ref(database, 'operations');
      const operationsSnapshot = await get(operationsRef);
      if (operationsSnapshot.exists()) {
        const operationsData = operationsSnapshot.val();
        setWorkingHours({
          start: operationsData.start_time || '08:30',
          end: operationsData.end_time || '18:00',
        });
      }

      // Fetch appointments
      const appointmentsRef = ref(database, 'appointments');
      const appointmentsSnapshot = await get(appointmentsRef);
      if (appointmentsSnapshot.exists()) {
        const appointmentsData = appointmentsSnapshot.val();
        const appointmentsList = Object.keys(appointmentsData).map((key) => ({
          id: key,
          ...appointmentsData[key],
        }));
        setAppointments(appointmentsList);
      }
    };

    fetchData();
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

  // Validate the selected time
  const validateTime = (selectedTime) => {
    if (!selectedTime || !service) return false;

    const selectedTimeMs = new Date(`1970-01-01T${selectedTime}:00`).getTime();
    const selectedEndTimeMs = selectedTimeMs + duration * 60000;

    // Check if the selected time is within working hours
    const workingStartMs = new Date(`1970-01-01T${workingHours.start}:00`).getTime();
    const workingEndMs = new Date(`1970-01-01T${workingHours.end}:00`).getTime();
    if (selectedTimeMs < workingStartMs || selectedEndTimeMs > workingEndMs) {
      setError('Selected time is outside working hours.');
      return false;
    }

    // Check for overlapping appointments
    const isInvalid = appointments.some((appointment) => {
      const appointmentStartMs = new Date(`1970-01-01T${appointment.time}:00`).getTime();
      const appointmentEndMs = appointmentStartMs + appointment.duration * 60000;

      // Check if the selected time overlaps with an existing appointment
      const overlapStart = Math.max(selectedTimeMs, appointmentStartMs);
      const overlapEnd = Math.min(selectedEndTimeMs, appointmentEndMs);
      const overlapDuration = overlapEnd - overlapStart;

      // If overlap duration is more than 15 minutes, block the appointment
      if (overlapDuration > 15 * 60000) {
        return true; // Invalid appointment
      }

      return false; // Valid appointment (overlap is <= 15 minutes)
    });

    if (isInvalid) {
      setError('Selected time overlaps with an existing appointment by more than 15 minutes.');
      return false;
    }

    setError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the selected time
    if (!validateTime(time)) {
      return;
    }

    // Create an object with the form data
    const appointmentData = {
      name,
      phone,
      service,
      time,
      state,
      price,
      duration,
      timestamp: new Date().toISOString(),
    };

    // Push data to Firebase Realtime Database
    const appointmentsRef = ref(database, 'appointments');
    push(appointmentsRef, appointmentData)
      .then(() => {
        alert('Appointment booked successfully!');
        // Clear the form
        setName('');
        setPhone('');
        setService('');
        setTime('');
        setState('Pending');
        setPrice(0);
        setDuration(0);
        setError('');
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
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        >
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name} (${s.price}, {s.time} mins)
            </option>
          ))}
        </select>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          min={workingHours.start}
          max={workingHours.end}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Book Now</button>
      </form>
    </section>
  );
};

export default Book;