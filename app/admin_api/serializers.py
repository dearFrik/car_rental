from rest_framework import serializers
from django.contrib.auth.models import User
from cars.models import Car, CarImage
from bookings.models import Booking
from reviews.models import Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active']

class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ('id', 'image', 'order')

class CarSerializer(serializers.ModelSerializer):
    images = CarImageSerializer(many=True, read_only=True)
    class Meta:
        model = Car
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    user_details = serializers.StringRelatedField(source='user', read_only=True)
    car_details = serializers.StringRelatedField(source='car', read_only=True)
    class Meta:
        model = Booking
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    user_details = serializers.StringRelatedField(source='user', read_only=True)
    car_details = serializers.StringRelatedField(source='car', read_only=True)
    class Meta:
        model = Review
        fields = '__all__'