import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import seaborn as sns
import pickle

from sklearn.preprocessing import StandardScaler


df = pd.read_csv("train.csv")

sns.countplot(x="Loan_Status", data=df)
sns.scatterplot(x="ApplicantIncome", y="LoanAmount", data=df)
sns.countplot(x="Credit_History", hue="Loan_Status", data=df)

df.fillna({
    "LoanAmount": df["LoanAmount"].median(),
    "ApplicantIncome": df["ApplicantIncome"].median(),
    "Credit_History": df["Credit_History"].mode()[0]
}, inplace=True)



# 🔧 Outlier Handling (Correct)
# for col in ["ApplicantIncome", "LoanAmount"]:
#     Q1 = df[col].quantile(0.25)
#     Q3 = df[col].quantile(0.75)
#     IQR = Q3 - Q1

#     lower = Q1 - 1.5 * IQR
#     upper = Q3 + 1.5 * IQR

#     df[col] = df[col].apply(
#         lambda x: df[col].median() if x < lower or x > upper else x
#     )

df["LoanRatio"] = df["LoanAmount"] / (df["ApplicantIncome"] + 1)
df=df[["ApplicantIncome","LoanAmount","Credit_History","Loan_Status"]]

df["Loan_Status"] = df["Loan_Status"].map({"Y": 1, "N": 0})

# Encode categorical
# le = LabelEncoder()
# for col in df.columns:
#     if df[col].dtype == 'object':
#         df[col] = le.fit_transform(df[col])



X = df.drop("Loan_Status", axis=1)
y = df["Loan_Status"]


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


model = RandomForestClassifier(
    n_estimators=150,
    max_depth=6,
    random_state=42
)
model.fit(X_train, y_train)


acc = model.score(X_test, y_test)
print("Accuracy:", acc)


with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model ready!")
