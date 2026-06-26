from django.contrib import admin
from .models import Car, CarImage

class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1
    fields = ('image', 'order')


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    inlines = [CarImageInline]
    list_display = ('brand', 'model', 'license_plate', 'price_per_day', 'is_available')
    list_filter = ('is_available', 'car_type', 'transmission')
    search_fields = ('brand', 'model', 'license_plate')