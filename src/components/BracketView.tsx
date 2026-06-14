'use client';

import { BracketMatch, useWorldCupStore } from '@/store/worldcupStore';
import { teams } from '@/data/teams';
import FlagImage from './FlagImage';

function BracketMatchSlot({ match }: { match: BracketMatch }) {
  const setBracketScore = useWorldCupStore((s) => s.setBracketScore);

  const homeTeam = match.homeTeam ? teams[match.homeTeam] : null;
  const awayTeam = match.awayTeam ? teams[match.awayTeam] : null;

  return (
    <div className="bg-card border border-border rounded-lg p-2 w-52 text-xs">
      <div className={`flex items-center justify-between py-1 ${match.winnerId === match.homeTeam ? 'text-accent font-bold' : 'text-primary'}`}>
        <span className="flex items-center gap-1">{homeTeam ? <><FlagImage code={homeTeam.flag} size={20} />{homeTeam.name}</> : <span className="text-muted italic">TBD</span>}</span>
        {match.homeGoals !== null && <span className="font-bold text-sm ml-2">{match.homeGoals}</span>}
      </div>
      <div className={`flex items-center justify-between py-1 border-t border-border/50 ${match.winnerId === match.awayTeam ? 'text-accent font-bold' : 'text-primary'}`}>
        <span className="flex items-center gap-1">{awayTeam ? <><FlagImage code={awayTeam.flag} size={20} />{awayTeam.name}</> : <span className="text-muted italic">TBD</span>}</span>
        {match.awayGoals !== null && <span className="font-bold text-sm ml-2">{match.awayGoals}</span>}
      </div>
      {homeTeam && awayTeam && !match.winnerId && (
        <div className="flex gap-1 mt-2 border-t border-border/50 pt-2">
          <input
            type="number" min={0}
            placeholder="H"
            className="w-10 bg-bg-primary border border-border rounded text-center text-xs text-primary p-1 focus:outline-none focus:border-accent"
            onChange={(e) => {
              const h = parseInt(e.target.value);
              if (!isNaN(h)) setBracketScore(match.id, h, match.awayGoals);
            }}
          />
          <span className="text-muted self-center">:</span>
          <input
            type="number" min={0}
            placeholder="A"
            className="w-10 bg-bg-primary border border-border rounded text-center text-xs text-primary p-1 focus:outline-none focus:border-accent"
            onChange={(e) => {
              const a = parseInt(e.target.value);
              if (!isNaN(a)) setBracketScore(match.id, match.homeGoals, a);
            }}
          />
        </div>
      )}
    </div>
  );
}

function RoundColumn({ title, matches }: { title: string; matches: BracketMatch[] }) {
  return (
    <div className="flex flex-col gap-3 min-w-[220px]">
      <h3 className="text-center text-xs font-bold text-accent uppercase tracking-widest mb-1">{title}</h3>
      {matches.map((m) => (
        <BracketMatchSlot key={m.id} match={m} />
      ))}
    </div>
  );
}

export default function BracketView() {
  const bracket = useWorldCupStore((s) => s.bracket);

  const r32 = bracket.filter((m) => m.round === 'R32');
  const r16 = bracket.filter((m) => m.round === 'R16');
  const qf = bracket.filter((m) => m.round === 'QF');
  const sf = bracket.filter((m) => m.round === 'SF');
  const final = bracket.filter((m) => m.round === 'F');
  const third = bracket.filter((m) => m.round === '3rd');

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max">
        <RoundColumn title="Round of 32" matches={r32} />
        <RoundColumn title="Round of 16" matches={r16} />
        <RoundColumn title="Quarter-Finals" matches={qf} />
        <RoundColumn title="Semi-Finals" matches={sf} />
        <div className="flex flex-col gap-3 min-w-[220px]">
          <h3 className="text-center text-xs font-bold text-accent uppercase tracking-widest mb-1">Final</h3>
          {final.map((m) => <BracketMatchSlot key={m.id} match={m} />)}
          <h3 className="text-center text-xs font-bold text-yellow-400 uppercase tracking-widest mt-4 mb-1">3rd Place</h3>
          {third.map((m) => <BracketMatchSlot key={m.id} match={m} />)}
        </div>
      </div>
    </div>
  );
}
