from rest_framework import serializers
from api.models import Users
from django.contrib.auth.hashers import make_password
import uuid
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'email', 'name', 'password', 'role', 'profile_image', 'active', 'created_at', 'updated_at', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'last_login': {'read_only': True},
        }

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        validated_data['id'] = str(uuid.uuid4())
        validated_data['created_at'] = timezone.now()
        if 'active' not in validated_data:
            validated_data['active'] = True
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        validated_data['updated_at'] = timezone.now()
        return super().update(instance, validated_data)
