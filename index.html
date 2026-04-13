"""
Firebase ID Token verification middleware.
All protected routes must call verify_token() as a FastAPI dependency.
"""
from fastapi import Header, HTTPException, status
from firebase_admin import auth
import os

# In dev mode, skip token verification if SKIP_AUTH=true
SKIP_AUTH = os.getenv("SKIP_AUTH", "false").lower() == "true"

async def verify_token(authorization: str = Header(None)) -> dict:
    """
    FastAPI dependency that verifies Firebase ID token from Authorization header.
    Usage: current_user: dict = Depends(verify_token)
    """
    if SKIP_AUTH:
        # Dev mode — return mock user
        return {"uid": "dev-user", "dev": True}

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format. Expected: Bearer <token>",
        )

    token = parts[1]
    try:
        decoded = auth.verify_id_token(token)
        return decoded
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please re-login.",
        )
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token. Authentication failed.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
        )
