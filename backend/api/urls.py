from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views.auth_views import LoginView, LogoutView
from api.views.user_views import UserViewSet
from api.views.vehiculo_views import VehiculoViewSet
from api.views.ruta_views import RutaViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'vehiculos', VehiculoViewSet, basename='vehiculos')
router.register(r'rutas', RutaViewSet, basename='rutas')

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]
