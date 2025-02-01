import React from 'react';
import '../styles/Home.css';

import Slider from './Slider';

const Home = () => {
  return (
    <section id="home">
    
    <div className="hero">
    <div className="landing">
    </div>
    <h1>Your Perfect Gents' Grooming Experience</h1>
    </div>
    <Slider />
  </section>
  );
};

export default Home;