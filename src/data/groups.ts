export interface Fixture {
  id: string;
  home: string;
  away: string;
  date: string;
  stage: 'group';
}

export interface Group {
  id: string;
  name: string;
  teams: string[];
  fixtures: Fixture[];
}

export const groups: Group[] = [
  {
    id: 'A',
    name: 'Group A',
    teams: ['MEX', 'RSA', 'KOR', 'CZE'],
    fixtures: [
      { id: 'A1', home: 'MEX', away: 'RSA', date: '2026-06-11', stage: 'group' },
      { id: 'A2', home: 'KOR', away: 'CZE', date: '2026-06-11', stage: 'group' },
      { id: 'A3', home: 'CZE', away: 'RSA', date: '2026-06-18', stage: 'group' },
      { id: 'A4', home: 'MEX', away: 'KOR', date: '2026-06-18', stage: 'group' },
      { id: 'A5', home: 'CZE', away: 'MEX', date: '2026-06-24', stage: 'group' },
      { id: 'A6', home: 'RSA', away: 'KOR', date: '2026-06-24', stage: 'group' },
    ],
  },
  {
    id: 'B',
    name: 'Group B',
    teams: ['CAN', 'BIH', 'QAT', 'SUI'],
    fixtures: [
      { id: 'B1', home: 'CAN', away: 'BIH', date: '2026-06-12', stage: 'group' },
      { id: 'B2', home: 'QAT', away: 'SUI', date: '2026-06-13', stage: 'group' },
      { id: 'B3', home: 'SUI', away: 'BIH', date: '2026-06-18', stage: 'group' },
      { id: 'B4', home: 'CAN', away: 'QAT', date: '2026-06-18', stage: 'group' },
      { id: 'B5', home: 'SUI', away: 'CAN', date: '2026-06-24', stage: 'group' },
      { id: 'B6', home: 'BIH', away: 'QAT', date: '2026-06-24', stage: 'group' },
    ],
  },
  {
    id: 'C',
    name: 'Group C',
    teams: ['BRA', 'MAR', 'HAI', 'SCO'],
    fixtures: [
      { id: 'C1', home: 'BRA', away: 'MAR', date: '2026-06-13', stage: 'group' },
      { id: 'C2', home: 'HAI', away: 'SCO', date: '2026-06-13', stage: 'group' },
      { id: 'C3', home: 'SCO', away: 'MAR', date: '2026-06-19', stage: 'group' },
      { id: 'C4', home: 'BRA', away: 'HAI', date: '2026-06-19', stage: 'group' },
      { id: 'C5', home: 'SCO', away: 'BRA', date: '2026-06-24', stage: 'group' },
      { id: 'C6', home: 'MAR', away: 'HAI', date: '2026-06-24', stage: 'group' },
    ],
  },
  {
    id: 'D',
    name: 'Group D',
    teams: ['USA', 'PAR', 'AUS', 'TUR'],
    fixtures: [
      { id: 'D1', home: 'USA', away: 'PAR', date: '2026-06-12', stage: 'group' },
      { id: 'D2', home: 'AUS', away: 'TUR', date: '2026-06-13', stage: 'group' },
      { id: 'D3', home: 'USA', away: 'AUS', date: '2026-06-19', stage: 'group' },
      { id: 'D4', home: 'TUR', away: 'PAR', date: '2026-06-19', stage: 'group' },
      { id: 'D5', home: 'TUR', away: 'USA', date: '2026-06-25', stage: 'group' },
      { id: 'D6', home: 'PAR', away: 'AUS', date: '2026-06-25', stage: 'group' },
    ],
  },
  {
    id: 'E',
    name: 'Group E',
    teams: ['GER', 'CUW', 'CIV', 'ECU'],
    fixtures: [
      { id: 'E1', home: 'GER', away: 'CUW', date: '2026-06-14', stage: 'group' },
      { id: 'E2', home: 'CIV', away: 'ECU', date: '2026-06-14', stage: 'group' },
      { id: 'E3', home: 'GER', away: 'CIV', date: '2026-06-20', stage: 'group' },
      { id: 'E4', home: 'ECU', away: 'CUW', date: '2026-06-20', stage: 'group' },
      { id: 'E5', home: 'CUW', away: 'CIV', date: '2026-06-25', stage: 'group' },
      { id: 'E6', home: 'ECU', away: 'GER', date: '2026-06-25', stage: 'group' },
    ],
  },
  {
    id: 'F',
    name: 'Group F',
    teams: ['NED', 'JPN', 'SWE', 'TUN'],
    fixtures: [
      { id: 'F1', home: 'NED', away: 'JPN', date: '2026-06-14', stage: 'group' },
      { id: 'F2', home: 'SWE', away: 'TUN', date: '2026-06-14', stage: 'group' },
      { id: 'F3', home: 'NED', away: 'SWE', date: '2026-06-20', stage: 'group' },
      { id: 'F4', home: 'TUN', away: 'JPN', date: '2026-06-20', stage: 'group' },
      { id: 'F5', home: 'JPN', away: 'SWE', date: '2026-06-25', stage: 'group' },
      { id: 'F6', home: 'TUN', away: 'NED', date: '2026-06-25', stage: 'group' },
    ],
  },
  {
    id: 'G',
    name: 'Group G',
    teams: ['BEL', 'EGY', 'IRN', 'NZL'],
    fixtures: [
      { id: 'G1', home: 'IRN', away: 'NZL', date: '2026-06-15', stage: 'group' },
      { id: 'G2', home: 'BEL', away: 'EGY', date: '2026-06-15', stage: 'group' },
      { id: 'G3', home: 'BEL', away: 'IRN', date: '2026-06-21', stage: 'group' },
      { id: 'G4', home: 'NZL', away: 'EGY', date: '2026-06-21', stage: 'group' },
      { id: 'G5', home: 'EGY', away: 'IRN', date: '2026-06-26', stage: 'group' },
      { id: 'G6', home: 'NZL', away: 'BEL', date: '2026-06-26', stage: 'group' },
    ],
  },
  {
    id: 'H',
    name: 'Group H',
    teams: ['ESP', 'CPV', 'SAU', 'URU'],
    fixtures: [
      { id: 'H1', home: 'SAU', away: 'URU', date: '2026-06-15', stage: 'group' },
      { id: 'H2', home: 'ESP', away: 'CPV', date: '2026-06-15', stage: 'group' },
      { id: 'H3', home: 'URU', away: 'CPV', date: '2026-06-21', stage: 'group' },
      { id: 'H4', home: 'ESP', away: 'SAU', date: '2026-06-21', stage: 'group' },
      { id: 'H5', home: 'CPV', away: 'SAU', date: '2026-06-26', stage: 'group' },
      { id: 'H6', home: 'URU', away: 'ESP', date: '2026-06-26', stage: 'group' },
    ],
  },
  {
    id: 'I',
    name: 'Group I',
    teams: ['FRA', 'SEN', 'IRQ', 'NOR'],
    fixtures: [
      { id: 'I1', home: 'FRA', away: 'SEN', date: '2026-06-16', stage: 'group' },
      { id: 'I2', home: 'IRQ', away: 'NOR', date: '2026-06-16', stage: 'group' },
      { id: 'I3', home: 'FRA', away: 'IRQ', date: '2026-06-22', stage: 'group' },
      { id: 'I4', home: 'NOR', away: 'SEN', date: '2026-06-22', stage: 'group' },
      { id: 'I5', home: 'NOR', away: 'FRA', date: '2026-06-26', stage: 'group' },
      { id: 'I6', home: 'SEN', away: 'IRQ', date: '2026-06-26', stage: 'group' },
    ],
  },
  {
    id: 'J',
    name: 'Group J',
    teams: ['ARG', 'ALG', 'AUT', 'JOR'],
    fixtures: [
      { id: 'J1', home: 'ARG', away: 'ALG', date: '2026-06-16', stage: 'group' },
      { id: 'J2', home: 'AUT', away: 'JOR', date: '2026-06-16', stage: 'group' },
      { id: 'J3', home: 'ARG', away: 'AUT', date: '2026-06-22', stage: 'group' },
      { id: 'J4', home: 'JOR', away: 'ALG', date: '2026-06-22', stage: 'group' },
      { id: 'J5', home: 'ALG', away: 'AUT', date: '2026-06-27', stage: 'group' },
      { id: 'J6', home: 'JOR', away: 'ARG', date: '2026-06-27', stage: 'group' },
    ],
  },
  {
    id: 'K',
    name: 'Group K',
    teams: ['POR', 'COD', 'UZB', 'COL'],
    fixtures: [
      { id: 'K1', home: 'POR', away: 'COD', date: '2026-06-17', stage: 'group' },
      { id: 'K2', home: 'UZB', away: 'COL', date: '2026-06-17', stage: 'group' },
      { id: 'K3', home: 'POR', away: 'UZB', date: '2026-06-23', stage: 'group' },
      { id: 'K4', home: 'COL', away: 'COD', date: '2026-06-23', stage: 'group' },
      { id: 'K5', home: 'COL', away: 'POR', date: '2026-06-27', stage: 'group' },
      { id: 'K6', home: 'COD', away: 'UZB', date: '2026-06-27', stage: 'group' },
    ],
  },
  {
    id: 'L',
    name: 'Group L',
    teams: ['ENG', 'CRO', 'GHA', 'PAN'],
    fixtures: [
      { id: 'L1', home: 'ENG', away: 'CRO', date: '2026-06-17', stage: 'group' },
      { id: 'L2', home: 'GHA', away: 'PAN', date: '2026-06-17', stage: 'group' },
      { id: 'L3', home: 'ENG', away: 'GHA', date: '2026-06-23', stage: 'group' },
      { id: 'L4', home: 'PAN', away: 'CRO', date: '2026-06-23', stage: 'group' },
      { id: 'L5', home: 'PAN', away: 'ENG', date: '2026-06-27', stage: 'group' },
      { id: 'L6', home: 'CRO', away: 'GHA', date: '2026-06-27', stage: 'group' },
    ],
  },
];
