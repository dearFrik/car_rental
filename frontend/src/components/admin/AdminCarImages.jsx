import React, { useState } from 'react';
import api from '../../api';

function AdminCarImages({ carId, images, onUpdate }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = () => {
    if (!files.length) return;
    setUploading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    api.post(`/admin/cars/${carId}/upload-images/`, formData, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(res => {
        setSuccess(`Загружено ${res.data.images.length} изображений`);
        setFiles([]);
        onUpdate(); // перезагрузить данные
        setUploading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Ошибка загрузки');
        setUploading(false);
      });
  };

  const handleDelete = (imageId) => {
    if (!window.confirm('Удалить изображение?')) return;
    api.delete(`/admin/cars/${carId}/delete-image/${imageId}/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(() => {
        onUpdate();
      })
      .catch(err => console.error(err));
  };

  if (!carId) return null;

  return (
    <div className="mt-4 p-3 border rounded">
      <h6>Изображения автомобиля</h6>
      <div className="row g-2 mb-2">
        {images.map(img => (
          <div key={img.id} className="col-auto position-relative">
            <img src={img.image} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded" />
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0"
              onClick={() => handleDelete(img.id)}
              style={{ borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="d-flex align-items-center gap-2">
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="form-control" style={{ maxWidth: '300px' }} />
        <button className="btn btn-primary btn-sm" onClick={handleUpload} disabled={uploading || !files.length}>
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </div>
      {error && <div className="text-danger mt-1 small">{error}</div>}
      {success && <div className="text-success mt-1 small">{success}</div>}
    </div>
  );
}

export default AdminCarImages;