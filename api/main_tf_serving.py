from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf

from auth_routes import router as auth_router
from auth_routes import get_current_user, require_role

app = FastAPI()

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ LOAD V3 MODEL DIRECTLY
MODEL_PATH = "/app/models/potato_model_v3_saved"
model = tf.keras.models.load_model(MODEL_PATH, compile=False)


# ✅ 4 CLASSES (MATCH TRAINING)
import json

with open("/app/models/class_names.json", "r") as f:
    CLASS_NAMES = json.load(f)

print("✅ Loaded class order:", CLASS_NAMES)


def preprocess_image(data):
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image).astype(np.float32) / 255.0
    image = np.expand_dims(image, axis=0)
    return image


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    user=Depends(require_role("farmer"))
):
    image = preprocess_image(await file.read())

    predictions = model.predict(image)[0]
    confidence = float(np.max(predictions))
    class_index = int(np.argmax(predictions))
    predicted_class = CLASS_NAMES[class_index]

    # 🔴 LOW CONFIDENCE
    if confidence < 0.5:
        return {
            "prediction": "Unknown",
            "confidence": confidence,
            "message": "Please upload a clear potato leaf image",
            "user_id": user.id
        }

    # 🔴 NON-LEAF HANDLING
    if predicted_class == "Non_leaf":
        return {
            "prediction": "Not a Potato Leaf",
            "confidence": confidence,
            "message": "Please upload a potato leaf image",
            "user_id": user.id
        }

    # 🟢 VALID POTATO LEAF
    return {
        "prediction": predicted_class.replace("Potato___", "").replace("_", " "),
        "confidence": confidence,
        "user_id": user.id
    }
