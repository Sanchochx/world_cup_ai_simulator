import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { groups, Group } from '@/data/groups';
import { FixtureScore, TeamRow, computeGroupTable, getBestThirds, resolveBestThirds } from '@/lib/simulator';
import { ROUND_OF_32 } from '@/data/bracket';

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
  _hasHydrated: boolean;

  setScore: (fixtureId: string, homeGoals: number | null, awayGoals: number | null) => void;
  getGroupTable: (groupId: string) => TeamRow[];
  getAllGroupTables: () => { groupId: string; rows: TeamRow[] }[];
  getBestThirdsTeams: () => { teamId: string; groupId: string; row: TeamRow }[];
  isGroupStageComplete: () => boolean;
  isBracketPopulated: () => boolean;
  populateBracket: () => void;
  setBracketScore: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void;
  setPenaltyWinner: (matchId: string, winnerId: string) => void;
  resetTournament: () => void;
}

// Advancement map based on official JSON bracket (M1–M33).
// R16-4 (M25: W76 vs W78) advances directly to SF-1 as home — no QF on that branch.
// QF-3 (M23: W89 vs W90) feeds QF-4 (M27) as home — QF→QF chain on right side.
const ADVANCEMENT: Record<string, [string, 'homeTeam' | 'awayTeam']> = {
  // R32 → R16
  'R32-1':  ['R16-1', 'homeTeam'],  // M1  (W73) → M20 home
  'R32-2':  ['R16-1', 'awayTeam'],  // M3  (W75) → M20 away
  'R32-3':  ['R16-2', 'homeTeam'],  // M11 (W83) → M21 home
  'R32-4':  ['R16-2', 'awayTeam'],  // M12 (W84) → M21 away
  'R32-5':  ['R16-3', 'homeTeam'],  // M14 (W86) → M22 home
  'R32-6':  ['R16-3', 'awayTeam'],  // M16 (W88) → M22 away
  'R32-7':  ['R16-4', 'homeTeam'],  // M4  (W76) → M25 home
  'R32-8':  ['R16-4', 'awayTeam'],  // M6  (W78) → M25 away
  'R32-9':  ['R16-5', 'homeTeam'],  // M2  (W74) → M24 home
  'R32-10': ['R16-5', 'awayTeam'],  // M5  (W77) → M24 away
  'R32-11': ['R16-6', 'homeTeam'],  // M7  (W79) → M19 home
  'R32-12': ['R16-6', 'awayTeam'],  // M8  (W80) → M19 away
  'R32-13': ['R16-7', 'homeTeam'],  // M13 (W85) → M17 home
  'R32-14': ['R16-7', 'awayTeam'],  // M15 (W87) → M17 away
  'R32-15': ['R16-8', 'homeTeam'],  // M9  (W81) → M18 home
  'R32-16': ['R16-8', 'awayTeam'],  // M10 (W82) → M18 away
  // R16 → QF or SF
  'R16-1': ['QF-2', 'awayTeam'],   // M20 (W92) → M28 away
  'R16-2': ['QF-1', 'homeTeam'],   // M21 (W93) → M26 home
  'R16-3': ['QF-1', 'awayTeam'],   // M22 (W94) → M26 away
  'R16-4': ['SF-1', 'homeTeam'],   // M25 (W97) → M29 home (direct, no QF on this branch)
  'R16-5': ['QF-4', 'awayTeam'],   // M24 (W96) → M27 away
  'R16-6': ['QF-2', 'homeTeam'],   // M19 (W91) → M28 home
  'R16-7': ['QF-3', 'homeTeam'],   // M17 (W89) → M23 home
  'R16-8': ['QF-3', 'awayTeam'],   // M18 (W90) → M23 away
  // QF → QF or SF
  'QF-1': ['SF-1', 'awayTeam'],    // M26 (W98) → M29 away
  'QF-2': ['SF-2', 'awayTeam'],    // M28 (W100) → M31 away
  'QF-3': ['QF-4', 'homeTeam'],    // M23 (W95) → M27 home
  'QF-4': ['SF-2', 'homeTeam'],    // M27 (W99) → M31 home
  // SF → Final
  'SF-1': ['F-1', 'homeTeam'],
  'SF-2': ['F-1', 'awayTeam'],
};

// SF losers go to 3rd place match
const SF_LOSER_SLOT: Record<string, 'homeTeam' | 'awayTeam'> = {
  'SF-1': 'homeTeam',
  'SF-2': 'awayTeam',
};

function buildEmptyBracket(): BracketMatch[] {
  const matches: BracketMatch[] = [];
  // 16 R32 matches (left: 1-8, right: 9-16)
  for (let i = 1; i <= 16; i++) {
    matches.push({ id: `R32-${i}`, round: 'R32', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  }
  // 8 R16 matches (left: 1-4, right: 5-8)
  for (let i = 1; i <= 8; i++) {
    matches.push({ id: `R16-${i}`, round: 'R16', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  }
  // 4 QF matches (left: 1-2, right: 3-4)
  for (let i = 1; i <= 4; i++) {
    matches.push({ id: `QF-${i}`, round: 'QF', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  }
  // 2 SF matches
  matches.push({ id: 'SF-1', round: 'SF', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  matches.push({ id: 'SF-2', round: 'SF', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  matches.push({ id: 'F-1', round: 'F', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  matches.push({ id: '3rd-1', round: '3rd', homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null });
  return matches;
}

export const useWorldCupStore = create<WorldCupStore>()(
  persist(
    (set, get) => ({
      groups,
      scores: {},
      _hasHydrated: false,
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

      isBracketPopulated: () => {
        const { bracket } = get();
        return bracket.find((m) => m.id === 'R32-1')?.homeTeam !== null;
      },

      populateBracket: () => {
        const tables = get().getAllGroupTables();
        const resolvedThirds = resolveBestThirds(tables);

        const resolveSlot = (slot: string): string | null => {
          if (slot.startsWith('1')) {
            const groupId = slot[1];
            return tables.find((t) => t.groupId === groupId)?.rows[0]?.teamId ?? null;
          }
          if (slot.startsWith('2')) {
            const groupId = slot[1];
            return tables.find((t) => t.groupId === groupId)?.rows[1]?.teamId ?? null;
          }
          if (slot.startsWith('3')) {
            return resolvedThirds[slot] ?? null;
          }
          return null;
        };

        set((state) => ({
          bracket: state.bracket.map((match) => {
            if (match.round === 'R32') {
              const idx = parseInt(match.id.split('-')[1]) - 1;
              const fixture = ROUND_OF_32[idx];
              if (fixture) {
                return {
                  ...match,
                  homeTeam: resolveSlot(fixture.home),
                  awayTeam: resolveSlot(fixture.away),
                  homeGoals: null,
                  awayGoals: null,
                  winnerId: null,
                };
              }
            }
            return { ...match, homeTeam: null, awayTeam: null, homeGoals: null, awayGoals: null, winnerId: null };
          }),
        }));
      },

      setBracketScore: (matchId, homeGoals, awayGoals) => {
        set((state) => {
          const newBracket = [...state.bracket];
          const idx = newBracket.findIndex((m) => m.id === matchId);
          if (idx === -1) return {};

          const match = newBracket[idx];
          let winnerId: string | null = match.winnerId;

          if (homeGoals !== null && awayGoals !== null) {
            if (homeGoals > awayGoals) winnerId = match.homeTeam;
            else if (awayGoals > homeGoals) winnerId = match.awayTeam;
            else winnerId = null; // draw — needs extra time in knockout
          }

          newBracket[idx] = { ...match, homeGoals, awayGoals, winnerId };

          // Advance winner to next round
          if (winnerId && ADVANCEMENT[matchId]) {
            const [nextId, slot] = ADVANCEMENT[matchId];
            const nextIdx = newBracket.findIndex((m) => m.id === nextId);
            if (nextIdx !== -1) {
              newBracket[nextIdx] = { ...newBracket[nextIdx], [slot]: winnerId };
            }
          }

          // Place SF losers in 3rd place match
          if (winnerId && SF_LOSER_SLOT[matchId]) {
            const loser = winnerId === match.homeTeam ? match.awayTeam : match.homeTeam;
            const slot = SF_LOSER_SLOT[matchId];
            const thirdIdx = newBracket.findIndex((m) => m.id === '3rd-1');
            if (thirdIdx !== -1 && loser) {
              newBracket[thirdIdx] = { ...newBracket[thirdIdx], [slot]: loser };
            }
          }

          return { bracket: newBracket };
        });
      },

      setPenaltyWinner: (matchId, winnerId) => {
        set((state) => {
          const newBracket = [...state.bracket];
          const idx = newBracket.findIndex((m) => m.id === matchId);
          if (idx === -1) return {};

          const match = newBracket[idx];
          newBracket[idx] = { ...match, winnerId };

          if (ADVANCEMENT[matchId]) {
            const [nextId, slot] = ADVANCEMENT[matchId];
            const nextIdx = newBracket.findIndex((m) => m.id === nextId);
            if (nextIdx !== -1) {
              newBracket[nextIdx] = { ...newBracket[nextIdx], [slot]: winnerId };
            }
          }

          if (SF_LOSER_SLOT[matchId]) {
            const loser = winnerId === match.homeTeam ? match.awayTeam : match.homeTeam;
            const slot = SF_LOSER_SLOT[matchId];
            const thirdIdx = newBracket.findIndex((m) => m.id === '3rd-1');
            if (thirdIdx !== -1 && loser) {
              newBracket[thirdIdx] = { ...newBracket[thirdIdx], [slot]: loser };
            }
          }

          return { bracket: newBracket };
        });
      },

      resetTournament: () => {
        set({ scores: {}, bracket: buildEmptyBracket() });
      },
    }),
    {
      name: 'wc2026-store',
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useWorldCupStore.setState({ _hasHydrated: true });
      },
    }
  )
);
