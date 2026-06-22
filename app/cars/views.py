from rest_framework import viewsets
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Car
from .serializers import CarSerializer
from .filters import CarFilter   # ← импортируем наш фильтр

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Используем кастомный фильтр
    filterset_class = CarFilter

    search_fields = ['brand', 'model', 'license_plate']
    ordering_fields = ['price_per_day', 'year', 'brand', 'created_at']
    ordering = ['price_per_day']