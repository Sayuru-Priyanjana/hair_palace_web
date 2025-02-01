import React from 'react';
import '../styles/Barbers.css';

const Barbers = () => {
  return (
    <section id="status" className="barber-status">
      <h2>Barber Status</h2>
      <div className="barber-card">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuX4uyt248q609zQoYNaati7dWu6pF2Tif_w&s" alt="Barber 1" />
        <div>
          <h3>Harsha</h3>
          <p>Status: <span className="status">Working</span></p>
          <p>Next Available Slot: 3:00 PM</p>
        </div>
      </div>
      <div className="barber-card">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTORpyntEdQdqbCk1U6x_EU-RWWp_fHoTW8A&s" alt="Barber 2" />
        <div>
          <h3>Barber 2</h3>
          <p>Status: <span className="status">Not Working</span></p>
          <p>Next Available Slot: Not Available</p>
        </div>
      </div>
    </section>
  );
};

export default Barbers;