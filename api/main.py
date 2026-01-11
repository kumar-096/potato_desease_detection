from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
from tensorflow import keras

app = FastAPI()

MODEL_PATH = "/app/models/potato_disease_model_v3.keras"
MODEL = keras.models.load_model(MODEL_PATH)

CLASS_NAMES = [
    "Non_leaf",
    "Potato___Early_blight",
    "Potato___Healthy",
    "Potato___Late_blight"
]


@app.get("/ping")
async def ping():
    return {"message": "I am alive"}

def read_image(data):
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image).astype(np.float32) / 255.0

    return image.astype(np.float32)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_image(await file.read())
    image = np.expand_dims(image, axis=0)

    predictions = MODEL.predict(image)
    predictions = MODEL.predict(image)[0]
    confidence = float(np.max(predictions))
    class_index = int(np.argmax(predictions))
    predicted_class = CLASS_NAMES[class_index]

# Low confidence case
    if confidence < 0.5:
        return {
            "prediction": "Unknown",
            "confidence": confidence,
            "message": "Please upload a clear potato leaf image"
        }

# Non-leaf case
    if predicted_class == "Non_leaf":
        return {
            "prediction": "Not a Potato Leaf",
            "confidence": confidence,
            "message": "Please upload a potato leaf image"
        }

# Valid potato leaf
    return {
        "prediction": predicted_class.replace("Potato___", "").replace("_", " "),
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
