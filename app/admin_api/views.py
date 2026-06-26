from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from django.contrib.auth.models import User
from cars.models import Car, CarImage
from bookings.models import Booking
from reviews.models import Review
from .serializers import UserSerializer, CarSerializer, BookingSerializer, ReviewSerializer, CarImageSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class AdminCarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser, JSONParser)   # ← добавили JSONParser

    @action(detail=True, methods=['post'], url_path='upload-images')
    def upload_images(self, request, pk=None):
        car = self.get_object()
        files = request.FILES.getlist('images')
        if not files:
            return Response({'error': 'No images provided'}, status=status.HTTP_400_BAD_REQUEST)

        images = []
        for idx, file in enumerate(files):
            car_image = CarImage.objects.create(car=car, image=file, order=idx)
            images.append(CarImageSerializer(car_image).data)
        return Response({'images': images}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='delete-image/(?P<image_id>[^/.]+)')
    def delete_image(self, request, pk=None, image_id=None):
        car = self.get_object()
        try:
            image = CarImage.objects.get(id=image_id, car=car)
            image.delete()
            return Response({'status': 'deleted'}, status=status.HTTP_204_NO_CONTENT)
        except CarImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

class AdminBookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]

class AdminReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUser]