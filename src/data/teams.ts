export interface TeamStats {
  id: string;
  name: string;
  flag: string; // ISO 3166-1 alpha-2 code for flagcdn.com
  confederation: string;
  fifaRank: number;
  form: number;       // Win % last 10 matches (0-100)
  goalsScored: number;   // avg per match last 20
  goalsConceded: number; // avg per match last 20
  possession: number; // avg %
  aerialDuels: number;   // % won
  passAccuracy: number;  // %
}

export const teams: Record<string, TeamStats> = {
  // Group A
  MEX: { id: 'MEX', name: 'Mexico', flag: 'mx', confederation: 'CONCACAF', fifaRank: 14, form: 55, goalsScored: 1.6, goalsConceded: 1.0, possession: 52, aerialDuels: 48, passAccuracy: 81 },
  RSA: { id: 'RSA', name: 'South Africa', flag: 'za', confederation: 'CAF', fifaRank: 60, form: 40, goalsScored: 1.0, goalsConceded: 1.4, possession: 43, aerialDuels: 53, passAccuracy: 72 },
  KOR: { id: 'KOR', name: 'South Korea', flag: 'kr', confederation: 'AFC', fifaRank: 25, form: 55, goalsScored: 1.5, goalsConceded: 1.0, possession: 50, aerialDuels: 48, passAccuracy: 81 },
  CZE: { id: 'CZE', name: 'Czech Republic', flag: 'cz', confederation: 'UEFA', fifaRank: 40, form: 45, goalsScored: 1.2, goalsConceded: 1.1, possession: 50, aerialDuels: 52, passAccuracy: 80 },

  // Group B
  CAN: { id: 'CAN', name: 'Canada', flag: 'ca', confederation: 'CONCACAF', fifaRank: 30, form: 50, goalsScored: 1.3, goalsConceded: 1.2, possession: 47, aerialDuels: 53, passAccuracy: 78 },
  BIH: { id: 'BIH', name: 'Bosnia & Herzegovina', flag: 'ba', confederation: 'UEFA', fifaRank: 64, form: 40, goalsScored: 1.1, goalsConceded: 1.3, possession: 46, aerialDuels: 52, passAccuracy: 77 },
  QAT: { id: 'QAT', name: 'Qatar', flag: 'qa', confederation: 'AFC', fifaRank: 56, form: 40, goalsScored: 1.0, goalsConceded: 1.4, possession: 44, aerialDuels: 47, passAccuracy: 75 },
  SUI: { id: 'SUI', name: 'Switzerland', flag: 'ch', confederation: 'UEFA', fifaRank: 19, form: 55, goalsScored: 1.5, goalsConceded: 0.9, possession: 51, aerialDuels: 51, passAccuracy: 83 },

  // Group C
  BRA: { id: 'BRA', name: 'Brazil', flag: 'br', confederation: 'CONMEBOL', fifaRank: 6, form: 70, goalsScored: 2.0, goalsConceded: 0.9, possession: 57, aerialDuels: 51, passAccuracy: 86 },
  MAR: { id: 'MAR', name: 'Morocco', flag: 'ma', confederation: 'CAF', fifaRank: 7, form: 65, goalsScored: 1.5, goalsConceded: 0.8, possession: 48, aerialDuels: 58, passAccuracy: 80 },
  HAI: { id: 'HAI', name: 'Haiti', flag: 'ht', confederation: 'CONCACAF', fifaRank: 83, form: 30, goalsScored: 0.7, goalsConceded: 1.8, possession: 40, aerialDuels: 46, passAccuracy: 68 },
  SCO: { id: 'SCO', name: 'Scotland', flag: 'gb-sct', confederation: 'UEFA', fifaRank: 42, form: 45, goalsScored: 1.2, goalsConceded: 1.1, possession: 49, aerialDuels: 55, passAccuracy: 79 },

  // Group D
  USA: { id: 'USA', name: 'United States', flag: 'us', confederation: 'CONCACAF', fifaRank: 17, form: 60, goalsScored: 1.8, goalsConceded: 1.1, possession: 55, aerialDuels: 52, passAccuracy: 83 },
  PAR: { id: 'PAR', name: 'Paraguay', flag: 'py', confederation: 'CONMEBOL', fifaRank: 41, form: 40, goalsScored: 1.0, goalsConceded: 1.3, possession: 44, aerialDuels: 52, passAccuracy: 75 },
  AUS: { id: 'AUS', name: 'Australia', flag: 'au', confederation: 'AFC', fifaRank: 27, form: 55, goalsScored: 1.4, goalsConceded: 1.1, possession: 48, aerialDuels: 55, passAccuracy: 79 },
  TUR: { id: 'TUR', name: 'Turkey', flag: 'tr', confederation: 'UEFA', fifaRank: 22, form: 50, goalsScored: 1.4, goalsConceded: 1.1, possession: 50, aerialDuels: 52, passAccuracy: 81 },

  // Group E
  GER: { id: 'GER', name: 'Germany', flag: 'de', confederation: 'UEFA', fifaRank: 10, form: 65, goalsScored: 1.9, goalsConceded: 1.0, possession: 58, aerialDuels: 53, passAccuracy: 87 },
  CUW: { id: 'CUW', name: 'Curaçao', flag: 'cw', confederation: 'CONCACAF', fifaRank: 82, form: 30, goalsScored: 0.8, goalsConceded: 1.9, possession: 41, aerialDuels: 48, passAccuracy: 69 },
  CIV: { id: 'CIV', name: 'Ivory Coast', flag: 'ci', confederation: 'CAF', fifaRank: 33, form: 50, goalsScored: 1.4, goalsConceded: 1.1, possession: 47, aerialDuels: 57, passAccuracy: 76 },
  ECU: { id: 'ECU', name: 'Ecuador', flag: 'ec', confederation: 'CONMEBOL', fifaRank: 23, form: 50, goalsScored: 1.3, goalsConceded: 1.1, possession: 47, aerialDuels: 53, passAccuracy: 77 },

  // Group F
  NED: { id: 'NED', name: 'Netherlands', flag: 'nl', confederation: 'UEFA', fifaRank: 8, form: 65, goalsScored: 1.9, goalsConceded: 0.9, possession: 56, aerialDuels: 52, passAccuracy: 86 },
  JPN: { id: 'JPN', name: 'Japan', flag: 'jp', confederation: 'AFC', fifaRank: 18, form: 65, goalsScored: 1.8, goalsConceded: 1.0, possession: 52, aerialDuels: 45, passAccuracy: 83 },
  SWE: { id: 'SWE', name: 'Sweden', flag: 'se', confederation: 'UEFA', fifaRank: 38, form: 45, goalsScored: 1.2, goalsConceded: 1.0, possession: 50, aerialDuels: 54, passAccuracy: 81 },
  TUN: { id: 'TUN', name: 'Tunisia', flag: 'tn', confederation: 'CAF', fifaRank: 45, form: 40, goalsScored: 1.0, goalsConceded: 1.2, possession: 44, aerialDuels: 53, passAccuracy: 74 },

  // Group G
  BEL: { id: 'BEL', name: 'Belgium', flag: 'be', confederation: 'UEFA', fifaRank: 9, form: 60, goalsScored: 1.7, goalsConceded: 0.9, possession: 53, aerialDuels: 51, passAccuracy: 84 },
  EGY: { id: 'EGY', name: 'Egypt', flag: 'eg', confederation: 'CAF', fifaRank: 29, form: 50, goalsScored: 1.3, goalsConceded: 0.9, possession: 50, aerialDuels: 52, passAccuracy: 79 },
  IRN: { id: 'IRN', name: 'Iran', flag: 'ir', confederation: 'AFC', fifaRank: 20, form: 50, goalsScored: 1.2, goalsConceded: 0.9, possession: 47, aerialDuels: 52, passAccuracy: 78 },
  NZL: { id: 'NZL', name: 'New Zealand', flag: 'nz', confederation: 'OFC', fifaRank: 85, form: 30, goalsScored: 0.8, goalsConceded: 1.7, possession: 41, aerialDuels: 49, passAccuracy: 70 },

  // Group H
  ESP: { id: 'ESP', name: 'Spain', flag: 'es', confederation: 'UEFA', fifaRank: 2, form: 75, goalsScored: 2.2, goalsConceded: 0.6, possession: 65, aerialDuels: 48, passAccuracy: 91 },
  CPV: { id: 'CPV', name: 'Cape Verde', flag: 'cv', confederation: 'CAF', fifaRank: 67, form: 40, goalsScored: 1.0, goalsConceded: 1.3, possession: 43, aerialDuels: 54, passAccuracy: 72 },
  SAU: { id: 'SAU', name: 'Saudi Arabia', flag: 'sa', confederation: 'AFC', fifaRank: 61, form: 40, goalsScored: 1.0, goalsConceded: 1.4, possession: 43, aerialDuels: 48, passAccuracy: 74 },
  URU: { id: 'URU', name: 'Uruguay', flag: 'uy', confederation: 'CONMEBOL', fifaRank: 16, form: 60, goalsScored: 1.6, goalsConceded: 0.9, possession: 50, aerialDuels: 57, passAccuracy: 80 },

  // Group I
  FRA: { id: 'FRA', name: 'France', flag: 'fr', confederation: 'UEFA', fifaRank: 3, form: 75, goalsScored: 2.3, goalsConceded: 0.8, possession: 56, aerialDuels: 52, passAccuracy: 87 },
  SEN: { id: 'SEN', name: 'Senegal', flag: 'sn', confederation: 'CAF', fifaRank: 15, form: 60, goalsScored: 1.7, goalsConceded: 1.0, possession: 48, aerialDuels: 58, passAccuracy: 78 },
  IRQ: { id: 'IRQ', name: 'Iraq', flag: 'iq', confederation: 'AFC', fifaRank: 57, form: 40, goalsScored: 1.1, goalsConceded: 1.4, possession: 44, aerialDuels: 51, passAccuracy: 74 },
  NOR: { id: 'NOR', name: 'Norway', flag: 'no', confederation: 'UEFA', fifaRank: 31, form: 55, goalsScored: 1.7, goalsConceded: 1.0, possession: 50, aerialDuels: 52, passAccuracy: 81 },

  // Group J
  ARG: { id: 'ARG', name: 'Argentina', flag: 'ar', confederation: 'CONMEBOL', fifaRank: 1, form: 80, goalsScored: 2.4, goalsConceded: 0.7, possession: 58, aerialDuels: 54, passAccuracy: 88 },
  ALG: { id: 'ALG', name: 'Algeria', flag: 'dz', confederation: 'CAF', fifaRank: 28, form: 50, goalsScored: 1.3, goalsConceded: 1.0, possession: 48, aerialDuels: 54, passAccuracy: 77 },
  AUT: { id: 'AUT', name: 'Austria', flag: 'at', confederation: 'UEFA', fifaRank: 24, form: 55, goalsScored: 1.4, goalsConceded: 1.0, possession: 52, aerialDuels: 51, passAccuracy: 83 },
  JOR: { id: 'JOR', name: 'Jordan', flag: 'jo', confederation: 'AFC', fifaRank: 63, form: 40, goalsScored: 1.0, goalsConceded: 1.3, possession: 44, aerialDuels: 50, passAccuracy: 73 },

  // Group K
  POR: { id: 'POR', name: 'Portugal', flag: 'pt', confederation: 'UEFA', fifaRank: 5, form: 70, goalsScored: 2.1, goalsConceded: 0.9, possession: 54, aerialDuels: 50, passAccuracy: 85 },
  COD: { id: 'COD', name: 'DR Congo', flag: 'cd', confederation: 'CAF', fifaRank: 46, form: 40, goalsScored: 1.1, goalsConceded: 1.3, possession: 44, aerialDuels: 55, passAccuracy: 72 },
  UZB: { id: 'UZB', name: 'Uzbekistan', flag: 'uz', confederation: 'AFC', fifaRank: 50, form: 45, goalsScored: 1.1, goalsConceded: 1.2, possession: 46, aerialDuels: 50, passAccuracy: 76 },
  COL: { id: 'COL', name: 'Colombia', flag: 'co', confederation: 'CONMEBOL', fifaRank: 13, form: 60, goalsScored: 1.6, goalsConceded: 1.0, possession: 51, aerialDuels: 50, passAccuracy: 81 },

  // Group L
  ENG: { id: 'ENG', name: 'England', flag: 'gb-eng', confederation: 'UEFA', fifaRank: 4, form: 70, goalsScored: 2.0, goalsConceded: 0.9, possession: 55, aerialDuels: 55, passAccuracy: 85 },
  CRO: { id: 'CRO', name: 'Croatia', flag: 'hr', confederation: 'UEFA', fifaRank: 11, form: 60, goalsScored: 1.5, goalsConceded: 0.8, possession: 52, aerialDuels: 53, passAccuracy: 83 },
  GHA: { id: 'GHA', name: 'Ghana', flag: 'gh', confederation: 'CAF', fifaRank: 73, form: 35, goalsScored: 0.9, goalsConceded: 1.5, possession: 43, aerialDuels: 54, passAccuracy: 71 },
  PAN: { id: 'PAN', name: 'Panama', flag: 'pa', confederation: 'CONCACAF', fifaRank: 34, form: 45, goalsScored: 1.1, goalsConceded: 1.2, possession: 44, aerialDuels: 55, passAccuracy: 74 },
};
