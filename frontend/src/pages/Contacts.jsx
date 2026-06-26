import { useState } from 'react';

function Contacts() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно отправить данные на бэкенд, но пока просто имитация
    console.log('Form submitted:', form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <h1 className="section-title">Контакты</h1>

      <div className="row g-5">
        {/* Левая колонка – информация */}
        <div className="col-md-5">
          <div className="card p-4 shadow-sm">
            <h5 className="text-primary mb-3"><i className="fas fa-map-marker-alt me-2"></i>Адрес</h5>
            <p className="text-muted">г. Москва, Кутузовский проспект, д.2/1 с.6</p>

            <h5 className="text-primary mt-4 mb-3"><i className="fas fa-phone me-2"></i>Телефон</h5>
            <p className="text-muted">
              <a href="tel:+74953748204" className="text-decoration-none">+7 (495) 374-82-04</a>
            </p>

            <h5 className="text-primary mt-4 mb-3"><i className="fas fa-envelope me-2"></i>Email</h5>
            <p className="text-muted">
              <a href="mailto:info@carloson.ru" className="text-decoration-none">info@carloson.ru</a>
            </p>

            <h5 className="text-primary mt-4 mb-3"><i className="fas fa-clock me-2"></i>Время работы</h5>
            <p className="text-muted">Ежедневно, круглосуточно<br />Без выходных</p>

            <h5 className="text-primary mt-4 mb-3"><i className="fas fa-share-alt me-2"></i>Мы в соцсетях</h5>
            <div className="social-links">
              <a href="#" className="social-link telegram"><i className="fab fa-telegram-plane"></i></a>
              <a href="#" className="social-link youtube"><i className="fab fa-youtube"></i></a>
              <a href="#" className="social-link vk"><i className="fab fa-vk"></i></a>
              <a href="#" className="social-link tiktok"><i className="fab fa-tiktok"></i></a>
            </div>
          </div>
        </div>

        {/* Правая колонка – форма и карта */}
        <div className="col-md-7">
          {/* Карта (замените адрес на свой) */}
          <div className="mb-4">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3A1f2c3d4e5f6g7h8i9j0k&source=constructor"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              title="Карта"
            ></iframe>
          </div>

          {/* Форма обратной связи */}
          <div className="card p-4 shadow-sm">
            <h5>Напишите нам</h5>
            {submitted && (
              <div className="alert alert-success">Сообщение отправлено! Мы свяжемся с вами.</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Ваше имя</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Сообщение</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Отправить</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;