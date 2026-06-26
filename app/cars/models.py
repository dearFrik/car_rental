from django.db import models

class Car(models.Model):
    CAR_TYPES = [
        ('economy', 'Эконом'),
        ('comfort', 'Комфорт'),
        ('business', 'Бизнес'),
        ('suv', 'Внедорожник'),
        ('premium', 'Премиум'),
    ]
    
    TRANSMISSION = [
        ('manual', 'Механика'),
        ('auto', 'Автомат'),
    ]
    
    brand = models.CharField(max_length=50, verbose_name='Марка')
    model = models.CharField(max_length=50, verbose_name='Модель')
    year = models.IntegerField(verbose_name='Год выпуска')
    license_plate = models.CharField(max_length=15, unique=True, verbose_name='Госномер')
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена за день')
    car_type = models.CharField(max_length=20, choices=CAR_TYPES, verbose_name='Тип')
    transmission = models.CharField(max_length=10, choices=TRANSMISSION, verbose_name='Коробка')
    seats = models.IntegerField(default=4, verbose_name='Кол-во мест')
    fuel_type = models.CharField(max_length=20, default='petrol', verbose_name='Топливо')
    is_available = models.BooleanField(default=True, verbose_name='Доступен')
    image = models.ImageField(upload_to='cars/', blank=True, null=True, verbose_name='Фото')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Автомобиль'
        verbose_name_plural = 'Автомобили'
    
    def __str__(self):
        return f"{self.brand} {self.model} ({self.license_plate})"
    
class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='cars/', verbose_name='Изображение')
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'uploaded_at']
        verbose_name = 'Изображение'
        verbose_name_plural = 'Изображения'

    def __str__(self):
        return f"{self.car} - {self.order}"