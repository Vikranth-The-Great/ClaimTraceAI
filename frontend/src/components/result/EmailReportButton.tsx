import React, { useState } from 'react';
import useClaimStore from '../../store/useClaimStore';
import { sendClaimAuditEmail } from '../../lib/services/email';

type SendState = 'idle' | 'sending' | 'success' | 'error';

export const EmailReportButton: React.FC = () => {
  const { finalResult } = useClaimStore();
  const [sendState, setSendState] = useState<SendState>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!finalResult) return null;

  async function handleSend() {
    if (!finalResult || sendState === 'sending') return;
    setSendState('sending');
    setErrorMsg('');

    const result = await sendClaimAuditEmail(finalResult);

    if (result.success) {
      setSendState('success');
      setTimeout(() => setSendState('idle'), 5000);
    } else {
      setSendState('error');
      setErrorMsg(result.error ?? 'Unknown error');
      setTimeout(() => setSendState('idle'), 6000);
    }
  }

  const stateConfig = {
    idle: {
      icon: 'mail',
      label: 'Email Audit Report',
      sublabel: 'Send to svikranth40@gmail.com',
      cls: 'bg-gradient-to-r from-[#1e3a8a] to-[#2563EB] hover:from-[#1e40af] hover:to-[#3b82f6] text-white',
    },
    sending: {
      icon: 'sync',
      label: 'Sending…',
      sublabel: 'Drafting & dispatching your report',
      cls: 'bg-gray-700 text-white cursor-wait',
    },
    success: {
      icon: 'mark_email_read',
      label: 'Report Sent Successfully',
      sublabel: 'Check your inbox at svikranth40@gmail.com',
      cls: 'bg-emerald-600 text-white',
    },
    error: {
      icon: 'error',
      label: 'Failed to Send',
      sublabel: errorMsg,
      cls: 'bg-red-600 text-white',
    },
  }[sendState];

  return (
    <div className="mt-6 animate-fade-in">
      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share Report</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        id="email-report-btn"
        onClick={handleSend}
        disabled={sendState === 'sending' || sendState === 'success'}
        className={`
          w-full flex items-center gap-4 px-6 py-4 rounded-xl
          transition-all duration-300 shadow-lg hover:shadow-xl
          disabled:opacity-80 disabled:cursor-not-allowed
          ${stateConfig.cls}
        `}
      >
        {/* Icon */}
        <span
          className={`material-symbols-outlined text-2xl shrink-0 ${sendState === 'sending' ? 'animate-spin' : ''}`}
          style={{ animationDuration: '1.2s' }}
        >
          {stateConfig.icon}
        </span>

        {/* Text */}
        <div className="flex-1 text-left">
          <span className="block font-extrabold text-sm tracking-wide">{stateConfig.label}</span>
          <span className="block text-xs opacity-75 mt-0.5 font-medium">{stateConfig.sublabel}</span>
        </div>

        {/* Badge — claim info */}
        {(sendState === 'idle' || sendState === 'sending') && (
          <div className="text-right shrink-0">
            <span className="block text-xs font-bold opacity-80">{finalResult['Claim ID']}</span>
            <span className="block text-xs opacity-60">{finalResult.Status}</span>
          </div>
        )}

        {sendState === 'success' && (
          <span className="material-symbols-outlined text-2xl shrink-0">check_circle</span>
        )}
      </button>

      <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
        Powered by Resend · Professional HTML Audit Report
      </p>
    </div>
  );
};
