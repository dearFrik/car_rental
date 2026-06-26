import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import api from '../api';
import Reviews from '../components/Reviews';

function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/cars/${id}/`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-5">Загрузка...</div>;
  if (!car) return <div className="alert alert-danger">Автомобиль не найден</div>;

  return (
    <>
      <div className="detail-container">
        <div className="detail-gallery">
          {car.images && car.images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              style={{ height: '400px', width: '100%' }}
            >
              {car.images.map(img => (
                <SwiperSlide key={img.id}>
                  <img
                    src={img.image}
                    alt={car.model}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : car.image ? (
            <img src={car.image} alt={car.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '400px' }}>
              <i className="fas fa-car fa-5x text-secondary"></i>
            </div>
          )}
        </div>
        <div>
          <h1 className="display-5 fw-bold">{car.brand} {car.model}</h1>
          <div className="detail-price">
            {car.price_per_day} ₽ <span>/ день</span>
          </div>
          <div className="detail-specs">
            <div className="detail-spec-item"><span>Год</span> <strong>{car.year}</strong></div>
            <div className="detail-spec-item"><span>Тип</span> <strong>{car.car_type}</strong></div>
            <div className="detail-spec-item"><span>Коробка</span> <strong>{car.transmission}</strong></div>
            <div className="detail-spec-item"><span>Мест</span> <strong>{car.seats}</strong></div>
            <div className="detail-spec-item"><span>Топливо</span> <strong>{car.fuel_type}</strong></div>
            <div className="detail-spec-item"><span>Госномер</span> <strong>{car.license_plate}</strong></div>
          </div>
          {car.is_available ? (
            <Link to={`/booking/${car.id}`} className="btn btn-primary book-btn">
              <i className="fas fa-calendar-check me-2"></i>Забронировать
            </Link>
          ) : (
            <button className="btn btn-secondary book-btn" disabled>Недоступен</button>
          )}
        </div>
      </div>
      <Reviews carId={car.id} />
    </>
  );
}

export default CarDetail;