'use client';

import { useState, useEffect } from 'react';

interface Props {
  fixtureId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  onScoreChange: (homeGoals: number | null, awayGoals: number | null) => void;
}

export default function ScoreInput({ fixtureId, homeGoals, awayGoals, onScoreChange }: Props) {
  const [home, setHome] = useState<string>(homeGoals !== null ? String(homeGoals) : '');
  const [away, setAway] = useState<string>(awayGoals !== null ? String(awayGoals) : '');

  useEffect(() => {
    setHome(homeGoals !== null ? String(homeGoals) : '');
    setAway(awayGoals !== null ? String(awayGoals) : '');
  }, [fixtureId, homeGoals, awayGoals]);

  const commit = (h: string, a: string) => {
    const hVal = h === '' ? null : Math.max(0, parseInt(h));
    const aVal = a === '' ? null : Math.max(0, parseInt(a));
    if ((hVal === null && aVal === null) || (!isNaN(hVal ?? NaN) && !isNaN(aVal ?? NaN))) {
      onScoreChange(
        hVal !== null && !isNaN(hVal) ? hVal : null,
        aVal !== null && !isNaN(aVal) ? aVal : null
      );
    }
  };

  const inputClass = 'w-10 text-center bg-transparent text-primary font-bold text-lg focus:outline-none focus:ring-1 focus:ring-accent rounded';

  return (
    <div className="flex items-center gap-1 bg-bg-primary border border-border rounded-lg px-2 py-1">
      <input
        type="number"
        min={0}
        value={home}
        onChange={(e) => setHome(e.target.value)}
        onBlur={() => commit(home, away)}
        className={inputClass}
        placeholder="–"
      />
      <span className="text-muted font-bold">:</span>
      <input
        type="number"
        min={0}
        value={away}
        onChange={(e) => setAway(e.target.value)}
        onBlur={() => commit(home, away)}
        className={inputClass}
        placeholder="–"
      />
    </div>
  );
}
