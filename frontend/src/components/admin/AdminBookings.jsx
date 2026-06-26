import { useEffect, useState } from 'react';
import api from '../../api';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Token ${token}` };

  useEffect(() => {
    api.get('/admin/bookings/', { headers })
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Удалить бронирование?')) return;
    api.delete(`/admin/bookings/${id}/`, { headers })
      .then(() => {
        setBookings(bookings.filter(b => b.id !== id));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h4>Бронирования</h4>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Пользователь</th><th>Автомобиль</th>
            <th>Начало</th><th>Конец</th><th>Цена</th><th>Статус</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user_details}</td>
              <td>{b.car_details}</td>
              <td>{b.start_date}</td>
              <td>{b.end_date}</td>
              <td>{b.total_price}</td>
              <td><span className={`badge bg-${b.status === 'pending' ? 'warning' : b.status === 'confirmed' ? 'success' : 'secondary'}`}>{b.status}</span></td>
              <td>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookings;