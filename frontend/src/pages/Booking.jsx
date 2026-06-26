import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function Booking() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/cars/${carId}/`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(() => setError('Не удалось загрузить автомобиль'));
  }, [carId]);

  useEffect(() => {
    if (startDate && endDate && car) {
      setChecking(true);
      setError('');
      api.get(`/bookings/check_availability/?car_id=${carId}&start=${startDate}&end=${endDate}`)
        .then(res => {
          setIsAvailable(res.data.available);
          if (res.data.available) {
            const days = (new Date(endDate) - new Date(startDate)) / (1000*60*60*24);
            setTotalPrice(days * car.price_per_day);
          } else {
            setTotalPrice(null);
          }
          setChecking(false);
        })
        .catch(() => {
          setError('Ошибка проверки доступности');
          setChecking(false);
        });
    } else {
      setIsAvailable(null);
      setTotalPrice(null);
    }
  }, [startDate, endDate, car, carId]);

  const handleBooking = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: `/booking/${carId}` } });
      return;
    }
    api.post('/bookings/', {
      car: parseInt(carId),
      start_date: startDate,
      end_date: endDate,
    }, { headers: { Authorization: `Token ${token}` } })
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      })
      .catch(err => {
        const msg = err.response?.data?.non_field_errors?.[0] || 'Ошибка создания бронирования';
        setError(msg);
      });
  };

  if (loading) return <div className="text-center mt-5">Загрузка...</div>;
  if (error && !car) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="booking-container">
      <div className="booking-summary">
        <h3>{car.brand} {car.model}</h3>
        <div className="price">{car.price_per_day} ₽ <small style={{fontSize:'1rem', fontWeight:400, color:'#6c757d'}}>/ день</small></div>
      </div>
      <form>
        <div className="mb-3">
          <label className="form-label fw-semibold">Дата начала</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Дата окончания</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {checking && <p className="text-muted"><i className="fas fa-spinner fa-spin me-2"></i>Проверка...</p>}

        {isAvailable !== null && !checking && (
          <div className={`availability-badge ${isAvailable ? 'available' : 'unavailable'}`}>
            {isAvailable ? (
              <>✅ Доступен! {totalPrice !== null && <strong className="ms-2">{totalPrice} ₽</strong>}</>
            ) : (
              '❌ Занят на выбранные даты'
            )}
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Бронирование создано! Перенаправление...</div>}

        <button
          type="button"
          className="btn btn-primary w-100"
          disabled={!isAvailable || checking || success}
          onClick={handleBooking}
        >
          {checking ? 'Проверка...' : 'Забронировать'}
        </button>
      </form>
    </div>
  );
}

export default Booking;