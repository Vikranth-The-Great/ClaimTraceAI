import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import TopNav from "./components/TopNav";
import ClaimsPage from "./pages/ClaimsPage";
import AuditLogPage from "./pages/AuditLogPage";
import BatchPage from "./pages/BatchPage";
import SystemPage from "./pages/SystemPage";

const App: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-[#F9FAFB] font-sans antialiased text-gray-900 overflow-hidden">
      <TopNav />
      <div className="flex-1 flex overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/claims" replace />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/audit-log" element={<AuditLogPage />} />
          <Route path="/batch" element={<BatchPage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="*" element={<Navigate to="/claims" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
