import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Users
users = Users.objects.all()[:3]
with open('hash_output.txt', 'w') as f:
    for u in users:
        f.write(f"{u.email} | {u.password}\n")
