from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # sabko allow
    allow_methods=["*"],
    allow_headers=["*"],
)
model = pickle.load(open("model.pkl", "rb"))

@app.get("/")
def home():
    return {"message": "Loan API running 🔥"}
class LoanInput(BaseModel):
    income: float
    loan_amount: float
    credit_history: int

@app.post("/predict")
def predict(data: LoanInput):
    values = [data.income, data.loan_amount, data.credit_history]
    result = model.predict([values])
    return {"prediction": int(result[0])}

