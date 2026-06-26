import { useEffect, useState } from 'react';
import api from '../api';

function Reviews({ carId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');
  const isAuth = !!token;

  const fetchReviews = () => {
    setLoading(true);
    api.get(`/reviews/?car_id=${carId}`)
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [carId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuth) {
      setError('Войдите, чтобы оставить отзыв');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');
    api.post('/reviews/', { car: carId, rating, text }, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(() => {
        setSuccess('Отзыв добавлен!');
        setText('');
        setRating(5);
        fetchReviews();
        setSubmitting(false);
      })
      .catch(err => {
        console.error(err);
        setError('Ошибка добавления отзыва');
        setSubmitting(false);
      });
  };

  const handleDelete = (reviewId) => {
    if (!window.confirm('Удалить отзыв?')) return;
    api.delete(`/reviews/${reviewId}/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(() => {
        fetchReviews();
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div className="text-muted">Загрузка отзывов...</div>;

  return (
    <div className="mt-5">
      <h4 className="section-title" style={{fontSize: '1.5rem'}}>Отзывы ({reviews.length})</h4>

      {/* Форма добавления */}
      {isAuth && (
        <div className="card p-3 mb-4">
          <h5>Оставить отзыв</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Оценка</label>
              <select className="form-select" value={rating} onChange={e => setRating(Number(e.target.value))}>
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ★</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Текст</label>
              <textarea className="form-control" rows="3" value={text}
                onChange={e => setText(e.target.value)} required></textarea>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        </div>
      )}

      {/* Список отзывов */}
      {reviews.length === 0 ? (
        <p className="text-muted">Пока нет отзывов. Будьте первым!</p>
      ) : (
        reviews.map(review => (
          <div key={review.id} className="border-bottom py-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{review.user_name}</strong>
                <span className="ms-2 text-warning">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
                <span className="text-muted small ms-2">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              {/* Если пользователь владелец или админ – кнопка удалить */}
              {localStorage.getItem('token') && (
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(review.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
            <p className="mt-1">{review.text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Reviews;