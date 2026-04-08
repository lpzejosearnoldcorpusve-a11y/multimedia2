from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from api.models import UserSessions, Users

class CustomTokenAuthentication(BaseAuthentication):
    """
    Custom authentication for tokens stored in UserSessions.
    Reads token from 'Authorization: Bearer <token>' header.
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None
        
        try:
            auth_parts = auth_header.split()
            if len(auth_parts) != 2 or auth_parts[0].lower() != 'bearer':
                return None
            
            token = auth_parts[1]
            
            # Find the active session
            session = UserSessions.objects.select_related('user').get(
                token=token,
                active=True,
                expires_at__gt=timezone.now()
            )
            
            return (session.user, session)
            
        except UserSessions.DoesNotExist:
            raise AuthenticationFailed('Token inválido o expirado.')
        except Exception as e:
            raise AuthenticationFailed('Error de autenticación.')

    def authenticate_header(self, request):
        return 'Bearer'
