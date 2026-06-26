from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer
from cars.models import Car

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        car_id = self.request.query_params.get('car_id')
        if car_id:
            return Review.objects.filter(car_id=car_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        car_id = self.request.data.get('car')
        try:
            car = Car.objects.get(id=car_id)
            serializer.save(user=self.request.user, car=car)
        except Car.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError('Автомобиль не найден')

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=False, methods=['get'])
    def car_reviews(self, request):
        car_id = request.query_params.get('car_id')
        if not car_id:
            return Response(
                {'error': 'car_id обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )
        reviews = Review.objects.filter(car_id=car_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        # Заготовка для лайков (можно позже добавить)
        return Response({'detail': 'Функция лайков будет добавлена позже'})