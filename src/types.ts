/**
 * Regole Fantacampagnano - Types
 */

export type Role = 'POR' | 'DIF' | 'CC' | 'ATT';

export interface Player {
  id: string;
  name: string;
  role: Role;
  club?: string;
  vote: number; // Voto base
  goals: number;
  goalsConceded: number;
  ownGoals: number;
  penaltiesMissed: number;
  penaltiesSaved: number;
  yellowCard: boolean;
  redCard: boolean;
  isCaptain: boolean;
  isDNP?: boolean;
}

export interface Team {
  name: string;
  players: Player[];
  isHome: boolean;
  formation?: string;
}

export interface MatchResult {
  team1: TeamCalculations;
  team2: TeamCalculations;
  winner: string | 'Pareggio';
}

export interface Standing {
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface SquadPlayer {
  id: string;
  name: string;
  role: Role;
  club?: string;
  cost: number;
}

export interface Squad {
  id: string;
  name: string;
  players: SquadPlayer[];
  spentCredits: number;
}

export interface UpcomingMatch {
  id: string;
  team1Name: string;
  team2Name: string;
  time?: string;
}

export interface Matchday {
  id: number;
  label: string;
  matches: UpcomingMatch[];
}

export interface HistoricalMatch {
  id: string;
  date: string;
  team1Name: string;
  team2Name: string;
  team1Goals: number;
  team2Goals: number;
  team1Score: number;
  team2Score: number;
  winner: string | 'Pareggio';
}

export interface TeamCalculations {
  basePoints: number;
  eventsPoints: number;
  yellowCardsMalus: number;
  redCardsMalus: number;
  bonuses: number;
  maluses: number;
  modifiers: {
    gkBonus: number;
    dfModifier: number;
    mfModifier: number;
    fwBonus: number;
  };
  captainEffect: number;
  homeBonus: number;
  numPlayersMalus: number;
  totalScore: number;
  goals: number;
  isUnder60: boolean;
  formulaDetails: {
    basePoints: string;
    dfModifier: string;
    mfModifier: string;
    gkBonus: string;
    fwBonus: string;
    captainEffect: string;
    yellowCards: string;
    redCards: string;
    homeBonus: string;
    eventsPoints: string;
    numPlayersMalus: string;
  };
}
