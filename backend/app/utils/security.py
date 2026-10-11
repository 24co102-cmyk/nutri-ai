import os
from datetime import datetime, timedelta
from typing import Optional

from passlib.context import CryptContext
from jose import JWTError, jwt

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

import hashlib
try:
    import bcrypt
except ImportError:
    bcrypt = None

def hash_password(password: str) -> str:
    # 1. Try bcrypt directly
    if bcrypt:
        try:
            salt = bcrypt.gensalt()
            return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
        except Exception:
            pass
    # 2. Try passlib
    try:
        return pwd_context.hash(password)
    except Exception:
        pass
    # 3. Fallback to SHA-256
    return "sha256$" + hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password or not plain_password:
        return False
    # 1. Direct bcrypt check
    if bcrypt and hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            pass
    # 2. SHA-256 check
    if hashed_password.startswith("sha256$"):
        expected = "sha256$" + hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
        return hashed_password == expected
    # 3. Passlib check
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        pass
    # 4. Plaintext fallback
    return plain_password == hashed_password



# JWT handling
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    secret_key = os.getenv("JWT_SECRET", "change_this_secret")
    algorithm = "HS256"
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    secret_key = os.getenv("JWT_SECRET", "change_this_secret")
    algorithm = "HS256"
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    except JWTError:
        return None
