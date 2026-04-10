import React, { useState } from 'react';
import { ClaimInput } from '../../lib/types/claim';
import { usePipeline } from '../../hooks/usePipeline';
import useClaimStore from '../../store/useClaimStore';
import { DemoSelector } from './DemoSelector';

export const ClaimForm: React.FC = () => {
  const store = useClaimStore();
  const { processClaim } = usePipeline();
  
  const [formData, setFormData] = useState<ClaimInput>(
    store.currentClaim || {
      claimId: '',
      accidentDescription: '',
      policyType: 'Comprehensive',
      claimAmount: 0,
      pastClaimsCount: 0,
      documentStatus: 'Complete',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof ClaimInput, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof ClaimInput, string>> = {};
    if (!formData.claimId.trim()) newErrors.claimId = "Claim ID is required";
    if (!formData.accidentDescription.trim()) newErrors.accidentDescription = "Description is required";
    if (formData.claimAmount <= 0) newErrors.claimAmount = "Enter a valid amount";
    if (formData.pastClaimsCount < 0) newErrors.pastClaimsCount = "Invalid count";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcess = async () => {
    if (!validate()) return;
    store.setClaim(formData);
    await processClaim(formData);
  };


  const updateField = (field: keyof ClaimInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <aside className="w-[380px] bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto shrink-0 shadow-sm">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#6B7280] mb-1">Claim Analysis Entry</h2>
          <p className="text-[11px] text-[#6B7280]/70 font-medium">Reference: AC-9921-X · Auditor Workspace</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">tag</span>
              Claim Identifier
            </label>
            <input
              className={`w-full bg-[#f9fafb] border rounded-md text-[14px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all ${errors.claimId ? 'border-red-400' : 'border-gray-200'}`}
              type="text"
              placeholder="e.g. CLM-12345"
              value={formData.claimId}
              onChange={(e) => updateField('claimId', e.target.value)}
            />
            {errors.claimId && <p className="text-red-600 text-[10px] mt-1 font-bold">{errors.claimId}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">description</span>
              Incident Narrative
            </label>
            <textarea
              className={`w-full bg-[#f9fafb] border rounded-md text-[14px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all resize-none ${errors.accidentDescription ? 'border-red-400' : 'border-gray-200'}`}
              rows={3}
              placeholder="Detailed description of the accident..."
              value={formData.accidentDescription}
              onChange={(e) => updateField('accidentDescription', e.target.value)}
            />
            {errors.accidentDescription && <p className="text-red-600 text-[10px] mt-1 font-bold">{errors.accidentDescription}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">policy</span>
                Policy
              </label>
              <select
                className="w-full bg-[#f9fafb] border border-gray-200 rounded-md text-[14px] px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.policyType}
                onChange={(e) => updateField('policyType', e.target.value)}
              >
                <option value="Comprehensive">Comprehensive</option>
                <option value="Third-Party">Third-Party</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Documents
              </label>
              <select
                className="w-full bg-[#f9fafb] border border-gray-200 rounded-md text-[14px] px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.documentStatus}
                onChange={(e) => updateField('documentStatus', e.target.value)}
              >
                <option value="Complete">Complete</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-[11px] text-[13px] text-gray-500 font-bold">₹</span>
                <input
                  className={`w-full bg-[#f9fafb] border rounded-md text-[14px] pl-7 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none ${errors.claimAmount ? 'border-red-400' : 'border-gray-200'}`}
                  type="number"
                  value={formData.claimAmount || ''}
                  onChange={(e) => updateField('claimAmount', Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">history</span>
                Past Claims
              </label>
              <input
                className="w-full bg-[#f9fafb] border border-gray-200 rounded-md text-[14px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none"
                type="number"
                value={formData.pastClaimsCount}
                onChange={(e) => updateField('pastClaimsCount', Number(e.target.value))}
              />
            </div>
          </div>

          <DemoSelector 
            onSelect={(claim) => setFormData(claim)} 
            currentClaimId={formData.claimId}
          />

          <div className="pt-8 space-y-3">
            <button
              className="w-full bg-[#1A56DB] text-white h-[48px] rounded-md font-bold text-sm tracking-tight hover:bg-blue-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:grayscale disabled:pointer-events-none flex items-center justify-center gap-2"
              disabled={store.isProcessing}
              onClick={handleProcess}
            >
              {store.isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Stage {store.processingStageIndex + 1} Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  Process Single Claim
                </>
              )}
            </button>
          </div>


          {store.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-red-700 text-[11px] font-black uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                Analysis Error
              </p>
              <p className="text-red-600 text-[12px] font-medium leading-tight mt-1">{store.error}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
