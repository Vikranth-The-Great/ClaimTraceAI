import React from 'react';

export const ConfidenceLegend: React.FC = () => {
  return (
    <div className="flex justify-end items-center gap-6 mb-8">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></span>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">High &ge;0.80</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]"></span>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Medium 0.65&ndash;0.79</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"></span>
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Low &lt;0.65</span>
      </div>
    </div>
  );
};
