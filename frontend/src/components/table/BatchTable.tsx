import React from 'react';
import useClaimStore from '../../store/useClaimStore';

export const BatchTable: React.FC = () => {
  const { batchResults } = useClaimStore();
  
  if (batchResults.length === 0) return null;

  const statusStyle: Record<string, string> = {
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected: "bg-red-50 text-red-700 border-red-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px]">list_alt</span>
        Batch Processing Results
      </h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-tighter">Claim ID</th>
              <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-tighter">Status</th>
              <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-tighter">Confidence</th>
              <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-tighter">Key Audit Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {batchResults.map((r) => (
              <tr key={r["Claim ID"]} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">{r["Claim ID"]}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusStyle[r.Status] ?? "bg-gray-50 text-gray-700 border-gray-100"}`}>
                    {r.Status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900">{r["Confidence Score"].toFixed(2)}</span>
                    <span className={`text-[10px] font-bold uppercase ${
                      r["Confidence Score"] >= 0.80 ? "text-emerald-600" : 
                      r["Confidence Score"] >= 0.65 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {r["Confidence Score"] >= 0.80 ? "High" : r["Confidence Score"] >= 0.65 ? "Med" : "Low"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-[11px] font-medium max-w-xs truncate">
                  {r.Reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
