import React, { useState, useEffect, useRef } from 'react';
import '../styles/Book.css';
import { database, ref, push, get } from '../firebase';

const Book = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [state, setState] = useState('Pending');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [workingHours, setWorkingHours] = useState({ start: '08:30', end: '18:00' });
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState('');

  const bookingFormRef = useRef(null);

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
          price: Number(servicesData[key].price),
          time: Number(servicesData[key].time),
        }));
        setServices(servicesList);
      }

      // Fetch working hours
      const operationsRef = ref(database, 'operations');
      const operationsSnapshot = await get(operationsRef);
      if (operationsSnapshot.exists()) {
        const operationsData = operationsSnapshot.val();
        setWorkingHours({
          start: operationsData.start_time,
          end: operationsData.end_time,
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
          duration: Number(appointmentsData[key].duration),
          price: Number(appointmentsData[key].price),
        }));
        setAppointments(appointmentsList);
      }

      // Fetch holidays
      const holidaysRef = ref(database, 'holidays');
      const holidaysSnapshot = await get(holidaysRef);
      if (holidaysSnapshot.exists()) {
        const holidaysData = holidaysSnapshot.val();
        setHolidays(Object.keys(holidaysData));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (service) {
      const selectedService = services.find((s) => s.name === service);
      if (selectedService) {
        setPrice(selectedService.price);
        setDuration(selectedService.time);
      }
    }
  }, [service, services]);

  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const isHoliday = holidays.includes(dateString);
      
      options.push({
        value: dateString,
        label: `${i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : 'Day after tomorrow'} (${dateString})`,
        disabled: isHoliday
      });
    }
    
    return options;
  };

  const validateTime = (selectedTime) => {
    if (!selectedTime || !service || !selectedDate) return false;
    if (holidays.includes(selectedDate)) {
      setError('Selected date is a holiday. Please choose another date.');
      return false;
    }

    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const selectedStart = timeToMinutes(selectedTime);
    const selectedEnd = selectedStart + duration;
    
    // Check working hours
    const workStart = timeToMinutes(workingHours.start);
    const workEnd = timeToMinutes(workingHours.end);
    
    if (selectedStart < workStart || selectedEnd > workEnd) {
      setError('Selected time is outside working hours.');
      return false;
    }

    // Check overlaps with same-day appointments
    const sameDayAppointments = appointments.filter(app => 
      app.date === selectedDate && app.time
    );

    for (const appointment of sameDayAppointments) {
      const appStart = timeToMinutes(appointment.time);
      const appEnd = appStart + appointment.duration;

      // Calculate overlap
      const overlapStart = Math.max(selectedStart, appStart);
      const overlapEnd = Math.min(selectedEnd, appEnd);
      
      if (overlapEnd - overlapStart > 15) {
        setError('Time slot overlaps with existing appointment by more than 15 minutes');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTime(time)) return;

    const appointmentData = {
      name,
      phone,
      service,
      time,
      date: selectedDate,
      state,
      price,
      duration,
      timestamp: new Date().toISOString(),
    };

    const appointmentsRef = ref(database, 'appointments');
    push(appointmentsRef, appointmentData)
      .then((newRef) => {
        setAppointments(prev => [...prev, { id: newRef.key, ...appointmentData }]);
        alert('Appointment booked successfully!');
        setName('');
        setPhone('');
        setService('');
        setTime('');
        setSelectedDate('');
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
              {s.name} (Rs:{s.price}, {s.time} mins)
            </option>
          ))}
        </select>

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        >
          <option value="">Select Date</option>
          {generateDateOptions().map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label} {option.disabled ? '(Not Working)' : ''}
            </option>
          ))}
        </select>

        <div className="time-input-container">
          <label>Select Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            min={workingHours.start}
            max={workingHours.end}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit">Book Now</button>
      </form>
    </section>
  );
};

export default Book;