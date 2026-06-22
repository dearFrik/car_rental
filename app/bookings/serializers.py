from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    car_details = serializers.StringRelatedField(source='car', read_only=True)
    user_details = serializers.StringRelatedField(source='user', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('total_price', 'created_at', 'user')

    def validate(self, data):
        """
        Проверка, что авто доступно на даты.
        """
        car = data.get('car')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date:
            if start_date > end_date:
                raise serializers.ValidationError("Дата начала не может быть позже даты окончания")

            # Проверяем пересечения с активными бронями
            overlapping = Booking.objects.filter(
                car=car,
                status__in=['pending', 'confirmed', 'active'],
                start_date__lte=end_date,
                end_date__gte=start_date
            )
            if self.instance:
                overlapping = overlapping.exclude(id=self.instance.id)

            if overlapping.exists():
                raise serializers.ValidationError("Автомобиль уже забронирован на выбранные даты")

        return data