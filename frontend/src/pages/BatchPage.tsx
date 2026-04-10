import React, { useState } from 'react';
import useClaimStore from '../store/useClaimStore';
import { BatchTable } from '../components/table/BatchTable';
import { usePipeline } from '../hooks/usePipeline';
import { DEMO_CLAIMS } from '../data/demoClaims';

const CLAIM_PREVIEWS = [
  {
    id: 'C1',
    label: 'Claim C1',
    policy: 'Third-Party',
    description: 'Hit a tree while reversing out of the driveway',
    amount: '₹15,000',
    pastClaims: 0,
    documents: 'Complete',
    expected: 'Rejected',
    expectedColor: 'text-red-600 bg-red-50 border-red-100',
  },
  {
    id: 'C2',
    label: 'Claim C2',
    policy: 'Comprehensive',
    description: 'Rear-ended by another vehicle on the highway. Bumper and boot damaged.',
    amount: '₹38,000',
    pastClaims: 1,
    documents: 'Complete',
    expected: 'Approved',
    expectedColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    id: 'C3',
    label: 'Claim C3',
    policy: 'Comprehensive',
    description: 'Minor scratch on the side panel while parking',
    amount: '₹95,000',
    pastClaims: 4,
    documents: 'Missing',
    expected: 'Pending',
    expectedColor: 'text-amber-600 bg-amber-50 border-amber-100',
  },
];

const BatchPage: React.FC = () => {
  const { batchResults, resetBatch, isProcessing } = useClaimStore();
  const { runBatchAll } = usePipeline();
  const [activeProcessingId, setActiveProcessingId] = useState<string | null>(null);

  const handleRunAll = async () => {
    resetBatch();
    for (const preview of CLAIM_PREVIEWS) {
      setActiveProcessingId(preview.id);
      await runBatchAll(DEMO_CLAIMS[preview.id]);
    }
    setActiveProcessingId(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full bg-[#F9FAFB]">
      <div className="flex flex-1 overflow-hidden h-full">

        {/* ── LEFT PANEL ── */}
        <div className="w-[400px] min-w-[360px] flex-shrink-0 border-r border-gray-100 bg-white flex flex-col overflow-y-auto p-6 gap-5">

          {/* Header */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">BATCH ANALYSIS</p>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">Run All 3 Demo Claims</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Process C1, C2, and C3 sequentially through the AI pipeline and compare their verdicts side-by-side.
            </p>
          </div>

          {/* Claim Preview Cards */}
          <div className="space-y-3">
            {CLAIM_PREVIEWS.map((claim) => {
              const isActive = activeProcessingId === claim.id;
              const isDone = batchResults.some((r) => r['Claim ID'] === claim.id);

              return (
                <div
                  key={claim.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : isDone
                      ? 'border-gray-100 bg-gray-50'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{claim.label}</span>
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                          Processing…
                        </span>
                      )}
                      {isDone && !isActive && (
                        <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                      )}
                      <span className={`px-2 py-0.5 text-[9px] font-black border rounded-full uppercase ${claim.expectedColor}`}>
                        {claim.expected}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug mb-2 line-clamp-2">{claim.description}</p>
                  <div className="flex gap-3 text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">policy</span>
                      {claim.policy}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">currency_rupee</span>
                      {claim.amount}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">folder</span>
                      {claim.documents}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Run Batch Audit Button */}
          <div className="mt-auto pt-2 space-y-2">
            <button
              onClick={handleRunAll}
              disabled={isProcessing || activeProcessingId !== null}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                isProcessing || activeProcessingId !== null
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {activeProcessingId !== null ? 'hourglass_top' : 'play_circle'}
              </span>
              {activeProcessingId !== null ? 'Running Batch Audit…' : 'Run Batch Audit (C1 → C2 → C3)'}
            </button>

            {batchResults.length > 0 && (
              <button
                onClick={resetBatch}
                disabled={activeProcessingId !== null}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-gray-200 text-gray-500 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                Clear Results
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Batch Processing Results</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Comparative overview · C1 / C2 / C3</p>
              </div>
              {batchResults.length > 0 && (
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {batchResults.length} / 3 completed
                </span>
              )}
            </div>

            {/* Results Table or Empty State */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <BatchTable />
            </div>

            {/* Confidence Legend */}
            {batchResults.length > 0 && (
              <div className="mt-6 flex items-center gap-6 text-[11px] font-bold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  High ≥ 0.80
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Medium 0.65–0.79
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  Low &lt; 0.65
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BatchPage;
