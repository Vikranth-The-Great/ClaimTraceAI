import React from 'react';
import useClaimStore from '../store/useClaimStore';
import { BatchTable } from '../components/table/BatchTable';

const BatchPage: React.FC = () => {
  const { resetBatch } = useClaimStore();

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Batch Analysis Summary</h1>
            <p className="text-sm text-gray-500 font-medium">Comparative overview of recent multi-claim executions</p>
          </div>
          <button 
            onClick={resetBatch}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-500 text-[11px] font-black uppercase tracking-wider rounded-lg hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            Clear Results
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2">
            <BatchTable />
        </div>
      </div>
    </div>
  );
};

export default BatchPage;
