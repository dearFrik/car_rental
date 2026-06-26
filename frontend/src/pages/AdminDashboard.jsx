import { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import api from '../api';
import AdminCars from '../components/admin/AdminCars';
import AdminBookings from '../components/admin/AdminBookings';
import AdminReviews from '../components/admin/AdminReviews';
import AdminUsers from '../components/admin/AdminUsers';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    api.get('/admin/users/', { headers: { Authorization: `Token ${token}` } })
      .then(() => {
        setLoading(false);
        Promise.all([
          api.get('/admin/cars/', { headers: { Authorization: `Token ${token}` } }),
          api.get('/admin/bookings/', { headers: { Authorization: `Token ${token}` } }),
          api.get('/admin/reviews/', { headers: { Authorization: `Token ${token}` } }),
          api.get('/admin/users/', { headers: { Authorization: `Token ${token}` } }),
        ])
        .then(([cars, bookings, reviews, users]) => {
          setStats({
            cars: cars.data.length,
            bookings: bookings.data.length,
            reviews: reviews.data.length,
            users: users.data.length,
          });
        })
        .catch(err => console.error(err));
      })
      .catch(err => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error(err);
        }
      });
  }, [navigate]);

  if (loading) return <div className="text-center mt-5">Загрузка панели...</div>;

  return (
    <div>
      <h2 className="section-title">Админ-панель</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <h3>{stats.cars || 0}</h3>
            <span>Автомобилей</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <h3>{stats.bookings || 0}</h3>
            <span>Бронирований</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <h3>{stats.reviews || 0}</h3>
            <span>Отзывов</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <h3>{stats.users || 0}</h3>
            <span>Пользователей</span>
          </div>
        </div>
      </div>

      <div className="admin-nav mb-4">
        <Link to="/admin/cars" className="btn btn-outline-primary me-2">Автомобили</Link>
        <Link to="/admin/bookings" className="btn btn-outline-primary me-2">Бронирования</Link>
        <Link to="/admin/reviews" className="btn btn-outline-primary me-2">Отзывы</Link>
        <Link to="/admin/users" className="btn btn-outline-primary">Пользователи</Link>
      </div>

      <Routes>
        <Route path="cars" element={<AdminCars />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="*" element={<div className="text-muted">Выберите раздел для управления.</div>} />
      </Routes>
    </div>
  );
}

export default AdminDashboard;