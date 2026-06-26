import React, { useEffect, useState } from 'react';
import api from '../../api';
import AdminCarImages from './AdminCarImages';

function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    brand: '', model: '', year: '', license_plate: '', price_per_day: '',
    car_type: '', transmission: '', seats: '', fuel_type: '', is_available: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Token ${token}` };

  const fetchCars = () => {
    setLoading(true);
    api.get('/admin/cars/', { headers })
      .then(res => {
        setCars(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchCarImages = (carId) => {
    api.get(`/admin/cars/${carId}/`, { headers })
      .then(res => {
        setImages(res.data.images || []);
      })
      .catch(err => console.error(err));
  };

  const refreshCarData = () => {
    fetchCars();
    if (editing) {
      fetchCarImages(editing);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editing ? 'put' : 'post';
    const url = editing ? `/admin/cars/${editing}/` : '/admin/cars/';
    const payload = { ...form, year: parseInt(form.year), seats: parseInt(form.seats), price_per_day: parseFloat(form.price_per_day) };
    api[method](url, payload, { headers })
      .then(() => {
        setSuccess(editing ? 'Автомобиль обновлён' : 'Автомобиль создан');
        setError('');
        setForm({ brand: '', model: '', year: '', license_plate: '', price_per_day: '', car_type: '', transmission: '', seats: '', fuel_type: '', is_available: true });
        setEditing(null);
        setImages([]);
        fetchCars();
      })
      .catch(err => {
        const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Ошибка';
        setError(msg);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Удалить автомобиль?')) return;
    api.delete(`/admin/cars/${id}/`, { headers })
      .then(() => fetchCars())
      .catch(err => console.error(err));
  };

  const startEdit = (car) => {
    setEditing(car.id);
    setForm({
      brand: car.brand, model: car.model, year: car.year, license_plate: car.license_plate,
      price_per_day: car.price_per_day, car_type: car.car_type, transmission: car.transmission,
      seats: car.seats, fuel_type: car.fuel_type, is_available: car.is_available
    });
    fetchCarImages(car.id);
  };

  const resetForm = () => {
    setEditing(null);
    setImages([]);
    setForm({ brand: '', model: '', year: '', license_plate: '', price_per_day: '', car_type: '', transmission: '', seats: '', fuel_type: '', is_available: true });
    setError('');
    setSuccess('');
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h4>Управление автомобилями</h4>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card p-3 mb-4">
        <h5>{editing ? 'Редактировать' : 'Добавить'} автомобиль</h5>
        <form onSubmit={handleSubmit}>
          {/* ... поля формы как раньше ... */}
          <div className="row g-2">
            <div className="col-md-3">
              <input className="form-control" placeholder="Марка" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Модель" value={form.model} onChange={e => setForm({...form, model: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="number" placeholder="Год" value={form.year} onChange={e => setForm({...form, year: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Номер" value={form.license_plate} onChange={e => setForm({...form, license_plate: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="number" step="0.01" placeholder="Цена за день" value={form.price_per_day} onChange={e => setForm({...form, price_per_day: e.target.value})} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.car_type} onChange={e => setForm({...form, car_type: e.target.value})}>
                <option value="">Тип</option>
                <option value="economy">Эконом</option>
                <option value="comfort">Комфорт</option>
                <option value="business">Бизнес</option>
                <option value="suv">Внедорожник</option>
                <option value="premium">Премиум</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.transmission} onChange={e => setForm({...form, transmission: e.target.value})}>
                <option value="">Коробка</option>
                <option value="manual">Механика</option>
                <option value="auto">Автомат</option>
              </select>
            </div>
            <div className="col-md-1">
              <input className="form-control" type="number" placeholder="Мест" value={form.seats} onChange={e => setForm({...form, seats: e.target.value})} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Топливо" value={form.fuel_type} onChange={e => setForm({...form, fuel_type: e.target.value})} />
            </div>
            <div className="col-md-2 form-check d-flex align-items-center">
              <input className="form-check-input me-2" type="checkbox" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} />
              <label className="form-check-label">Доступен</label>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">{editing ? 'Обновить' : 'Создать'}</button>
            </div>
            {editing && (
              <div className="col-md-2">
                <button type="button" className="btn btn-secondary w-100" onClick={resetForm}>Отмена</button>
              </div>
            )}
          </div>
        </form>
        {/* Блок загрузки изображений появляется при редактировании */}
        {editing && (
          <AdminCarImages
            carId={editing}
            images={images}
            onUpdate={refreshCarData}
          />
        )}
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Марка</th><th>Модель</th><th>Год</th><th>Цена</th>
            <th>Тип</th><th>Коробка</th><th>Доступен</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car.id}>
              <td>{car.id}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
              <td>{car.price_per_day}</td>
              <td>{car.car_type}</td>
              <td>{car.transmission}</td>
              <td>{car.is_available ? '✅' : '❌'}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEdit(car)}>✏️</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(car.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCars;