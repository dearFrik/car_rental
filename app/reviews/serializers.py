from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    car = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'car', 'user', 'user_name', 'rating', 'text', 'created_at', 'updated_at']
        read_only_fields = ['user', 'car']