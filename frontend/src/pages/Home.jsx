import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="hero-section">
      <div>
        <h1>Аренда премиальных автомобилей</h1>
        <p>Более 170 автомобилей в Москве, Санкт-Петербурге и Сочи</p>
        <Link to="/cars" className="btn hero-btn">
          <i className="fas fa-arrow-right me-2"></i>Выбрать автомобиль
        </Link>
      </div>
    </div>
  );
}

export default Home;