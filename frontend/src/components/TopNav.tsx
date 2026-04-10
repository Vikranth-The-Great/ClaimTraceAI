import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNav: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 h-[64px] flex items-center px-8 justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px]">analytics</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900 leading-none tracking-tight">ClaimTrace AI</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Audit Workspace</span>
          </div>
        </div>
        
        <div className="h-6 w-[1px] bg-gray-100 mx-2" />

        <div className="flex items-center gap-1">
          <NavLink 
            to="/claims" 
            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Claims Dashboard
          </NavLink>
          <NavLink 
            to="/audit-log" 
            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Audit Log
          </NavLink>
          <NavLink 
            to="/analytics" 
            className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Analytics
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-black text-gray-500 border border-gray-200">
          AD
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
