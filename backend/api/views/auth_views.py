from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from api.models import Users, UserSessions
from api.serializers.auth_serializer import LoginSerializer
from api.serializers.user_serializer import UserSerializer
from datetime import timedelta
import secrets
import uuid

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            try:
                user = Users.objects.get(email=email, active=True)
                
                is_valid = False
                if check_password(password, user.password):
                    is_valid = True
                elif user.password.startswith('$2a$') or user.password.startswith('$2b$') or user.password.startswith('$2y$'):
                    # Comprobación "sucia/cruda" para passwords encriptados desde NextAuth/Node original
                    import bcrypt
                    try:
                        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                            is_valid = True
                    except Exception:
                        pass
                
                if is_valid:
                    # Generate secure token
                    token = secrets.token_hex(32)
                    
                    # Get IP and User-Agent
                    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                    if x_forwarded_for:
                        ip = x_forwarded_for.split(',')[0]
                    else:
                        ip = request.META.get('REMOTE_ADDR')
                    
                    user_agent = request.META.get('HTTP_USER_AGENT', '')
                    
                    # Create Session
                    session = UserSessions.objects.create(
                        id=str(uuid.uuid4()),
                        user=user,
                        token=token,
                        created_at=timezone.now(),
                        expires_at=timezone.now() + timedelta(days=30),  # Valid for 30 days
                        active=True,
                        user_agent=user_agent[:255] if user_agent else None,
                        ip=ip[:50] if ip else None
                    )
                    
                    # Update user last_login
                    user.last_login = timezone.now()
                    user.save(update_fields=['last_login'])
                    
                    user_data = UserSerializer(user).data
                    return Response({
                        'token': token,
                        'user': user_data
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)
            except Users.DoesNotExist:
                return Response({'error': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """
    Invalidates the current session.
    Requires authentication globally.
    """
    def post(self, request):
        # request.auth contains the custom UserSessions instance (assigned in CustomTokenAuthentication)
        session = request.auth
        if session:
            session.active = False
            session.save(update_fields=['active'])
            return Response({'message': 'Sesión cerrada correctamente.'}, status=status.HTTP_200_OK)
        return Response({'error': 'No hay sesión activa.'}, status=status.HTTP_400_BAD_REQUEST)
