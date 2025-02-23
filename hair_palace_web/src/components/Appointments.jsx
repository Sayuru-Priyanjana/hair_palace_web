import React, { useEffect, useRef, useState } from 'react';
import '../styles/Appointments.css';
import { database, ref, onValue } from '../firebase'; // Import Firebase functions

const Appointments = () => {
  const [appointments, setAppointments] = useState([]); // State to store appointments

  // Ref for the current-appointments container
  const appointmentsRef = useRef(null);

  // Fetch appointments from Firebase Realtime Database
  useEffect(() => {
    const appointmentsRef = ref(database, 'appointments'); // Reference to the 'appointments' node
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the data object into an array
        const appointmentsArray = Object.keys(data).map((key) => ({
          id: key, // Include the unique key from Firebase
          ...data[key],
        }));
        setAppointments(appointmentsArray); // Update state with fetched data
      } else {
        setAppointments([]); // If no data, set appointments to an empty array
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

    if (appointmentsRef.current) {
      observer.observe(appointmentsRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (appointmentsRef.current) observer.unobserve(appointmentsRef.current);
    };
  }, []);

  return (
    <section id="appointments" className="current-appointments" ref={appointmentsRef}>
      <h2>Current Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id}>
              <td>{app.name}</td>
              <td>{app.service}</td>
              <td>{app.time}</td>
              <td>{app.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Appointments;