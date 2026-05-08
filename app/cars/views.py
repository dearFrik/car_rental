from rest_framework import viewsets
from .models import Car
from .serializers import CarSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    
    def get_queryset(self):
        queryset = Car.objects.all()
        is_available = self.request.query_params.get('available', None)
        if is_available:
            queryset = queryset.filter(is_available=is_available.lower() == 'true')
        return queryset