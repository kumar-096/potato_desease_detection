from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"])

SECRET_KEY = "change_this_later"
ALGORITHM = "HS256"

# Demo user
USER = {
    "email": "admin@test.com",
    "password": pwd_context.hash("admin123")
}

@router.post("/login")
def login(data: dict):
    if data["email"] != USER["email"] or not pwd_context.verify(
        data["password"], USER["password"]
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {
            "sub": USER["email"],
            "exp": datetime.utcnow() + timedelta(hours=4)
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {"access_token": token}
