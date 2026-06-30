'use client';

import { useEffect } from 'react';
import { useWorldCupStore } from '@/store/worldcupStore';
import BracketView from '@/components/BracketView';

export default function BracketPage() {
  const isGroupStageComplete = useWorldCupStore((s) => s.isGroupStageComplete);
  const isBracketPopulated = useWorldCupStore((s) => s.isBracketPopulated);
  const populateBracket = useWorldCupStore((s) => s.populateBracket);
  const hasHydrated = useWorldCupStore((s) => s._hasHydrated);

  const complete = isGroupStageComplete();
  const populated = isBracketPopulated();

  // Auto-populate when group stage is complete and bracket hasn't been seeded yet
  useEffect(() => {
    if (hasHydrated && complete && !populated) {
      populateBracket();
    }
  }, [hasHydrated, complete, populated, populateBracket]);

  if (!hasHydrated) return null;

  return (
    <div className="max-w-full px-4 py-8">
      <div className="max-w-screen-2xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold" style={{ color: '#F9FAFB' }}>
          Knockout <span style={{ color: '#00FF85' }}>Bracket</span>
        </h1>
        <div className="flex items-center gap-3">
          {complete ? (
            <button
              onClick={populateBracket}
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#00FF85', color: '#0B1120' }}
            >
              Re-seed Bracket
            </button>
          ) : (
            <span className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: '#1F2937', color: '#6B7280' }}>
              Complete group stage to populate bracket
            </span>
          )}
        </div>
      </div>

      {!complete && (
        <div className="max-w-screen-2xl mx-auto mb-6 rounded-xl border p-4 text-sm" style={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#6B7280' }}>
          ⚠️ Enter all group stage results first. The bracket will populate automatically once all 72 group matches have scores.
        </div>
      )}

      <BracketView />
    </div>
  );
}
