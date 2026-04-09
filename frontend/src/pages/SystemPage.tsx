import React from 'react';

const SystemPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Configuration</h1>
          <p className="text-sm text-gray-500 font-medium">Model parameters and decision threshold management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">AI Model Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-600">Model Name</span>
                <span className="text-sm font-black text-blue-600">gpt-4o</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-600">Temperature</span>
                <span className="text-sm font-black text-gray-900">0.1 (Deterministic)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-600">Response Format</span>
                <span className="text-sm font-black text-gray-900">JSON Object</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Decision Weights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-600">Stage 1 (Analysis)</span>
                <span className="text-sm font-black text-gray-900">10%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-600">Stage 2 (Coverage)</span>
                <span className="text-sm font-black text-gray-900">40%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-600">Stage 3 (Documents)</span>
                <span className="text-sm font-black text-gray-900">20%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-600">Stage 4 (Fraud)</span>
                <span className="text-sm font-black text-gray-900">30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPage;
