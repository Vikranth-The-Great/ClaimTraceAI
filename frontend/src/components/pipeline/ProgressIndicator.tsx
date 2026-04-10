import React from 'react';
import useClaimStore from '../../store/useClaimStore';

const STAGE_ORDER = ["claim_analysis", "coverage_check", "document_check", "fraud_check", "decision"];
const STAGE_LABELS: Record<string, string> = {
  claim_analysis: "Claim Analysis",
  coverage_check: "Coverage Validation",
  document_check: "Document Validation",
  fraud_check: "Fraud Check",
  decision: "Consensus",
};

export const ProgressIndicator: React.FC = () => {
  const { stages, isProcessing } = useClaimStore();
  const currentIdx = isProcessing ? stages.length : -1;
  const completedIdx = stages.length - 1;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-500 -z-0" 
          style={{ width: `${Math.max(0, (stages.length / 5) * 100)}%` }}
        />

        {STAGE_ORDER.map((step, idx) => {
          const isCompleted = idx <= completedIdx;
          const isActive = idx === currentIdx;
          
          return (
            <div key={step} className="flex flex-col items-center gap-3 relative z-10 w-24">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isCompleted 
                  ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                  : isActive 
                    ? "bg-white border-blue-600 text-blue-600 scale-110 animate-pulse-highlight" 
                    : "bg-white border-gray-200 text-gray-400"
              }`}>
                {isCompleted ? (
                   <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                ) : (
                  <span className="text-[14px] font-black">{idx + 1}</span>
                )}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider text-center ${
                isActive ? "text-blue-700" : isCompleted ? "text-gray-900" : "text-gray-400"
              }`}>
                {STAGE_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
