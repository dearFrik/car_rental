import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-premium">
      <div className="container">
        <div className="row g-4">
          {/* Контакты */}
          <div className="col-md-4">
            <h5 className="footer-heading">Контакты</h5>
            <ul className="footer-list">
              <li>
                <i className="fas fa-map-marker-alt me-2"></i>
                Кутузовский проспект, д.2/1 с.6
              </li>
              <li>
                <i className="fas fa-clock me-2"></i>
                Без выходных, Круглосуточно
              </li>
              <li>
                <i className="fas fa-phone me-2"></i>
                <a href="tel:+74953748204">+7 (495) 374-82-04</a>
              </li>
              <li>
                <i className="fas fa-envelope me-2"></i>
                <a href="mailto:info@carloson.ru">info@carloson.ru</a>
              </li>
            </ul>
          </div>

          {/* Помощь */}
          <div className="col-md-4">
            <h5 className="footer-heading">Нужна помощь?</h5>
            <ul className="footer-list">
              <li>
                <i className="fab fa-whatsapp me-2 text-success"></i>
                <a href="#">Напишите нам в WhatsApp</a>
              </li>
              <li>
                <i className="fab fa-telegram me-2 text-info"></i>
                <a href="#">Напишите нам в Telegram</a>
              </li>
              <li>
                <i className="fas fa-envelope me-2"></i>
                <a href="#">Написать директору</a>
              </li>
            </ul>
          </div>

          {/* Соцсети */}
          <div className="col-md-4">
            <h5 className="footer-heading">Подписывайтесь</h5>
            <div className="social-links">
              <a href="#" className="social-link telegram" aria-label="Telegram">
                <i className="fab fa-telegram-plane"></i>
              </a>
              <a href="#" className="social-link youtube" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-link vk" aria-label="VKontakte">
                <i className="fab fa-vk"></i>
              </a>
              <a href="#" className="social-link tiktok" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Юридическая информация */}
        <div className="footer-bottom">
          <p className="mb-0">
            © 2026 Надёжное Колесо. Все права защищены.
          </p>
          <p className="mb-0 small text-muted">
            ООО «НАДЁЖНОЕ КОЛЕСО» Юр. адрес: г. Москва, вн. тер. г. муниципальный округ Аэропорт, ул. 1-я 8 Марта, д. 3, помещ. 11
          </p>
          <p className="mb-0 small text-muted">
            Этот сайт использует сервис Yandex SmartCapture. Политика обработки данных.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;