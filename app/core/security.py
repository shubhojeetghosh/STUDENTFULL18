from datetime import datetime, timedelta, timezone
import hashlib

from passlib.context import CryptContext
from jose import jwt

from app.core.config import settings


# =========================================================
# PASSWORD HASHING
# =========================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """
    Hash a user's password using bcrypt.
    """
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verify a plain password against its bcrypt hash.
    """
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# =========================================================
# JWT ACCESS TOKEN
# =========================================================

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None
) -> str:
    """
    Create a JWT access token.
    """

    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


# =========================================================
# OTP HASHING
# =========================================================

def hash_otp(otp: str) -> str:
    """
    Hash OTP using SHA-256.

    We do NOT use bcrypt for OTP because OTP hashing
    does not need password hashing and avoids bcrypt/
    Passlib compatibility problems.
    """

    return hashlib.sha256(
        otp.encode("utf-8")
    ).hexdigest()


def verify_otp(
    plain_otp: str,
    hashed_otp: str
) -> bool:
    """
    Verify an OTP against its SHA-256 hash.
    """

    return hash_otp(plain_otp) == hashed_otp