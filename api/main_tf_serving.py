from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import numpy as np
import requests
from auth import router as auth_router


app = FastAPI()
from auth_routes import router as auth_router
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
TF_SERVING_URL = "http://tf_serving:8501/v1/models/potato_model:predict"
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]


def preprocess_image(data):
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image).astype(np.float32)

    # MobileNet preprocessing
    image = (image / 127.5) - 1.0
    return image.tolist()


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = preprocess_image(await file.read())
    payload = {"instances": [image]}

    try:
        response = requests.post(
            TF_SERVING_URL,
            json=payload,
            timeout=5
        )
    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=503,
            detail="TF Serving unavailable"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=503,
            detail="Model prediction failed"
        )

    predictions = response.json()["predictions"][0]
    index = int(np.argmax(predictions))

    return {
        "prediction": CLASS_NAMES[index],
        "confidence": float(np.max(predictions)),
    }
