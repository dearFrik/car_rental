from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Booking
from .serializers import BookingSerializer
from cars.models import Car

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        car = serializer.validated_data['car']
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']

        # Проверка, что даты корректны
        if start_date > end_date:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Дата начала не может быть позже даты окончания")

        # Проверка доступности
        if not self.is_car_available(car, start_date, end_date):
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Автомобиль уже забронирован на выбранные даты")

        # Рассчёт цены
        days = (end_date - start_date).days
        total_price = days * car.price_per_day

        serializer.save(
            user=self.request.user,
            total_price=total_price
        )

    def is_car_available(self, car, start_date, end_date):
        """
        Проверяет, свободен ли автомобиль на указанные даты.
        """
        overlapping_bookings = Booking.objects.filter(
            car=car,
            status__in=['pending', 'confirmed', 'active'],
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        return not overlapping_bookings.exists()

    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """
        Возвращает бронирования текущего пользователя.
        GET /api/bookings/my_bookings/
        """
        bookings = Booking.objects.filter(user=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Отменяет бронирование (меняет статус на 'cancelled').
        POST /api/bookings/1/cancel/
        """
        booking = self.get_object()
        if booking.user != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Недостаточно прав'},
                status=status.HTTP_403_FORBIDDEN
            )
        booking.status = 'cancelled'
        booking.save()
        return Response({'status': 'Бронирование отменено'})

    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        """
        Проверяет, доступен ли автомобиль на указанные даты.
        GET /api/bookings/check_availability/?car_id=1&start=2025-05-01&end=2025-05-05
        """
        car_id = request.query_params.get('car_id')
        start_date = request.query_params.get('start')
        end_date = request.query_params.get('end')

        if not car_id or not start_date or not end_date:
            return Response(
                {'error': 'Необходимо передать car_id, start, end'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            car = Car.objects.get(id=car_id)
            available = self.is_car_available(car, start_date, end_date)
            return Response({
                'available': available,
                'car': f"{car.brand} {car.model}",
                'start_date': start_date,
                'end_date': end_date
            })
        except Car.DoesNotExist:
            return Response(
                {'error': 'Автомобиль не найден'},
                status=status.HTTP_404_NOT_FOUND
            )