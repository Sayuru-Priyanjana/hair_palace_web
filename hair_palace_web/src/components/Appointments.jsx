import React from 'react';
import '../styles/Appointments.css';

const Appointments = () => {
  const appointments = [
    { barber: "Harsha", name: "Jhone doe", time: "10:00 AM", status: "Ongoing" },
    { barber: "Barber 2", name: "Jane Smith", time: "11:00 AM", status: "Upcoming" },
  ];

  return (
    <section id="appointments" className="current-appointments">
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