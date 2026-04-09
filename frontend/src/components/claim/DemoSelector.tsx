import React from 'react';
import { DEMO_CLAIMS } from '../../data/demoClaims';
import { ClaimInput } from '../../lib/types/claim';
import useClaimStore from '../../store/useClaimStore';

interface DemoSelectorProps {
  onSelect: (claim: ClaimInput) => void;
  currentClaimId?: string;
}

export const DemoSelector: React.FC<DemoSelectorProps> = ({ onSelect, currentClaimId }) => {
  const store = useClaimStore();
  
  const handleSelect = (key: string) => {
    const claim = DEMO_CLAIMS[key];
    onSelect(claim);
    store.resetPipeline();
  };

  return (
    <div className="pt-6 border-t border-gray-200">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px]">ads_click</span>
        Batch Candidates (Demo)
      </label>
      <div className="flex flex-wrap gap-2">
        {(["C1", "C2", "C3"] as const).map((key) => (
          <button
            key={key}
            id={`btn-demo-${key.toLowerCase()}`}
            className={`px-4 py-1.5 text-xs rounded-full font-extrabold tracking-tight transition-all border ${
              currentClaimId === key
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => handleSelect(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};
