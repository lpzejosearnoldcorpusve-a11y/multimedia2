import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Users
users = Users.objects.all()[:3]
for u in users:
    print(f"User: {u.email}, Hash: {repr(u.password)}, Active: {u.active}")
