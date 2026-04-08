from rest_framework import serializers
from api.models import Rutas
from django.utils import timezone
import uuid

class RutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rutas
        fields = '__all__'
        read_only_fields = ['id', 'creado_en', 'actualizado_en']

    def create(self, validated_data):
        validated_data['id'] = str(uuid.uuid4())
        if 'creado_en' not in validated_data:
            validated_data['creado_en'] = timezone.now()
        if 'estado' not in validated_data:
            validated_data['estado'] = 'Planificada'
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['actualizado_en'] = timezone.now()
        return super().update(instance, validated_data)
