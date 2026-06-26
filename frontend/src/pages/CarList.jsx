import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

function CarList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [carType, setCarType] = useState(searchParams.get('car_type') || '');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');
  const [isAvailable, setIsAvailable] = useState(searchParams.get('is_available') === 'true' ? true : false);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (carType) params.car_type = carType;
    if (transmission) params.transmission = transmission;
    if (priceMin) params.price_per_day__gte = priceMin;
    if (priceMax) params.price_per_day__lte = priceMax;
    if (isAvailable) params.is_available = true;

    api.get('/cars/', { params })
      .then(res => {
        setCars(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCars();
    const newParams = {};
    if (search) newParams.search = search;
    if (carType) newParams.car_type = carType;
    if (transmission) newParams.transmission = transmission;
    if (priceMin) newParams.price_min = priceMin;
    if (priceMax) newParams.price_max = priceMax;
    if (isAvailable) newParams.is_available = true;
    setSearchParams(newParams);
  }, [search, carType, transmission, priceMin, priceMax, isAvailable]);

  const resetFilters = () => {
    setSearch('');
    setCarType('');
    setTransmission('');
    setPriceMin('');
    setPriceMax('');
    setIsAvailable(false);
  };

  const carTypes = [
    { value: 'economy', label: 'Эконом' },
    { value: 'comfort', label: 'Комфорт' },
    { value: 'business', label: 'Бизнес' },
    { value: 'suv', label: 'Внедорожник' },
    { value: 'premium', label: 'Премиум' },
  ];
  const transmissions = [
    { value: 'manual', label: 'Механика' },
    { value: 'auto', label: 'Автомат' },
  ];

  if (loading) return <div className="text-center mt-5">Загрузка...</div>;

  return (
    <div>
      <h2 className="section-title">Доступные автомобили</h2>

      <div className="filter-panel">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label fw-semibold">Поиск</label>
            <input
              type="text"
              className="form-control"
              placeholder="Марка или модель"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Тип</label>
            <select className="form-select" value={carType} onChange={(e) => setCarType(e.target.value)}>
              <option value="">Все</option>
              {carTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Коробка</label>
            <select className="form-select" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="">Все</option>
              {transmissions.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Цена от</label>
            <input
              type="number"
              className="form-control"
              placeholder="от"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Цена до</label>
            <input
              type="number"
              className="form-control"
              placeholder="до"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
          <div className="col-md-1 d-flex align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="availableCheck"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="availableCheck">
                Только доступные
              </label>
            </div>
          </div>
          <div className="col-md-1">
            <button className="btn btn-outline-secondary w-100" onClick={resetFilters}>
              <i className="fas fa-undo"></i> Сброс
            </button>
          </div>
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="alert alert-info mt-4">По заданным фильтрам автомобилей не найдено.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
          {cars.map(car => {
            // Определяем URL первого изображения
            const imageUrl = car.images && car.images.length > 0 ? car.images[0].image : car.image;
            return (
              <div className="col" key={car.id}>
                <div className="car-card-premium">
                  <div className="car-image-wrapper">
                    {imageUrl ? (
                      <img src={imageUrl} alt={car.model} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <i className="fas fa-car fa-3x text-secondary"></i>
                      </div>
                    )}
                    <div className="car-badge">{car.car_type}</div>
                    {/* Индикатор количества фото, если их несколько */}
                    {car.images && car.images.length > 1 && (
                      <div className="car-image-count">
                        <i className="fas fa-images me-1"></i>{car.images.length}
                      </div>
                    )}
                  </div>
                  <div className="car-info">
                    <h3>{car.brand} {car.model}</h3>
                    <div className="car-specs">
                      <span><i className="fas fa-calendar-alt me-1"></i>{car.year}</span>
                      <span><i className="fas fa-cog me-1"></i>{car.transmission}</span>
                    </div>
                    <div className="car-price-section">
                      <span>
                        <span className="price">{car.price_per_day} ₽</span>
                        <span className="price-period"> / день</span>
                      </span>
                      <Link to={`/cars/${car.id}`} className="btn btn-outline-primary btn-sm">
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CarList;