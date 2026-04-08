from rest_framework import viewsets
from api.models import Vehiculos
from api.serializers.vehiculo_serializer import VehiculoSerializer
from rest_framework.permissions import IsAuthenticated

class VehiculoViewSet(viewsets.ModelViewSet):
    """
    CRUD API para administrar la tabla de vehículos.
    """
    queryset = Vehiculos.objects.all().order_by('-creado_en')
    serializer_class = VehiculoSerializer
    permission_classes = [IsAuthenticated]
