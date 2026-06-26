from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet

router = DefaultRouter()
router.register(r'', BookingViewSet)

urlpatterns = [
    # Явный маршрут для проверки доступности
    path('check_availability/', BookingViewSet.as_view({'get': 'check_availability'}), name='check_availability'),
    # Все остальные маршруты через роутер
    path('', include(router.urls)),
]