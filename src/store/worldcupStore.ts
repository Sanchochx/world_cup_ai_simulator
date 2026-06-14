import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { groups, Group } from '@/data/groups';
import { FixtureScore, TeamRow, computeGroupTable, getBestThirds } from '@/lib/simulator';

export interface BracketMatch {
  id: string;
  round: 'R32' | 'R16' | 'QF' | 'SF' | 'F' | '3rd';
  homeTeam: string | null;
  awayTeam: string | null;
  homeGoals: number | null;
  awayGoals: number | null;
  winnerId: string | null;
}

interface WorldCupStore {
  groups: Group[];
  scores: Record<string, FixtureScore>;
  bracket: BracketMatch[];

  setScore: (fixtureId: string, homeGoals: number | null, awayGoals: number | null) => void;
  getGroupTable: (groupId: string) => TeamRow[];
  getAllGroupTables: () => { groupId: string; rows: TeamRow[] }[];
  getBestThirdsTeams: () => { teamId: string; groupId: string; row: TeamRow }[];
  isGroupStageComplete: () => boolean;
  populateBracket: () => void;
  setBracketScore: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void;
  resetTournament: () => void;
}

function buildEmptyBracket(): BracketMatch[] {
  const matches: BracketMatch[] = [];
  for (let i = 1; i <= 32; i++) {
    matches.push({ id: `R32-${i}`, round: 'R32', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  }
  for (let i = 1; i <= 16; i++) {
    matches.push({ id: `R16-${i}`, round: 'R16', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  }
  for (let i = 1; i <= 8; i++) {
    matches.push({ id: `QF-${i}`, round: 'QF', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  }
  for (let i = 1; i <= 4; i++) {
    matches.push({ id: `SF-${i}`, round: 'SF', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  }
  matches.push({ id: 'F-1', round: 'F', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  matches.push({ id: '3rd-1', round: '3rd', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  return matches;
}

export const useWorldCupStore = create<WorldCupStore>()(
  persist(
    (set, get) => ({
      groups,
      scores: {},
      bracket: buildEmptyBracket(),

      setScore: (fixtureId, homeGoals, awayGoals) => {
        set((state) => ({
          scores: {
            ...state.scores,
            [fixtureId]: { homeGoals, awayGoals },
          },
        }));
      },

      getGroupTable: (groupId) => {
        const { groups, scores } = get();
        const group = groups.find((g) => g.id === groupId);
        if (!group) return [];
        return computeGroupTable(group, scores);
      },

      getAllGroupTables: () => {
        const { groups, scores } = get();
        return groups.map((g) => ({
          groupId: g.id,
          rows: computeGroupTable(g, scores),
        }));
      },

      getBestThirdsTeams: () => {
        return getBestThirds(get().getAllGroupTables());
      },

      isGroupStageComplete: () => {
        const { groups, scores } = get();
        for (const group of groups) {
          for (const fixture of group.fixtures) {
            const score = scores[fixture.id];
            if (!score || score.homeGoals === null || score.awayGoals === null) return false;
          }
        }
        return true;
      },

      populateBracket: () => {
        const { getAllGroupTables, getBestThirdsTeams } = get();
        const tables = getAllGroupTables();
        const bestThirds = getBestThirdsTeams();

        const winner = (groupId: string) => tables.find((t) => t.groupId === groupId)?.rows[0]?.teamId ?? null;
        const runner = (groupId: string) => tables.find((t) => t.groupId === groupId)?.rows[1]?.teamId ?? null;
        const third = (idx: number) => bestThirds[idx]?.teamId ?? null;

        // Official FIFA 2026 R32 bracket seeding (32 matches)
        // Each R32 match: 1st/2nd from groups vs best thirds
        const r32Slots: [string | null, string | null][] = [
          [winner('A'), runner('B')],
          [winner('C'), runner('D')],
          [winner('E'), runner('F')],
          [winner('G'), runner('H')],
          [winner('I'), runner('J')],
          [winner('K'), runner('L')],
          [winner('B'), runner('A')],
          [winner('D'), runner('C')],
          [winner('F'), runner('E')],
          [winner('H'), runner('G')],
          [winner('J'), runner('I')],
          [winner('L'), runner('K')],
          [winner('A'), third(0)],
          [winner('C'), third(1)],
          [winner('E'), third(2)],
          [winner('G'), third(3)],
          [winner('I'), third(4)],
          [winner('K'), third(5)],
          [runner('B'), third(6)],
          [runner('D'), third(7)],
          // Remaining slots TBD
          [null, null], [null, null], [null, null], [null, null],
          [null, null], [null, null], [null, null], [null, null],
          [null, null], [null, null], [null, null], [null, null],
        ];

        set((state) => ({
          bracket: state.bracket.map((match) => {
            if (match.round === 'R32') {
              const idx = parseInt(match.id.split('-')[1]) - 1;
              const slot = r32Slots[idx];
              if (slot) {
                return { ...match, homeTeam: slot[0], awayTeam: slot[1], homeGoals: null, awayGoals: null, winnerId: null };
              }
            }
            return match;
          }),
        }));
      },

      setBracketScore: (matchId, homeGoals, awayGoals) => {
        set((state) => {
          const newBracket = state.bracket.map((m) => {
            if (m.id !== matchId) return m;
            let winnerId = m.winnerId;
            if (homeGoals !== null && awayGoals !== null) {
              if (homeGoals > awayGoals) winnerId = m.homeTeam;
              else if (awayGoals > homeGoals) winnerId = m.awayTeam;
              else winnerId = null;
            }
            return { ...m, homeGoals, awayGoals, winnerId };
          });
          return { bracket: newBracket };
        });
      },

      resetTournament: () => {
        set({ scores: {}, bracket: buildEmptyBracket() });
      },
    }),
    { name: 'wc2026-store', skipHydration: true }
  )
);
