'use client';

import { useWorldCupStore } from '@/store/worldcupStore';
import BracketView from '@/components/BracketView';

export default function BracketPage() {
  const isComplete = useWorldCupStore((s) => s.isGroupStageComplete);
  const populateBracket = useWorldCupStore((s) => s.populateBracket);
  const complete = isComplete();

  return (
    <div className="max-w-full px-4 py-8">
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold" style={{ color: '#F9FAFB' }}>
          Knockout <span style={{ color: '#00FF85' }}>Bracket</span>
        </h1>
        {complete ? (
          <button
            onClick={populateBracket}
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#00FF85', color: '#0B1120' }}
          >
            Auto-populate R32
          </button>
        ) : (
          <span className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: '#1F2937', color: '#6B7280' }}>
            Complete group stage to auto-populate
          </span>
        )}
      </div>

      {!complete && (
        <div className="max-w-7xl mx-auto mb-6 rounded-xl border p-4 text-sm" style={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#6B7280' }}>
          ⚠️ Enter all group stage scores first. Once complete, click &quot;Auto-populate R32&quot; to seed the bracket.
        </div>
      )}

      <BracketView />
    </div>
  );
}
