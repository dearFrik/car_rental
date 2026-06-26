import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Terms from './pages/Terms';   // ← добавь эту строку
import Contacts from './pages/Contacts';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/booking/:carId" element={<PrivateRoute><Booking /></PrivateRoute>} />
          <Route path="/admin/*" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;