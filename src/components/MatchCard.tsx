'use client';

import { Fixture } from '@/data/groups';
import { teams } from '@/data/teams';
import { FixtureScore } from '@/lib/simulator';
import ScoreInput from './ScoreInput';
import FlagImage from './FlagImage';

interface Props {
  fixture: Fixture;
  score: FixtureScore | undefined;
  onScoreChange: (homeGoals: number | null, awayGoals: number | null) => void;
}

export default function MatchCard({ fixture, score, onScoreChange }: Props) {
  const homeTeam = teams[fixture.home];
  const awayTeam = teams[fixture.away];
  const h = score?.homeGoals ?? null;
  const a = score?.awayGoals ?? null;
  const hasScore = h !== null && a !== null;

  let badge = null;
  if (hasScore) {
    if (h! > a!) badge = <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded font-bold">HOME WIN</span>;
    else if (a! > h!) badge = <span className="text-xs bg-red-900 text-red-400 px-2 py-0.5 rounded font-bold">AWAY WIN</span>;
    else badge = <span className="text-xs bg-yellow-900 text-yellow-400 px-2 py-0.5 rounded font-bold">DRAW</span>;
  }

  const dateStr = new Date(fixture.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-card border border-border rounded-xl p-4 transition-colors hover:border-border/80">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted">{dateStr}</span>
        <div className="flex items-center gap-2">
          {badge}
          <a
            href={`/match/${fixture.id}/analysis`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded hover:bg-accent/20 transition-colors font-medium"
          >
            🔍 ANALYSIS
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {homeTeam && <FlagImage code={homeTeam.flag} size={40} />}
          <span className="font-medium text-primary text-sm">{homeTeam?.name}</span>
        </div>

        <ScoreInput
          fixtureId={fixture.id}
          homeGoals={h}
          awayGoals={a}
          onScoreChange={onScoreChange}
        />

        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="font-medium text-primary text-sm text-right">{awayTeam?.name}</span>
          {awayTeam && <FlagImage code={awayTeam.flag} size={40} />}
        </div>
      </div>
    </div>
  );
}
