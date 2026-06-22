from django.contrib import admin
from .models import Booking
from .utils import send_booking_confirmation

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'car',
        'start_date',
        'end_date',
        'total_price',
        'status',
        'created_at'
    )
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('user__username', 'car__brand', 'car__model')
    readonly_fields = ('total_price', 'created_at')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {
            'fields': ('user', 'car', 'start_date', 'end_date', 'total_price', 'status')
        }),
        ('Важное', {
            'classes': ('collapse',),
            'fields': ('created_at',)
        }),
    )
    actions = ['confirm_booking', 'cancel_booking']

    def save_model(self, request, obj, form, change):
        """
        Вызывается при сохранении через админку (как создание, так и редактирование).
        """
        # Если цена не задана – рассчитываем автоматически
        if not obj.total_price:
            days = (obj.end_date - obj.start_date).days
            obj.total_price = days * obj.car.price_per_day

        # Сохраняем объект
        super().save_model(request, obj, form, change)

        # Отправляем письмо, если это новое бронирование (не change)
        # или если статус изменился на 'confirmed'
        if not change or (change and obj.status == 'confirmed'):
            send_booking_confirmation(obj)

    def confirm_booking(self, request, queryset):
        queryset.update(status='confirmed')
        self.message_user(request, "Бронирования подтверждены")
        # Отправляем письма для каждого подтверждённого бронирования
        for booking in queryset:
            send_booking_confirmation(booking)
    confirm_booking.short_description = "Подтвердить выбранные бронирования"

    def cancel_booking(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(request, "Бронирования отменены")
    cancel_booking.short_description = "Отменить выбранные бронирования"