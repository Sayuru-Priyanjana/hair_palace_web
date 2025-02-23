import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <header>
      <div className="logo">Hair Palace</div>
      <div className="Nav">
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#book">Book</a></li>
          <li><a href="#barbers">Barbers</a></li>
          <li><a href="#appointments">Appointments</a></li>
          <li><a href="#about">About Us</a></li>
        </ul>
      </nav>
      </div>
    </header>
  );
};

export default Navbar;
