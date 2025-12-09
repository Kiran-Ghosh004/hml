import joblib
import pandas as pd
from typing import Dict

_model = None
_meta = None

def load_model():
    global _model, _meta

    if _model is None or _meta is None:
        meta_path = "model_artifacts/model_meta.joblib"  # ← FIXED PATH
        _meta = joblib.load(meta_path)
        _model = joblib.load(_meta["model_path"])

    return _model, _meta



def prepare_input(features: Dict):
    """
    Convert incoming JSON to DataFrame in correct column order.
    """
    _, meta = load_model()

    numeric = meta["numeric_cols"]
    categorical = meta["categorical_cols"]

    data = {}

    # ensure columns exist
    for col in numeric + categorical:
        data[col] = features.get(col, None)

    df = pd.DataFrame([data])
    return df
