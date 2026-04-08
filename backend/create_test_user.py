import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.utils import timezone
from api.models import Users, Roles
from django.contrib.auth.hashers import make_password
import uuid

role_qs = Roles.objects.filter(name='Admin')
if not role_qs.exists():
    role = Roles.objects.create(
        id=str(uuid.uuid4()),
        name='Admin',
        description='Administrador del sistema',
        created_at=timezone.now()
    )
else:
    role = role_qs.first()

email = 'usuario@email.com'
password = 'password123'

user = Users.objects.filter(email=email).first()
if not user:
    Users.objects.create(
        id=str(uuid.uuid4()),
        email=email,
        name='Usuario de Prueba',
        password=make_password(password),
        role=role,
        active=True,
        created_at=timezone.now()
    )
    print("Usuario creado con éxito")
else:
    user.password = make_password(password)
    user.active = True
    user.save()
    print("Usuario actualizado con éxito")
