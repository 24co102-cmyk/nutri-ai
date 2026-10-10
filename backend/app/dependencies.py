from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

# Import sibling modules within the same package
from . import models, schemas, utils
from .database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(
    db: Session = Depends(get_db)
) -> models.User:
    """Return a default user for no-auth mode.
    If a user exists, return the first one; otherwise create a guest user.
    """
    user = db.query(models.User).first()
    if not user:
        guest = models.User(
            name="guest",
            email="guest@example.com",
            hashed_password="guestpasswordhash"
        )
        db.add(guest)
        db.commit()
        db.refresh(guest)
        user = guest
    return user
