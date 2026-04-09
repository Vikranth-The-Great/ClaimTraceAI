import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ClaimInput } from '../lib/types/claim';
import { StageOutput } from '../lib/types/stage';
import { ClaimResult } from '../lib/types/result';

interface ClaimStore {
  // State
  currentClaim: ClaimInput | null;
  stages: StageOutput[];
  finalResult: ClaimResult | null;
  isProcessing: boolean;
  processingStageIndex: number;
  consistencyWarning: string[] | null;
  batchResults: ClaimResult[];
  auditHistory: ClaimResult[];
  error: string | null;

  // Actions
  setClaim: (claim: ClaimInput) => void;
  startProcessing: () => void;
  appendStage: (stage: StageOutput) => void;
  setFinalResult: (result: ClaimResult) => void;
  setConsistencyWarning: (issues: string[] | null) => void;
  addToBatch: (result: ClaimResult) => void;
  addToHistory: (result: ClaimResult) => void;
  resetPipeline: () => void;
  resetBatch: () => void;
  setError: (message: string | null) => void;
  loadClaimResult: (result: ClaimResult) => void;
}

const useClaimStore = create<ClaimStore>()(
  persist(
    (set) => ({
      // Initial state
      currentClaim: null,
      stages: [],
      finalResult: null,
      isProcessing: false,
      processingStageIndex: 0,
      consistencyWarning: null,
      batchResults: [],
      auditHistory: [],
      error: null,

      // Actions
      setClaim: (claim) => set({ currentClaim: claim }),

      startProcessing: () =>
        set({
          stages: [],
          finalResult: null,
          isProcessing: true,
          processingStageIndex: 0,
          consistencyWarning: null,
          error: null,
        }),

      appendStage: (stage) =>
        set((state) => ({
          stages: [...state.stages, stage],
          processingStageIndex: state.processingStageIndex + 1,
        })),

      setFinalResult: (result) =>
        set({ finalResult: result, isProcessing: false }),

      setConsistencyWarning: (issues) =>
        set({ consistencyWarning: issues }),

      addToBatch: (result) =>
        set((state) => ({ batchResults: [...state.batchResults, result] })),

      addToHistory: (result) =>
        set((state) => {
          // Prevent duplicates by Claim ID
          const filteredHistory = state.auditHistory.filter(r => r["Claim ID"] !== result["Claim ID"]);
          return { auditHistory: [result, ...filteredHistory] };
        }),

      resetPipeline: () =>
        set({
          stages: [],
          finalResult: null,
          isProcessing: false,
          processingStageIndex: 0,
          consistencyWarning: null,
          error: null,
        }),

      resetBatch: () => set({ batchResults: [] }),

      setError: (message) =>
        set({ error: message, isProcessing: false }),

      loadClaimResult: (result) => set({
        currentClaim: null, // We don't have the original fields in ClaimResult schema top-level
        stages: result["Audit Log"],
        finalResult: result,
        isProcessing: false,
        processingStageIndex: 5,
        consistencyWarning: null,
        error: null
      })
    }),
    {
      name: 'claimtrace-audit-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        auditHistory: state.auditHistory,
        batchResults: state.batchResults 
      }),
    }
  )
);

export default useClaimStore;
