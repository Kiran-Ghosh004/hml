from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from model_utils import load_model, prepare_input

app = FastAPI(title="Smart Irrigation ML API")


class PredictRequest(BaseModel):
    features: Dict[str, Any]
    threshold: float = 0.5   # default decision boundary


@app.on_event("startup")
def load_on_start():
    model, meta = load_model()
    print("ML Model Loaded Successfully!")
    print("Target Column:", meta["target_col"])


@app.get("/health")
def health():
    return {"status": "OK", "message": "Backend Running"}


@app.post("/predict")
def predict(req: PredictRequest):

    try:
        model, meta = load_model()
        df = prepare_input(req.features)

        # model outputs probability for irrigation = 1
        prob = model.predict_proba(df)[0][1]

        decision = int(prob >= req.threshold)

        return {
            "decision": decision,
            "probability": float(prob),
            "threshold": req.threshold
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
