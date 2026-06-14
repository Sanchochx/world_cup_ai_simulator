'use client';

import { useWorldCupStore } from '@/store/worldcupStore';

export default function ResetButton() {
  const reset = useWorldCupStore((s) => s.resetTournament);

  const handleReset = () => {
    if (confirm('Reset all scores and bracket? This cannot be undone.')) {
      reset();
    }
  };

  return (
    <button
      onClick={handleReset}
      className="text-xs text-[#6B7280] hover:text-red-400 border border-[#1F2937] hover:border-red-900 px-3 py-1.5 rounded-lg transition-colors"
    >
      Reset Tournament
    </button>
  );
}
