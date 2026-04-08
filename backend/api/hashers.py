from django.contrib.auth.hashers import BasePasswordHasher
import bcrypt

class RawBcryptPasswordHasher(BasePasswordHasher):
    """
    Password hasher that supports raw bcrypt hashes ($2a$, $2b$, $2y$).
    """
    algorithm = "bcrypt_raw"

    def verify(self, password, encoded):
        password_bytes = password.encode('utf-8')
        encoded_bytes = encoded.encode('utf-8')
        try:
            return bcrypt.checkpw(password_bytes, encoded_bytes)
        except ValueError:
            return False

    def encode(self, password, salt):
        raise NotImplementedError("Use another hasher to encode new passwords")

    def safe_summary(self, encoded):
        return {
            "algorithm": self.algorithm,
            "hash": encoded[:5] + "...",
        }
