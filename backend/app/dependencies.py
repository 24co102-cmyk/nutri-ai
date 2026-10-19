from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from . import models
from .database import get_db
from .utils.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """
    Authenticate request via JWT Bearer token and enforce strict user data isolation.
    Rejects unauthenticated requests with HTTP 401 Unauthorized.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("user_id")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user account not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[models.User]:
    """
    Extracts the authenticated user if a valid JWT token is provided.
    Does not raise 401 if unauthenticated, allowing public read-only catalog browsing.
    """
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        if not payload or "user_id" not in payload:
            return None
        user_id = payload.get("user_id")
        return db.query(models.User).filter(models.User.id == user_id).first()
    except Exception:
        return None

