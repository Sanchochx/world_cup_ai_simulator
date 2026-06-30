'use client';

import Link from 'next/link';
import { Group } from '@/data/groups';
import { teams } from '@/data/teams';
import { useWorldCupStore } from '@/store/worldcupStore';
import FlagImage from './FlagImage';

interface Props {
  group: Group;
}

export default function GroupCard({ group }: Props) {
  const getGroupTable = useWorldCupStore((s) => s.getGroupTable);
  const getBestThirdsTeams = useWorldCupStore((s) => s.getBestThirdsTeams);
  const table = getGroupTable(group.id);
  const bestThirds = getBestThirdsTeams();
  const qualifyingThirdId = bestThirds.find((t) => t.groupId === group.id)?.teamId ?? null;

  return (
    <Link href={`/groups/${group.id}`}>
      <div className="group-card bg-card border border-border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-accent hover:shadow-[0_0_20px_rgba(0,255,133,0.15)] hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-display font-bold text-accent">{group.name}</span>
          <span className="text-xs text-muted bg-border px-2 py-1 rounded">{group.teams.length} teams</span>
        </div>

        <div className="space-y-2 mb-4">
          {group.teams.map((teamId) => {
            const team = teams[teamId];
            return (
              <div key={teamId} className="flex items-center gap-2">
                {team && <FlagImage code={team.flag} size={20} />}
                <span className="text-sm text-primary font-medium">{team?.name}</span>
              </div>
            );
          })}
        </div>

        {table.some((r) => r.played > 0) && (
          <div className="border-t border-border pt-3">
            <div className="grid grid-cols-5 text-[10px] text-muted mb-1 px-1">
              <span>Team</span>
              <span className="text-center">P</span>
              <span className="text-center">W</span>
              <span className="text-center">D</span>
              <span className="text-center">Pts</span>
            </div>
            {table.map((row, i) => {
              const team = teams[row.teamId];
              const highlight = i < 2 ? 'text-green-400' : (i === 2 && qualifyingThirdId === row.teamId) ? 'text-yellow-400' : 'text-muted';
              return (
                <div key={row.teamId} className={`grid grid-cols-5 text-[11px] px-1 py-0.5 ${highlight}`}>
                  <span className="truncate flex items-center gap-1">{team && <FlagImage code={team.flag} size={20} />}{team?.id}</span>
                  <span className="text-center">{row.played}</span>
                  <span className="text-center">{row.won}</span>
                  <span className="text-center">{row.drawn}</span>
                  <span className="text-center font-bold">{row.pts}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
