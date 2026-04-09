import { create } from 'zustand';
import { ClaimInput } from '../lib/types/claim';
import { StageOutput } from '../lib/types/stage';
import { ClaimResult } from '../lib/types/result';

interface ClaimStore {
  // State
  currentClaim: ClaimInput | null;
  stages: StageOutput[];
  finalResult: ClaimResult | null;
  isProcessing: boolean;
  processingStageIndex: number; // 0–4, which stage is currently in flight
  consistencyWarning: string[] | null;
  batchResults: ClaimResult[];
  error: string | null;

  // Actions
  setClaim: (claim: ClaimInput) => void;
  startProcessing: () => void;
  appendStage: (stage: StageOutput) => void;
  setFinalResult: (result: ClaimResult) => void;
  setConsistencyWarning: (issues: string[] | null) => void;
  addToBatch: (result: ClaimResult) => void;
  resetPipeline: () => void;
  setError: (message: string | null) => void;
}

const useClaimStore = create<ClaimStore>((set) => ({
  // Initial state
  currentClaim: null,
  stages: [],
  finalResult: null,
  isProcessing: false,
  processingStageIndex: 0,
  consistencyWarning: null,
  batchResults: [],
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

  resetPipeline: () =>
    set({
      stages: [],
      finalResult: null,
      isProcessing: false,
      processingStageIndex: 0,
      consistencyWarning: null,
      error: null,
    }),

  setError: (message) =>
    set({ error: message, isProcessing: false }),
}));

export default useClaimStore;
