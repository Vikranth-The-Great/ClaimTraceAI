import React, { useState } from 'react';
import useClaimStore from '../../store/useClaimStore';
import { useClipboard } from '../../hooks/useClipboard';

export const AuditLogPanel: React.FC = () => {
  const { finalResult } = useClaimStore();
  const { copyText, isCopied } = useClipboard();
  const [expanded, setExpanded] = useState(true);

  if (!finalResult) return null;

  const jsonStr = JSON.stringify(finalResult, null, 2);

  function handleExport() {
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claim-${finalResult!["Claim ID"]}-audit-trail.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8 rounded-lg overflow-hidden border border-gray-800 shadow-lg animate-fade-in">
      <div
        className="bg-gray-800 text-gray-200 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sm">terminal</span>
          <span className="text-xs font-bold font-mono tracking-wider uppercase">Audit Log (JSON)</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            id="copy-json-btn"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
            onClick={(e) => { e.stopPropagation(); copyText(jsonStr); }}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isCopied ? "check" : "content_copy"}
            </span>
            {isCopied ? "Copied ✓" : "Copy JSON"}
          </button>
          <button
            id="export-json-btn"
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
            onClick={(e) => { e.stopPropagation(); handleExport(); }}
          >
            <span className="material-symbols-outlined text-[14px]">download</span>
            Export JSON
          </button>
          <span className="material-symbols-outlined text-sm transition-transform duration-200" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
            expand_less
          </span>
        </div>
      </div>
      {expanded && (
        <div className="p-6 font-mono text-[11px] leading-relaxed overflow-x-auto bg-gray-900 border-t border-gray-700 max-h-[400px] overflow-y-auto custom-scrollbar">
          <pre className="text-emerald-400 whitespace-pre-wrap">{jsonStr}</pre>
        </div>
      )}
    </div>
  );
};
