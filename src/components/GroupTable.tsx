'use client';

import { TeamRow } from '@/lib/simulator';
import { teams } from '@/data/teams';
import FlagImage from './FlagImage';

interface Props {
  rows: TeamRow[];
}

export default function GroupTable({ rows }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs border-b border-border">
            <th className="text-left py-2 px-3 w-8">Pos</th>
            <th className="text-left py-2 px-3">Team</th>
            <th className="text-center py-2 px-2">P</th>
            <th className="text-center py-2 px-2">W</th>
            <th className="text-center py-2 px-2">D</th>
            <th className="text-center py-2 px-2">L</th>
            <th className="text-center py-2 px-2">GF</th>
            <th className="text-center py-2 px-2">GA</th>
            <th className="text-center py-2 px-2">GD</th>
            <th className="text-center py-2 px-2 font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const team = teams[row.teamId];
            const rowClass =
              i < 2
                ? 'bg-green-900/20 border-l-2 border-l-green-500'
                : i === 2
                ? 'bg-yellow-900/20 border-l-2 border-l-yellow-500'
                : 'border-l-2 border-l-transparent';

            return (
              <tr key={row.teamId} className={`border-b border-border/50 ${rowClass} transition-colors hover:bg-white/5`}>
                <td className="py-3 px-3 text-muted text-center font-bold">{i + 1}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    {team && <FlagImage code={team.flag} size={20} />}
                    <div>
                      <span className="font-medium text-primary">{team?.name}</span>
                      <span className="text-xs text-muted block">{team?.confederation}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-center text-muted">{row.played}</td>
                <td className="py-3 px-2 text-center text-green-400">{row.won}</td>
                <td className="py-3 px-2 text-center text-yellow-400">{row.drawn}</td>
                <td className="py-3 px-2 text-center text-red-400">{row.lost}</td>
                <td className="py-3 px-2 text-center">{row.gf}</td>
                <td className="py-3 px-2 text-center">{row.ga}</td>
                <td className={`py-3 px-2 text-center ${row.gd > 0 ? 'text-green-400' : row.gd < 0 ? 'text-red-400' : 'text-muted'}`}>
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="py-3 px-2 text-center font-bold text-accent text-base">{row.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-4 mt-3 px-3 text-xs text-muted">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Advances (Top 2)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span> Best 3rd pool</span>
      </div>
    </div>
  );
}
