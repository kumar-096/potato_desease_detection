from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta

from database import SessionLocal, engine, Base
from models import User
from auth_utils import (
    hash_password,
    verify_password,
    normalize_email,
    normalize_phone,
)

# ===============================
# CONFIG
# ===============================
SECRET_KEY = "CHANGE_THIS_SECRET"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter()
security = HTTPBearer()

Base.metadata.create_all(bind=engine)

# ===============================
# DB DEPENDENCY
# ===============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===============================
# TOKEN HELPERS
# ===============================
def create_access_token(user: User):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "user_id": user.id,
        "role": user.role,
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


def get_current_user(
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def require_role(required_role: str):
    def role_checker(user: User = Depends(get_current_user)):
        if user.role != required_role:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions",
            )
        return user
    return role_checker

# ===============================
# SIGNUP
# ===============================
@router.post("/signup")
def signup(data: dict, db: Session = Depends(get_db)):
    email = normalize_email(data.get("email"))
    phone = normalize_phone(data.get("phone"))
    password = data.get("password")

    if not password:
        raise HTTPException(status_code=400, detail="Password required")

    if not email and not phone:
        raise HTTPException(status_code=400, detail="Email or phone required")

    if email and db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if phone and db.query(User).filter(User.phone == phone).first():
        raise HTTPException(status_code=400, detail="Phone already registered")

    user = User(
        email=email,
        phone=phone,
        password=hash_password(password),
        role="farmer",  # DEFAULT ROLE
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}

# ===============================
# LOGIN
# ===============================
@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = normalize_email(data.get("email"))
    phone = normalize_phone(data.get("phone"))
    password = data.get("password")

    if email:
        user = db.query(User).filter(User.email == email).first()
    elif phone:
        user = db.query(User).filter(User.phone == phone).first()
    else:
        raise HTTPException(status_code=400, detail="Email or phone required")

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user)

    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
        },
    }

# ===============================
# VERIFY TOKEN
# ===============================
@router.get("/verify-token")
def verify(user: User = Depends(get_current_user)):
    return {
        "valid": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
        },
    }
