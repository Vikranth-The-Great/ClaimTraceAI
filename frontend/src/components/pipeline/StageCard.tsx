import React from 'react';
import { ConfidenceBadge } from '../result/ConfidenceBadge';

interface StageCardProps {
  step: string;
  reason: string;
  confidence: number;
  source: string;
}

const STAGE_LABELS: Record<string, string> = {
  claim_analysis: "Claim Analysis",
  coverage_check: "Coverage Validation",
  document_check: "Document Validation",
  fraud_check: "Fraud / Consistency Check",
  decision: "Decision Generation",
};

const STAGE_NUMS: Record<string, number> = {
  claim_analysis: 1,
  coverage_check: 2,
  document_check: 3,
  fraud_check: 4,
  decision: 5,
};

export const StageCard: React.FC<StageCardProps> = ({ step, reason, confidence, source }) => {
  const num = STAGE_NUMS[step] ?? 0;
  const label = STAGE_LABELS[step] ?? step;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-6 animate-slide-up shadow-sm hover:shadow-md transition-shadow">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
        {num}
      </div>
      <div className="flex-1">
        <h3 className="text-[14px] font-bold text-gray-900">{label}</h3>
        <p className="text-[13px] text-gray-700 mt-1 leading-relaxed">{reason}</p>
        <p className="text-[12px] text-gray-500 italic mt-1.5 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Source: {source}
        </p>
      </div>
      <ConfidenceBadge confidence={confidence} />
    </div>
  );
};
