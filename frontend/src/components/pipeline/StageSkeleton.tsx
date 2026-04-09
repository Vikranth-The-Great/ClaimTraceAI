import React from 'react';

interface StageSkeletonProps {
  stageNum: number;
  label: string;
}

export const StageSkeleton: React.FC<StageSkeletonProps> = ({ stageNum, label }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-6">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
        {stageNum}
      </div>
      <div className="flex-1 flex flex-col gap-2.5">
        <h3 className="text-[14px] font-bold">{label}</h3>
        <div className="space-y-2">
          <div className="h-3 w-[60%] shimmer rounded" />
          <div className="h-3 w-[80%] shimmer rounded" />
          <div className="h-3 w-[45%] shimmer rounded" />
        </div>
      </div>
      <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse border border-gray-200" />
    </div>
  );
};
