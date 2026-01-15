import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { CarouselProvider } from './context/CarouselContext';
import Home from './pages/Home';
import About from './pages/About';
import Resume from './pages/Resume';
import CarBuild from './pages/CarBuild';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './styles/App.css';

function App() {
  return (
    <CarouselProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/carbuild" element={<CarBuild />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CarouselProvider>
  );
}

export default App;
