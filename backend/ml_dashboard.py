import streamlit as st
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (accuracy_score, classification_report,
                             confusion_matrix, roc_auc_score, roc_curve)
import warnings
warnings.filterwarnings("ignore")

# ── Page config ─────────────────────────────────────────────────────────────
st.set_page_config(page_title="LoanAI Dashboard", layout="wide", page_icon="🏦")

st.markdown("""
<style>
    .metric-card {
        background: #1e1e2e;
        border-radius: 10px;
        padding: 1rem 1.5rem;
        border-left: 4px solid #7c3aed;
    }
    .section-divider { border-top: 2px solid #7c3aed; margin: 1rem 0; }
</style>
""", unsafe_allow_html=True)

st.title("🏦 LoanAI — Complete ML Pipeline Dashboard")
st.caption("End-to-end: Data → Preprocessing → EDA → Model Training → Prediction")

# ── Load data ────────────────────────────────────────────────────────────────
@st.cache_data
def load_data():
    return pd.read_csv("train.csv")

df_original = load_data()

# ═══════════════════════════════════════════════════════════════════════
# 1. RAW DATA
# ═══════════════════════════════════════════════════════════════════════
st.header("1. 📂 Raw Dataset")
col1, col2, col3, col4 = st.columns(4)
col1.metric("Rows", df_original.shape[0])
col2.metric("Columns", df_original.shape[1])
col3.metric("Missing Values", df_original.isnull().sum().sum())
col4.metric("Loan Approval Rate",
            f"{(df_original['Loan_Status']=='Y').mean()*100:.1f}%")

st.dataframe(df_original.head(10), use_container_width=True)

with st.expander("📊 Data Types & Info"):
    info_df = pd.DataFrame({
        "Column": df_original.columns,
        "Dtype": df_original.dtypes.values,
        "Non-Null": df_original.count().values,
        "Missing": df_original.isnull().sum().values,
        "Unique": df_original.nunique().values
    })
    st.dataframe(info_df, use_container_width=True)

# ═══════════════════════════════════════════════════════════════════════
# 2. FEATURE SELECTION
# ═══════════════════════════════════════════════════════════════════════
st.header("2. 🎯 Feature Selection")

all_features = [c for c in df_original.columns if c not in ["Loan_ID", "Loan_Status"]]

selected_features = st.multiselect(
    "Select features to include in the pipeline:",
    all_features,
    default=["Gender", "Married", "Education", "ApplicantIncome",
             "CoapplicantIncome", "LoanAmount", "Loan_Amount_Term",
             "Credit_History", "Property_Area"]
)

if not selected_features:
    st.warning("⚠️ Kam se kam ek feature select karo.")
    st.stop()

df = df_original[selected_features + ["Loan_Status"]].copy()
st.success(f"✅ {len(selected_features)} features selected.")
st.dataframe(df.head(), use_container_width=True)

# ═══════════════════════════════════════════════════════════════════════
# 3. MISSING VALUE HANDLING
# ═══════════════════════════════════════════════════════════════════════
st.header("3. 🩹 Missing Value Handling")

missing_before = df.isnull().sum()
miss_df = pd.DataFrame({"Missing Count": missing_before,
                         "Missing %": (missing_before / len(df) * 100).round(2)})
miss_df = miss_df[miss_df["Missing Count"] > 0]

if miss_df.empty:
    st.info("No missing values found.")
else:
    st.write("**Before Handling:**")
    st.dataframe(miss_df, use_container_width=True)

    if st.checkbox("✅ Apply Missing Value Handling", value=True):
        for col in df.columns:
            if df[col].isnull().sum() == 0:
                continue
            if df[col].dtype in ["int64", "float64"]:
                df[col].fillna(df[col].median(), inplace=True)
            else:
                df[col].fillna(df[col].mode()[0], inplace=True)

        st.success("✅ Missing values handled!")
        missing_after = df.isnull().sum()
        st.write("**After Handling:**")
        st.dataframe(pd.DataFrame({"Missing Count": missing_after}),
                     use_container_width=True)

# ═══════════════════════════════════════════════════════════════════════
# 4. OUTLIER DETECTION
# ═══════════════════════════════════════════════════════════════════════
st.header("4. 🔍 Outlier Detection")

num_cols = [c for c in df.select_dtypes(include=["int64","float64"]).columns
            if c != "Loan_Status"]

if num_cols:
    n = len(num_cols)
    cols_per_row = 3
    rows = (n + cols_per_row - 1) // cols_per_row
    fig, axes = plt.subplots(rows, cols_per_row,
                             figsize=(6 * cols_per_row, 4 * rows))
    axes = np.array(axes).flatten()

    for i, col in enumerate(num_cols):
        sns.boxplot(x=df[col], ax=axes[i], color="#7c3aed")
        axes[i].set_title(f"{col}", fontsize=11)
        axes[i].tick_params(labelsize=9)

    for j in range(i + 1, len(axes)):
        axes[j].set_visible(False)

    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

    if st.checkbox("✅ Apply Outlier Handling (IQR Capping)"):
        for col in num_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - 1.5 * IQR
            upper = Q3 + 1.5 * IQR
            df[col] = df[col].clip(lower, upper)
        st.success("✅ Outliers capped using IQR method!")

# ═══════════════════════════════════════════════════════════════════════
# 5. ENCODING CATEGORICAL FEATURES
# ═══════════════════════════════════════════════════════════════════════
st.header("5. 🔡 Categorical Encoding")

# Encode target first
df["Loan_Status"] = df["Loan_Status"].map({"Y": 1, "N": 0})

cat_cols = df.select_dtypes(include=["object"]).columns.tolist()

if cat_cols:
    st.write(f"Categorical columns found: **{', '.join(cat_cols)}**")

    enc_method = st.radio("Encoding method:",
                          ["Label Encoding", "One-Hot Encoding"],
                          horizontal=True)

    df_encoded = df.copy()
    if enc_method == "Label Encoding":
        le = LabelEncoder()
        for col in cat_cols:
            df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
        st.success("✅ Label encoding applied!")
    else:
        df_encoded = pd.get_dummies(df_encoded, columns=cat_cols, drop_first=True)
        st.success("✅ One-hot encoding applied!")

    st.dataframe(df_encoded.head(), use_container_width=True)
else:
    df_encoded = df.copy()
    st.info("No categorical columns to encode.")

# ═══════════════════════════════════════════════════════════════════════
# 6. FEATURE SCALING
# ═══════════════════════════════════════════════════════════════════════
st.header("6. ⚖️ Feature Scaling")

scale_candidates = [c for c in df_encoded.select_dtypes(
    include=["int64","float64"]).columns if c != "Loan_Status"]

if st.checkbox("✅ Apply Standard Scaling"):
    st.write("**Before Scaling (first 3 rows):**")
    st.dataframe(df_encoded[scale_candidates].head(3), use_container_width=True)

    scaler = StandardScaler()
    df_scaled = df_encoded.copy()
    df_scaled[scale_candidates] = scaler.fit_transform(df_scaled[scale_candidates])

    st.write("**After Scaling:**")
    st.dataframe(df_scaled.head(3), use_container_width=True)
    df_model = df_scaled
else:
    df_model = df_encoded

# ═══════════════════════════════════════════════════════════════════════
# 7. EDA VISUALIZATIONS
# ═══════════════════════════════════════════════════════════════════════
st.header("7. 📊 Exploratory Data Analysis")

# Use original (pre-encoding) df for readable EDA
df_eda = df_original[selected_features + ["Loan_Status"]].copy()
for col in df_eda.columns:
    if df_eda[col].isnull().sum() > 0:
        if df_eda[col].dtype in ["int64","float64"]:
            df_eda[col].fillna(df_eda[col].median(), inplace=True)
        else:
            df_eda[col].fillna(df_eda[col].mode()[0], inplace=True)

c1, c2 = st.columns(2)

with c1:
    fig, ax = plt.subplots(figsize=(5, 4))
    counts = df_eda["Loan_Status"].value_counts()
    ax.pie(counts, labels=["Approved (Y)", "Rejected (N)"],
           autopct="%1.1f%%", colors=["#7c3aed","#e879f9"],
           startangle=90)
    ax.set_title("Loan Status Distribution")
    st.pyplot(fig); plt.close()

with c2:
    if "Credit_History" in df_eda.columns:
        fig, ax = plt.subplots(figsize=(5, 4))
        sns.countplot(x="Credit_History", hue="Loan_Status",
                      data=df_eda, ax=ax,
                      palette={"Y":"#7c3aed","N":"#e879f9"})
        ax.set_title("Credit History vs Loan Status")
        st.pyplot(fig); plt.close()

if "ApplicantIncome" in df_eda.columns and "LoanAmount" in df_eda.columns:
    fig, ax = plt.subplots(figsize=(8, 4))
    sns.scatterplot(x="ApplicantIncome", y="LoanAmount",
                    hue="Loan_Status", data=df_eda, ax=ax,
                    palette={"Y":"#7c3aed","N":"#e879f9"}, alpha=0.7)
    ax.set_title("Income vs Loan Amount")
    st.pyplot(fig); plt.close()

# Correlation heatmap (numeric only)
num_for_corr = df_encoded.select_dtypes(include=["int64","float64"])
if num_for_corr.shape[1] > 1:
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.heatmap(num_for_corr.corr(), annot=True, fmt=".2f",
                cmap="Purples", ax=ax, linewidths=0.5)
    ax.set_title("Feature Correlation Heatmap")
    st.pyplot(fig); plt.close()

# ═══════════════════════════════════════════════════════════════════════
# 8. FINAL PROCESSED DATA
# ═══════════════════════════════════════════════════════════════════════
st.header("8. ✅ Final Processed Data")
st.dataframe(df_model.head(10), use_container_width=True)
st.caption(f"Shape: {df_model.shape[0]} rows × {df_model.shape[1]} columns")

# ═══════════════════════════════════════════════════════════════════════
# 9. MODEL TRAINING & EVALUATION
# ═══════════════════════════════════════════════════════════════════════
st.header("9. 🤖 Model Training & Evaluation")

feature_cols = [c for c in df_model.columns if c != "Loan_Status"]
X = df_model[feature_cols]
y = df_model["Loan_Status"]

# Drop rows with any remaining NaN
mask = X.notna().all(axis=1) & y.notna()
X, y = X[mask], y[mask]

test_size = st.slider("Test set size (%)", 10, 40, 20, 5)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=test_size/100, random_state=42, stratify=y)

st.write(f"Train: **{len(X_train)}** rows | Test: **{len(X_test)}** rows")

model_choice = st.selectbox(
    "Select model:",
    ["Logistic Regression", "Random Forest", "Gradient Boosting"]
)

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42)
}

if st.button("🚀 Train Model", type="primary"):
    with st.spinner("Training..."):
        model = models[model_choice]
        model.fit(X_train, y_train)

        # ✅ FIXED: Save both model AND feature_cols in session_state
        st.session_state.model = model
        st.session_state.feature_cols = feature_cols
        st.session_state.df_eda = df_eda

        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]

        acc = accuracy_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_prob)

    # Metrics
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Accuracy", f"{acc*100:.2f}%")
    m2.metric("ROC-AUC", f"{auc:.4f}")
    m3.metric("Train Size", len(X_train))
    m4.metric("Test Size", len(X_test))

    c1, c2 = st.columns(2)

    # Confusion matrix
    with c1:
        st.subheader("Confusion Matrix")
        cm = confusion_matrix(y_test, y_pred)
        fig, ax = plt.subplots(figsize=(4, 3))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Purples",
                    xticklabels=["Rejected","Approved"],
                    yticklabels=["Rejected","Approved"], ax=ax)
        ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
        st.pyplot(fig); plt.close()

    # ROC curve
    with c2:
        st.subheader("ROC Curve")
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        fig, ax = plt.subplots(figsize=(4, 3))
        ax.plot(fpr, tpr, color="#7c3aed", lw=2,
                label=f"AUC = {auc:.3f}")
        ax.plot([0,1],[0,1],"k--", lw=1)
        ax.set_xlabel("False Positive Rate")
        ax.set_ylabel("True Positive Rate")
        ax.set_title("ROC Curve")
        ax.legend()
        st.pyplot(fig); plt.close()

    # Classification report
    with st.expander("📋 Full Classification Report"):
        report = classification_report(y_test, y_pred,
                                       target_names=["Rejected","Approved"])
        st.code(report)

    # Feature importance (if applicable)
    if hasattr(model, "feature_importances_"):
        st.subheader("Feature Importance")
        imp = pd.Series(model.feature_importances_, index=feature_cols)\
                .sort_values(ascending=False).head(10)
        fig, ax = plt.subplots(figsize=(8, 4))
        imp.plot(kind="bar", ax=ax, color="#7c3aed")
        ax.set_title("Top Feature Importances")
        ax.set_ylabel("Importance")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    elif hasattr(model, "coef_"):
        st.subheader("Feature Coefficients")
        coef = pd.Series(np.abs(model.coef_[0]), index=feature_cols)\
                 .sort_values(ascending=False).head(10)
        fig, ax = plt.subplots(figsize=(8, 4))
        coef.plot(kind="bar", ax=ax, color="#7c3aed")
        ax.set_title("Top Feature Coefficients (absolute)")
        ax.set_ylabel("|Coefficient|")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        st.pyplot(fig); plt.close()

    st.success("✅ Model trained successfully! Ab Section 10 mein predict kar sakte ho.")

# ═══════════════════════════════════════════════════════════════════════
# 10. LIVE PREDICTION
# ═══════════════════════════════════════════════════════════════════════
st.header("10. 🎯 Live Loan Prediction")

with st.form("predict_form"):
    pc1, pc2, pc3 = st.columns(3)

    with pc1:
        p_income = st.number_input("Applicant Income", 0, 100000, 5000, 500)
        p_co_income = st.number_input("Co-applicant Income", 0, 50000, 0, 500)
        p_loan = st.number_input("Loan Amount (thousands)", 0, 700, 150, 10)

    with pc2:
        p_term = st.selectbox("Loan Term (months)", [360, 180, 120, 84, 60, 36, 12])
        p_credit = st.selectbox("Credit History", [1.0, 0.0],
                                format_func=lambda x: "Good (1)" if x == 1 else "Bad (0)")
        p_gender = st.selectbox("Gender", ["Male", "Female"])

    with pc3:
        p_married = st.selectbox("Married", ["Yes", "No"])
        p_edu = st.selectbox("Education", ["Graduate", "Not Graduate"])
        p_area = st.selectbox("Property Area", ["Urban", "Semiurban", "Rural"])

    submitted = st.form_submit_button("🔍 Predict Loan Status", type="primary")

if submitted:
    # ✅ FIXED: Check session_state before predicting
    if "model" not in st.session_state:
        st.warning("⚠️ Pehle Section 9 mein model train karo, phir predict karo!")
        st.stop()

    # ✅ FIXED: Load model and feature_cols from session_state
    model = st.session_state.model
    feature_cols = st.session_state.feature_cols
    df_eda = st.session_state.df_eda

    # Build a single row matching the training pipeline
    input_dict = {
        "ApplicantIncome": p_income,
        "CoapplicantIncome": p_co_income,
        "LoanAmount": p_loan,
        "Loan_Amount_Term": p_term,
        "Credit_History": p_credit,
        "Gender": p_gender,
        "Married": p_married,
        "Education": p_edu,
        "Property_Area": p_area,
        "Dependents": "0",
        "Self_Employed": "No"
    }

    # Filter to selected features only
    input_row = {k: v for k, v in input_dict.items() if k in selected_features}
    input_df = pd.DataFrame([input_row])

    # Encode categoricals same way
    for col in input_df.select_dtypes(include="object").columns:
        le2 = LabelEncoder()
        combined = pd.concat([df_eda[col], input_df[col]], ignore_index=True)
        le2.fit(combined.astype(str))
        input_df[col] = le2.transform(input_df[col].astype(str))

    # Align columns
    for col in feature_cols:
        if col not in input_df.columns:
            input_df[col] = 0
    input_df = input_df[feature_cols]

    try:
        pred = model.predict(input_df)[0]
        prob = model.predict_proba(input_df)[0][1]

        if pred == 1:
            st.success(f"✅ **LOAN APPROVED** — Confidence: {prob*100:.1f}%")
        else:
            st.error(f"❌ **LOAN REJECTED** — Approval probability: {prob*100:.1f}%")

        st.progress(float(prob), text=f"Approval probability: {prob*100:.1f}%")
    except Exception as e:
        st.error(f"Prediction Error: {e}")