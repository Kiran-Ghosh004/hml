import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import StackingClassifier
from sklearn.metrics import accuracy_score, classification_report

# -----------------------------
# 1. LOAD DATASET
# -----------------------------
csv_path = "karnataka_irrigation_dataset.csv"
df = pd.read_csv(csv_path)

print("Dataset Loaded Successfully")
print(df.head())
print("\n\n")

# -----------------------------
# 2. DEFINE FEATURES & TARGET
# -----------------------------
target_col = "irrigation_needed"
X = df.drop(columns=[target_col])
y = df[target_col]

numeric_cols = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
categorical_cols = X.select_dtypes(include=["object"]).columns.tolist()

print("Numeric Columns:", numeric_cols)
print("Categorical Columns:", categorical_cols)

# -----------------------------
# 3. PREPROCESSING PIPELINES
# -----------------------------
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encode", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipeline, numeric_cols),
    ("cat", categorical_pipeline, categorical_cols)
])

# -----------------------------
# 4. HYBRID MODEL (STACKING)
# -----------------------------
estimators = [
    ("rf", RandomForestClassifier(n_estimators=100, random_state=42)),
    ("gb", GradientBoostingClassifier(n_estimators=100, random_state=42)),
    ("svc", SVC(probability=True, kernel="rbf"))
]

stacked_model = StackingClassifier(
    estimators=estimators,
    final_estimator=LogisticRegression(),
    cv=5
)

model_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", stacked_model)
])

# -----------------------------
# 5. SPLIT + TRAINING
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

print("Training model...")
model_pipeline.fit(X_train, y_train)
print("Training complete!")

# -----------------------------
# 6. EVALUATION
# -----------------------------
y_pred = model_pipeline.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"\nTest Accuracy: {acc*100:.2f}%\n")
print("Classification Report:\n", classification_report(y_test, y_pred))

# -----------------------------
# 7. SAVE MODEL + METADATA
# -----------------------------
os.makedirs("model_artifacts", exist_ok=True)

model_path = "model_artifacts/stacking_irrigation_model.joblib"
meta_path = "model_artifacts/model_meta.joblib"

joblib.dump(model_pipeline, model_path)
joblib.dump(
    {
        "numeric_cols": numeric_cols,
        "categorical_cols": categorical_cols,
        "target_col": target_col,
        "model_path": model_path
    },
    meta_path
)

print(f"\nModel saved at: {model_path}")
print(f"Metadata saved at: {meta_path}")
print("\nAll done! 🚀")
