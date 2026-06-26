import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuth = !!token;
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      api.get('/accounts/profile/', {
        headers: { Authorization: `Token ${token}` }
      })
        .then(res => {
          setIsAdmin(res.data.is_staff || false);
        })
        .catch(() => {
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-car"></i>Надёжное Колесо
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/cars">Автомобили</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/terms">Условия</Link>
            </li>
      
            <li className="nav-item">
              <Link className="nav-link" to="/contacts">Контакты</Link>
            </li>
            
            {isAuth ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Профиль</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Админка</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Выйти</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Войти</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Регистрация</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;