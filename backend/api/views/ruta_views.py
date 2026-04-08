from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models import Rutas
from api.serializers.ruta_serializer import RutaSerializer
from api.services.routing_engine import RoutingEngine

# Inicializar motor AI para tener en memoria el modelo entrenado Random Forest
ai_router = RoutingEngine()

class RutaViewSet(viewsets.ModelViewSet):
    """
    CRUD definitions para Rutas y endpoints Inteligentes de Optimización IA.
    """
    queryset = Rutas.objects.all().order_by('-creado_en')
    serializer_class = RutaSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='optimize')
    def optimize(self, request):
        """
        Recibe {"origin": {lat, lng}, "destinations": [{lat, lng, name...}, ...]}
        Aplica: K-Means Clustering -> TSP Vectorial -> OSRM Call -> Random Forest ETA
        Retorna la ruta completa y metadata predictiva.
        """
        data = request.data
        origin = data.get('origin')
        destinations = data.get('destinations')

        if not origin or not destinations:
            return Response(
                {"error": "Se requiere un 'origin' y una lista de 'destinations'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Ejecutar el motor de Inteligencia Artificial (Tiempo de cómputo complejo)
            optimized_data = ai_router.optimize_route(origin, destinations)
            return Response({
                "success": True,
                "message": "Ruta optimizada exitosamente usando Algoritmos Genéticos y K-Means.",
                "data": optimized_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Fallo en la optimización con IA: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
