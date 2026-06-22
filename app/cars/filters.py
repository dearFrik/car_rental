from django_filters import rest_framework as filters
from .models import Car

class CarFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name='price_per_day', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='price_per_day', lookup_expr='lte')

    class Meta:
        model = Car
        fields = [
            'price_min',
            'price_max',
            'car_type',
            'transmission',
            'is_available',
            'fuel_type',
            'seats',
            'year',
        ]