from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminUserViewSet, AdminCarViewSet, AdminBookingViewSet, AdminReviewViewSet

router = DefaultRouter()
router.register(r'users', AdminUserViewSet)
router.register(r'cars', AdminCarViewSet)
router.register(r'bookings', AdminBookingViewSet)
router.register(r'reviews', AdminReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]