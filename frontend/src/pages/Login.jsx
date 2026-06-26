import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/profile';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    api.post('/accounts/login/', { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        navigate(from);
      })
      .catch(() => {
        setError('Неверный логин или пароль');
        setLoading(false);
      });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="profile-card">
          <h2 className="text-center mb-4">Вход</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Имя пользователя</label>
              <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Пароль</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <p className="mt-3 text-center">
            Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;