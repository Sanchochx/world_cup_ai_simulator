import { Group } from '@/data/groups';

export interface TeamRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export interface FixtureScore {
  homeGoals: number | null;
  awayGoals: number | null;
}

export function computeGroupTable(
  group: Group,
  scores: Record<string, FixtureScore>
): TeamRow[] {
  const rows: Record<string, TeamRow> = {};

  for (const teamId of group.teams) {
    rows[teamId] = { teamId, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  }

  for (const fixture of group.fixtures) {
    const score = scores[fixture.id];
    if (!score || score.homeGoals === null || score.awayGoals === null) continue;

    const { homeGoals, awayGoals } = score;
    const home = rows[fixture.home];
    const away = rows[fixture.away];
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.gf += homeGoals;
    home.ga += awayGoals;
    away.gf += awayGoals;
    away.ga += homeGoals;

    if (homeGoals > awayGoals) {
      home.won++;
      home.pts += 3;
      away.lost++;
    } else if (homeGoals < awayGoals) {
      away.won++;
      away.pts += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.pts += 1;
      away.pts += 1;
    }
  }

  for (const row of Object.values(rows)) {
    row.gd = row.gf - row.ga;
  }

  return sortTable(Object.values(rows), group, scores);
}

function sortTable(rows: TeamRow[], group: Group, scores: Record<string, FixtureScore>): TeamRow[] {
  return [...rows].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;

    // Head-to-head
    const h2hA = getH2HPoints(a.teamId, b.teamId, group, scores);
    const h2hB = getH2HPoints(b.teamId, a.teamId, group, scores);
    if (h2hA !== h2hB) return h2hB - h2hA;

    return 0;
  });
}

function getH2HPoints(
  teamId: string,
  opponentId: string,
  group: Group,
  scores: Record<string, FixtureScore>
): number {
  let pts = 0;
  for (const fixture of group.fixtures) {
    const score = scores[fixture.id];
    if (!score || score.homeGoals === null || score.awayGoals === null) continue;

    if (fixture.home === teamId && fixture.away === opponentId) {
      if (score.homeGoals > score.awayGoals) pts += 3;
      else if (score.homeGoals === score.awayGoals) pts += 1;
    } else if (fixture.away === teamId && fixture.home === opponentId) {
      if (score.awayGoals > score.homeGoals) pts += 3;
      else if (score.homeGoals === score.awayGoals) pts += 1;
    }
  }
  return pts;
}

export function getBestThirds(
  allGroupTables: { groupId: string; rows: TeamRow[] }[]
): { teamId: string; groupId: string; row: TeamRow }[] {
  const thirds = allGroupTables
    .map(({ groupId, rows }) => ({
      teamId: rows[2]?.teamId ?? '',
      groupId,
      row: rows[2],
    }))
    .filter((t) => t.teamId);

  return thirds
    .sort((a, b) => {
      if (b.row.pts !== a.row.pts) return b.row.pts - a.row.pts;
      if (b.row.gd !== a.row.gd) return b.row.gd - a.row.gd;
      if (b.row.gf !== a.row.gf) return b.row.gf - a.row.gf;
      return 0;
    })
    .slice(0, 8);
}
