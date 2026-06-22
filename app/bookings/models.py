from django.db import models
from django.contrib.auth.models import User
from cars.models import Car

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('confirmed', 'Подтвержден'),
        ('active', 'Активен'),
        ('completed', 'Завершен'),
        ('cancelled', 'Отменен'),
    ]
    
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField(verbose_name='Дата начала')
    end_date = models.DateField(verbose_name='Дата окончания')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.total_price:
            days = (self.end_date - self.start_date).days
            self.total_price = days * self.car.price_per_day
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.username} - {self.car} ({self.start_date} - {self.end_date})"