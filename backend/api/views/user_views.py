from rest_framework import viewsets
from api.models import Users
from api.serializers.user_serializer import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD definitions for Users.
    Authentication is required.
    """
    queryset = Users.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
