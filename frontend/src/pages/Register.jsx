import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    setError('');
    api.post('/accounts/register/', {
      username: form.username,
      email: form.email,
      password: form.password,
    })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        navigate('/profile');
      })
      .catch(err => {
        const msg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Ошибка регистрации';
        setError(msg);
        setLoading(false);
      });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="profile-card">
          <h2 className="text-center mb-4">Регистрация</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Имя пользователя</label>
              <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Пароль</label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Подтверждение пароля</label>
              <input type="password" name="password2" className="form-control" value={form.password2} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className="mt-3 text-center">
            Уже есть аккаунт? <Link to="/login">Войдите</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;