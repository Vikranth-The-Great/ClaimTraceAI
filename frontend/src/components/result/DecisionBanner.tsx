import React from 'react';
import useClaimStore from '../../store/useClaimStore';

export const DecisionBanner: React.FC = () => {
  const { finalResult, consistencyWarning } = useClaimStore();
  
  if (!finalResult) return null;

  const status = finalResult.Status;
  const bannerConfig = {
    Approved: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      icon: "check_circle",
      label: "APPROVED",
    },
    Rejected: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      icon: "cancel",
      label: "REJECTED",
    },
    Pending: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      icon: "warning",
      label: "PENDING — Human Review Required",
    },
  }[status] ?? {
    bg: "bg-gray-50 border-gray-200",
    text: "text-gray-700",
    icon: "help",
    label: status,
  };

  return (
    <div className="mt-8 space-y-4 animate-fade-in">
      {consistencyWarning && consistencyWarning.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-6 py-4 flex items-start gap-4 shadow-sm">
          <span className="material-symbols-outlined text-yellow-600 font-bold">report_problem</span>
          <div>
            <p className="text-yellow-800 font-bold text-sm mb-1">Consistency Check Warning</p>
            {consistencyWarning.map((issue, i) => (
              <p key={i} className="text-yellow-700 text-xs">{issue}</p>
            ))}
          </div>
        </div>
      )}
      <div className={`${bannerConfig.bg} border rounded-lg px-8 py-5 flex items-center justify-between shadow-sm`}>
        <div className="flex items-center gap-4">
          <span className={`material-symbols-outlined text-3xl font-bold ${bannerConfig.text}`}>
            {bannerConfig.icon}
          </span>
          <div>
            <span className={`text-sm font-extrabold ${bannerConfig.text} tracking-widest uppercase block`}>
              {bannerConfig.label}
            </span>
            <span className={`text-xs ${bannerConfig.text} opacity-80 font-medium`}>
              {finalResult.Reason}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <span className={`text-[10px] ${bannerConfig.text} opacity-60 font-bold uppercase block leading-none mb-1`}>
              Overall Confidence
            </span>
            <span className={`text-[32px] font-black ${bannerConfig.text} leading-none`}>
              {Math.round(finalResult["Confidence Score"] * 100)}%
            </span>
          </div>
          <button className={`bg-white border rounded px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/50 transition-all ${bannerConfig.text}`}>
            Finalize Entry
          </button>
        </div>
      </div>
    </div>
  );
};
