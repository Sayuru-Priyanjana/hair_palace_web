import React, { useEffect, useRef } from 'react';
import '../styles/Appointments.css';

const Appointments = () => {
  const appointments = [
    { barber: "Harsha", name: "Jhone doe", time: "10:00 AM", status: "Ongoing" },
    { barber: "Barber 2", name: "Jane Smith", time: "11:00 AM", status: "Upcoming" },
  ];

  // Ref for the current-appointments container
  const appointmentsRef = useRef(null);

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
            <th>Barber</th>
            <th>Customer</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app, index) => (
            <tr key={index}>
              <td>{app.barber}</td>
              <td>{app.name}</td>
              <td>{app.time}</td>
              <td>{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Appointments;