import React from 'react';
import useClaimStore from '../../store/useClaimStore';

export const BatchTable: React.FC = () => {
  const { batchResults } = useClaimStore();

  const statusStyle: Record<string, string> = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Rejected: 'bg-red-50 text-red-700 border-red-100',
    Pending: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  if (batchResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <span className="material-symbols-outlined text-[48px] text-gray-200 mb-4">inbox</span>
        <p className="text-sm font-bold text-gray-400">No batch results yet</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Click <span className="font-black text-blue-500">Run Batch Audit (C1 → C2 → C3)</span> on the left to process all three demo claims sequentially.
        </p>
      </div>
    );
  }

  return (
    <table className="w-full text-left text-[13px]">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-tighter text-[11px]">Claim ID</th>
          <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-tighter text-[11px]">Status</th>
          <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-tighter text-[11px]">Confidence</th>
          <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-tighter text-[11px]">Key Audit Reason</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {batchResults.map((r) => (
          <tr key={r['Claim ID']} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 font-black text-gray-900">{r['Claim ID']}</td>
            <td className="px-6 py-4">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                  statusStyle[r.Status] ?? 'bg-gray-50 text-gray-700 border-gray-100'
                }`}
              >
                {r.Status}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-900">{r['Confidence Score'].toFixed(2)}</span>
                <span
                  className={`text-[10px] font-bold uppercase ${
                    r['Confidence Score'] >= 0.8
                      ? 'text-emerald-600'
                      : r['Confidence Score'] >= 0.65
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}
                >
                  {r['Confidence Score'] >= 0.8 ? 'High' : r['Confidence Score'] >= 0.65 ? 'Med' : 'Low'}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 text-gray-500 text-[11px] font-medium max-w-xs">
              <span className="line-clamp-2">{r.Reason}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
