import React from 'react';

interface ConfidenceBadgeProps {
  confidence: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  if (confidence >= 0.80) {
    return (
      <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-100 shrink-0">
        High ({confidence.toFixed(2)})
      </div>
    );
  }
  if (confidence >= 0.65) {
    return (
      <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold border border-amber-100 shrink-0">
        Medium ({confidence.toFixed(2)})
      </div>
    );
  }
  return (
    <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold border border-red-100 shrink-0">
      Low ({confidence.toFixed(2)})
    </div>
  );
};
