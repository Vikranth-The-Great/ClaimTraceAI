# ClaimTrace AI — Audit-Ready Insurance Intelligence

> An explainable, audit-ready AI decision system that processes insurance claims through 5 sequential reasoning stages — producing a full, structured audit trail with confidence scores and source citations for every step.

## 🚀 Key Features
- **Sequential 5-Stage Reasoning**: Watch the AI "think" through Claim Analysis, Coverage, Documents, Fraud, and Decision.
- **Explainable AI (XAI)**: Every decision comes with a full audit log and specific source citations.
- **Analytics Intelligence Dashboard**: Real-time reporting on approval rates, risk signals, and confidence distribution.
- **Audit Trails**: Copy or Export 1:1 JSON audit logs for any decision.
- **Session Persistence**: Historical audits are saved locally and can be replayed at any time.

## 🛠 Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- OpenAI API Key

### 2. Installation
```bash
git clone https://github.com/Vikranth-The-Great/ClaimTraceAI.git
cd ClaimTraceAI/frontend
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the `frontend/` directory:
```env
# Mandatory for the AI pipeline
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

## 🧪 Demo Scenarios (C1, C2, C3)
- **C1 (Rejected)**: Third-party policy with own-damage.
- **C2 (Approved)**: Standard comprehensive claim with clean documentation.
- **C3 (Pending)**: High fraud-risk (₹95k for a scratch) and high claim frequency.

## 📄 License
MIT License. Built for professional insurance auditability.
