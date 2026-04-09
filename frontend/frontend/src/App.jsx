import { Navigate, Route, Routes } from "react-router-dom";
import TopNav from "./components/TopNav";
import ClaimsPage from "./pages/ClaimsPage";
import AuditLogPage from "./pages/AuditLogPage";
import BatchPage from "./pages/BatchPage";
import SystemPage from "./pages/SystemPage";

function App() {
  return (
    <div className="app-shell">
      <TopNav />
      <main className="content-area">
        <Routes>
          <Route path="/" element={<Navigate to="/claims" replace />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/audit-log" element={<AuditLogPage />} />
          <Route path="/batch" element={<BatchPage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="*" element={<Navigate to="/claims" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
