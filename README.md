# ClaimTrace AI

Explainable AI decision system for insurance claims.

## Setup Instructions

1. **Clone the repository.**
2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```
3. **Configure Environment Variables**:
   - Create a `.env.local` file in the `frontend/` directory.
   - Add your OpenAI API key:
     ```
     VITE_OPENAI_API_KEY=your_key_here
     ```
   *(Note: Use `VITE_` prefix for Vite client-side access, or ensure matching with orchestrator logic)*
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Access the application**:
   - Open `http://localhost:5173` in your browser.

## Features
- 5-stage sequential reasoning.
- Real-time audit trail visualization.
- Deterministic outcomes for demo claims (C1, C2, C3).
- Structured JSON export.
