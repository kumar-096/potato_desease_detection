from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
from tensorflow import keras

app = FastAPI()

MODEL_PATH = "/app/model/model_version1.keras"
MODEL = keras.models.load_model(MODEL_PATH)

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return {"message": "I am alive"}

def read_image(data):
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((256, 256))
    image = np.array(image) / 255.0
    return image.astype(np.float32)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_image(await file.read())
    image = np.expand_dims(image, axis=0)

    predictions = MODEL.predict(image)
    predicted_class = CLASS_NAMES[int(np.argmax(predictions[0]))]
    confidence = float(np.max(predictions[0]))

    return {"prediction": predicted_class, "confidence": confidence}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
