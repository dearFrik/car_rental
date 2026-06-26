import { useEffect, useState } from 'react';
import api from '../../api';

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Token ${token}` };

  useEffect(() => {
    api.get('/admin/reviews/', { headers })
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Удалить отзыв?')) return;
    api.delete(`/admin/reviews/${id}/`, { headers })
      .then(() => {
        setReviews(reviews.filter(r => r.id !== id));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h4>Отзывы</h4>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Пользователь</th><th>Автомобиль</th>
            <th>Оценка</th><th>Текст</th><th>Дата</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.user_details}</td>
              <td>{r.car_details}</td>
              <td>{'★'.repeat(r.rating)}</td>
              <td>{r.text.length > 50 ? r.text.slice(0, 50) + '…' : r.text}</td>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReviews;