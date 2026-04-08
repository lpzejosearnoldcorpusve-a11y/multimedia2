import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth.hashers import identify_hasher, check_password, get_hasher

hash_str = "$2b$10$1fhF6INMjNW0Bdq.MuobzOBfCtPoKROUwwyAmrA8HKH6Q6FOzcet2"

try:
    hasher = identify_hasher(hash_str)
    print("Identified hasher:", hasher.algorithm)
except Exception as e:
    print("Error identifying hasher:", repr(e))

print("Is password correct (testing):", check_password("password_here", hash_str))
