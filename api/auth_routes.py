from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt
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
def create_access_token(subject: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

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
        password=hash_password(password)
    )
    db.add(user)
    db.commit()

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
        identity = email
    elif phone:
        user = db.query(User).filter(User.phone == phone).first()
        identity = phone
    else:
        raise HTTPException(status_code=400, detail="Email or phone required")

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(identity)

    return {
        "access_token": token,
        "user": {
            "email": user.email,
            "phone": user.phone
        }
    }

# ===============================
# VERIFY TOKEN
# ===============================
@router.get("/verify-token")
def verify(identity: str = Depends(verify_token)):
    return {"valid": True, "user": identity}
