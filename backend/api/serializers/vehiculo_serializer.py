from rest_framework import serializers
from api.models import Vehiculos
import uuid
from django.utils import timezone

class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculos
        fields = '__all__'
        read_only_fields = ['id', 'creado_en', 'actualizado_en']

    def create(self, validated_data):
        validated_data['id'] = str(uuid.uuid4())
        if 'creado_en' not in validated_data:
            validated_data['creado_en'] = timezone.now()
        if 'estado' not in validated_data:
            validated_data['estado'] = 'Activo'
            
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['actualizado_en'] = timezone.now()
        return super().update(instance, validated_data)
