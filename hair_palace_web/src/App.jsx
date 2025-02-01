import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Book from './components/Book';
import Barbers from './components/Barbers';
import Appointments from './components/Appointments';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />

      <section id="home">
        <Home />
      </section>

      <section id="barbers">
        <Barbers />
      </section>
      
      <section id="appointments">
        <Appointments />
      </section>
      
      

      <section id="book">
        <Book />
      </section>
      
      <section id="about">
        <AboutUs />
      </section>

      <Footer />
    </>
  );
}

export default App;
