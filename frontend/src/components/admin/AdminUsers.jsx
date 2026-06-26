import { useEffect, useState } from 'react';
import api from '../../api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Token ${token}` };

  useEffect(() => {
    api.get('/admin/users/', { headers })
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleStaff = (user) => {
    api.patch(`/admin/users/${user.id}/`, { is_staff: !user.is_staff }, { headers })
      .then(() => {
        setUsers(users.map(u => u.id === user.id ? { ...u, is_staff: !u.is_staff } : u));
      })
      .catch(err => console.error(err));
  };

  const toggleActive = (user) => {
    api.patch(`/admin/users/${user.id}/`, { is_active: !user.is_active }, { headers })
      .then(() => {
        setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h4>Пользователи</h4>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Имя пользователя</th><th>Email</th>
            <th>Имя</th><th>Фамилия</th><th>Админ</th><th>Активен</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.first_name}</td>
              <td>{u.last_name}</td>
              <td>{u.is_staff ? '✅' : '❌'}</td>
              <td>{u.is_active ? '✅' : '❌'}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => toggleStaff(u)}>
                  {u.is_staff ? 'Снять админа' : 'Сделать админом'}
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleActive(u)}>
                  {u.is_active ? 'Заблокировать' : 'Разблокировать'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;