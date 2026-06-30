export interface BracketFixture {
  matchNum: number; // JSON bracket M-number (M1–M16)
  home: string;
  away: string;
  date: string;
  time: string;
  venue: string;
}

// Ordered by VISUAL bracket position (R32-1 through R32-16).
// Left half feeds SF-1 (M29: W97 vs W98); right half feeds SF-2 (M31: W99 vs W100).
// M23 (W89 vs W90) is placed in QF-3 because it depends on R16 winners M17/M18.
// M30 from the official JSON is a duplicate of M29 and is omitted.
//
// W-code → visual slot mapping (JSON M-numbers):
//   W73 = M1  → R32-1  |  W75 = M3  → R32-2   (→ R16-1 / M20)
//   W83 = M11 → R32-3  |  W84 = M12 → R32-4   (→ R16-2 / M21)
//   W86 = M14 → R32-5  |  W88 = M16 → R32-6   (→ R16-3 / M22)
//   W76 = M4  → R32-7  |  W78 = M6  → R32-8   (→ R16-4 / M25 → SF-1 home)
//   W74 = M2  → R32-9  |  W77 = M5  → R32-10  (→ R16-5 / M24)
//   W79 = M7  → R32-11 |  W80 = M8  → R32-12  (→ R16-6 / M19)
//   W85 = M13 → R32-13 |  W87 = M15 → R32-14  (→ R16-7 / M17)
//   W81 = M9  → R32-15 |  W82 = M10 → R32-16  (→ R16-8 / M18)
export const ROUND_OF_32: BracketFixture[] = [
  // ── Left half ──────────────────────────────────────────────────────────────
  { matchNum:  1, home: '1B', away: '3EFGIJ', date: '2026-07-02', time: '13:00', venue: 'TBD' }, // R32-1  W73 → R16-1 home
  { matchNum:  3, home: '1D', away: '3BEFIJ', date: '2026-07-01', time: '20:00', venue: 'TBD' }, // R32-2  W75 → R16-1 away
  { matchNum: 11, home: '1J', away: '2H',     date: '2026-06-29', time: '13:00', venue: 'TBD' }, // R32-3  W83 → R16-2 home
  { matchNum: 12, home: '2K', away: '2L',     date: '2026-06-29', time: '18:00', venue: 'TBD' }, // R32-4  W84 → R16-2 away
  { matchNum: 14, home: '2D', away: '2G',     date: '2026-07-01', time: '14:00', venue: 'TBD' }, // R32-5  W86 → R16-3 home
  { matchNum: 16, home: '1I', away: '3CDFGH', date: '2026-06-28', time: '17:00', venue: 'TBD' }, // R32-6  W88 → R16-3 away
  { matchNum:  4, home: '2A', away: '2B',     date: '2026-06-28', time: '13:00', venue: 'TBD' }, // R32-7  W76 → R16-4 home
  { matchNum:  6, home: '1F', away: '2C',     date: '2026-06-29', time: '21:00', venue: 'TBD' }, // R32-8  W78 → R16-4 away
  // ── Right half ─────────────────────────────────────────────────────────────
  { matchNum:  2, home: '1G', away: '3AEHIJ', date: '2026-06-30', time: '15:00', venue: 'TBD' }, // R32-9  W74 → R16-5 home
  { matchNum:  5, home: '1A', away: '3CEFHI', date: '2026-06-28', time: '21:00', venue: 'TBD' }, // R32-10 W77 → R16-5 away
  { matchNum:  7, home: '1C', away: '2F',     date: '2026-06-28', time: '18:00', venue: 'TBD' }, // R32-11 W79 → R16-6 home
  { matchNum:  8, home: '2E', away: '2I',     date: '2026-06-29', time: '18:00', venue: 'TBD' }, // R32-12 W80 → R16-6 away
  { matchNum: 13, home: '1E', away: '3ABCDF', date: '2026-06-27', time: '18:00', venue: 'TBD' }, // R32-13 W85 → R16-7 home
  { matchNum: 15, home: '1H', away: '2J',     date: '2026-07-02', time: '13:00', venue: 'TBD' }, // R32-14 W87 → R16-7 away
  { matchNum:  9, home: '1K', away: '3DEIJL', date: '2026-07-02', time: '21:00', venue: 'TBD' }, // R32-15 W81 → R16-8 home
  { matchNum: 10, home: '1L', away: '3EHIJK', date: '2026-06-30', time: '12:00', venue: 'TBD' }, // R32-16 W82 → R16-8 away
];

// Schedule for every non-R32 match (R32 dates live in ROUND_OF_32 above).
export const MATCH_SCHEDULE: Record<string, { date: string; time: string }> = {
  // Round of 16 — Jul 4–7 (rest day Jul 8 before QF)
  'R16-1': { date: '2026-07-04', time: '13:00' }, // M20: W73 vs W75
  'R16-2': { date: '2026-07-06', time: '17:00' }, // M21: W83 vs W84
  'R16-3': { date: '2026-07-07', time: '18:00' }, // M22: W86 vs W88
  'R16-4': { date: '2026-07-07', time: '18:00' }, // M25: W76 vs W78 → SF-1 home
  'R16-5': { date: '2026-07-05', time: '20:00' }, // M24: W74 vs W77
  'R16-6': { date: '2026-07-07', time: '15:00' }, // M19: W79 vs W80
  'R16-7': { date: '2026-07-07', time: '18:00' }, // M17: W85 vs W87
  'R16-8': { date: '2026-07-07', time: '12:00' }, // M18: W81 vs W82
  // Quarter-Finals — Jul 9–11 (rest days Jul 12–13 before SF)
  'QF-1':  { date: '2026-07-09', time: '18:00' }, // M26: W93 vs W94 → SF-1 away
  'QF-2':  { date: '2026-07-10', time: '17:00' }, // M28: W91 vs W92 → SF-2 away
  'QF-3':  { date: '2026-07-10', time: '18:00' }, // M23: W89 vs W90 → QF-4 home
  'QF-4':  { date: '2026-07-11', time: '21:00' }, // M27: W95 vs W96 → SF-2 home
  // Semi-Finals — Jul 14–15 (rest days Jul 16–17 before Final)
  'SF-1':  { date: '2026-07-14', time: '21:00' }, // M29: W97 vs W98 → Final home
  'SF-2':  { date: '2026-07-15', time: '20:00' }, // M31: W99 vs W100 → Final away
  // Final weekend
  '3rd-1': { date: '2026-07-18', time: '17:00' },
  'F-1':   { date: '2026-07-19', time: 'TBD'   },
};

// Each 3rd-place slot maps to the pool of groups that can fill it.
export const THIRD_PLACE_SLOT_MAP: Record<string, string[]> = {
  '3ABCDF': ['A', 'B', 'C', 'D', 'F'],
  '3AEHIJ': ['A', 'E', 'H', 'I', 'J'],
  '3BEFIJ': ['B', 'E', 'F', 'I', 'J'],
  '3CDFGH': ['C', 'D', 'F', 'G', 'H'],
  '3CEFHI': ['C', 'E', 'F', 'H', 'I'],
  '3DEIJL': ['D', 'E', 'I', 'J', 'L'],
  '3EFGIJ': ['E', 'F', 'G', 'I', 'J'],
  '3EHIJK': ['E', 'H', 'I', 'J', 'K'],
};
