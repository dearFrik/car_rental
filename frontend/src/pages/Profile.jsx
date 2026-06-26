import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '' });
  const [message, setMessage] = useState('');
  const [cancelling, setCancelling] = useState(null);

  const token = localStorage.getItem('token');

  const fetchProfile = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    api.get('/accounts/profile/', { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        setUser(res.data);
        setForm({
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          email: res.data.email || ''
        });
        return api.get('/bookings/my_bookings/', { headers: { Authorization: `Token ${token}` } });
      })
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchProfile();
  }, [token, navigate]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    api.patch('/accounts/profile/', form, { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        setUser(res.data);
        setMessage('Профиль обновлён');
        setEditMode(false);
      })
      .catch(() => setMessage('Ошибка обновления'));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    api.post('/accounts/change-password/', passwordForm, { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        setMessage('Пароль изменён');
        setPasswordForm({ old_password: '', new_password: '' });
        if (res.data.new_token) localStorage.setItem('token', res.data.new_token);
      })
      .catch(err => {
        const msg = err.response?.data?.old_password || 'Ошибка смены пароля';
        setMessage('Ошибка: ' + msg);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCancelBooking = (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) return;
    setCancelling(bookingId);
    api.post(`/bookings/${bookingId}/cancel/`, {}, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(() => {
        setMessage('Бронирование отменено');
        return api.get('/bookings/my_bookings/', { headers: { Authorization: `Token ${token}` } });
      })
      .then(res => {
        setBookings(res.data);
        setCancelling(null);
      })
      .catch(err => {
        console.error(err);
        setMessage('Ошибка отмены бронирования');
        setCancelling(null);
      });
  };

  if (loading) return <div className="text-center mt-5">Загрузка...</div>;
  if (!user) return <div className="alert alert-danger">Не удалось загрузить профиль</div>;

  return (
    <div>
      <h2 className="section-title">Личный кабинет</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        <div className="col-md-6">
          <div className="profile-card">
            <h5><i className="fas fa-user me-2"></i>Профиль</h5>
            {!editMode ? (
              <>
                <p><strong>Имя пользователя:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Имя:</strong> {user.first_name || '—'}</p>
                <p><strong>Фамилия:</strong> {user.last_name || '—'}</p>
                <div>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => setEditMode(true)}>
                    Редактировать
                  </button>
                  {/* Кнопка перехода в админку – только для администраторов */}
                  {user.is_staff && (
                    <Link to="/admin" className="btn btn-outline-primary btn-sm me-2">
                      <i className="fas fa-cog me-1"></i>Админ-панель
                    </Link>
                  )}
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Выйти</button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label>Email</label>
                  <input className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label>Имя</label>
                  <input className="form-control" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label>Фамилия</label>
                  <input className="form-control" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary btn-sm me-2">Сохранить</button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>Отмена</button>
              </form>
            )}
          </div>

          <div className="profile-card">
            <h5><i className="fas fa-key me-2"></i>Смена пароля</h5>
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label>Текущий пароль</label>
                <input type="password" className="form-control" value={passwordForm.old_password}
                       onChange={e => setPasswordForm({...passwordForm, old_password: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label>Новый пароль</label>
                <input type="password" className="form-control" value={passwordForm.new_password}
                       onChange={e => setPasswordForm({...passwordForm, new_password: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-warning btn-sm">Сменить пароль</button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="profile-card">
            <h5><i className="fas fa-list me-2"></i>Мои бронирования</h5>
            {bookings.length === 0 ? (
              <p className="text-muted">У вас пока нет бронирований.</p>
            ) : (
              bookings.map(b => (
                <div key={b.id} className={`booking-item status-${b.status}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{b.car_details}</strong>
                      <div className="text-muted small">{b.start_date} — {b.end_date}</div>
                    </div>
                    <div className="text-end">
                      <span className={`badge bg-${b.status === 'pending' ? 'warning' : b.status === 'confirmed' ? 'success' : 'secondary'}`}>
                        {b.status}
                      </span>
                      <div className="fw-bold mt-1">{b.total_price} ₽</div>
                      {b.status !== 'cancelled' && (
                        <button
                          className="btn btn-outline-danger btn-sm mt-2"
                          onClick={() => handleCancelBooking(b.id)}
                          disabled={cancelling === b.id}
                        >
                          {cancelling === b.id ? 'Отмена...' : 'Отменить'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;