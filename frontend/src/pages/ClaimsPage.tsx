import React from 'react';
import useClaimStore from '../store/useClaimStore';
import { ClaimForm } from '../components/claim/ClaimForm';
import { StageCard } from '../components/pipeline/StageCard';
import { StageSkeleton } from '../components/pipeline/StageSkeleton';
import { DecisionBanner } from '../components/result/DecisionBanner';
import { AuditLogPanel } from '../components/result/AuditLogPanel';
import { ConfidenceLegend } from '../components/result/ConfidenceLegend';
import { BatchTable } from '../components/table/BatchTable';
import { ProgressIndicator } from '../components/pipeline/ProgressIndicator';

const STAGE_ORDER = ["claim_analysis", "coverage_check", "document_check", "fraud_check", "decision"];
const STAGE_LABELS: Record<string, string> = {
  claim_analysis: "Claim Analysis",
  coverage_check: "Coverage Validation",
  document_check: "Document Validation",
  fraud_check: "Fraud / Consistency Check",
  decision: "Decision Generation",
};

const ClaimsPage: React.FC = () => {
  const { stages, isProcessing } = useClaimStore();

  return (
    <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden bg-[#F9FAFB] font-sans">
      <ClaimForm />

      <main className="flex-1 overflow-y-auto flex flex-col bg-[#F9FAFB]">
        <div className="p-8 w-full flex-1 pb-16">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Audit Dashboard</h1>
              <p className="text-sm text-gray-500 font-medium">Real-time Claims Processing Pipeline</p>
            </div>
            <ConfidenceLegend />
          </div>

          <ProgressIndicator />

          {/* Pipeline Container */}
          <div className="space-y-3">
            {stages.length === 0 && !isProcessing && (
              <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-lg shadow-inner">
                <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">analytics</span>
                <p className="text-sm font-extrabold text-[#6B7280] uppercase tracking-wide">Ready for Audit</p>
                <p className="text-xs text-[#6B7280]/60 mt-1">Load a claim candidate and trigger the 5-stage AI reasoning pipeline.</p>
              </div>
            )}

            {/* Completed Stages */}
            {stages.map((stage) => (
              <StageCard
                key={stage.step}
                step={stage.step}
                reason={stage.reason}
                confidence={stage.confidence}
                source={stage.source}
              />
            ))}

            {/* In-flight Stage Skeleton */}
            {isProcessing && stages.length < 5 && (
              <StageSkeleton
                stageNum={stages.length + 1}
                label={STAGE_LABELS[STAGE_ORDER[stages.length]] ?? "Processing…"}
              />
            )}
          </div>

          <DecisionBanner />
          <AuditLogPanel />
          <BatchTable />
        </div>
      </main>
    </div>
  );
};

export default ClaimsPage;
