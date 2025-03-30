export interface Player {
  id: string;
  name: string;
  number: string;
  isOnCourt: boolean;
  stats: {
    points: number;
    assists: number;
    rebounds: number;
    steals: number;
    blocks: number;
    fouls: number;
    fgAttempts: number;
    fgMade: number;
    threePtAttempts: number;
    threePtMade: number;
    ftAttempts: number;
    ftMade: number;
  };
}

export interface Team {
  id: string;
  name: string;
  score: number;
  timeouts: number;
  players: Player[];
}

export interface GameEvent {
  id: string;
  timestamp: number;
  gameTime: string;
  type: 'POINT' | 'FOUL' | 'TIMEOUT' | 'SUBSTITUTION' | 'REBOUND' | 'ASSIST' | 'BLOCK' | 'STEAL';
  playerId: string;
  teamId: string;
  value?: number;
  description: string;
  shotLocation?: { x: number; y: number };
}

export interface GameState {
  gameId: string;
  period: number;
  clock: string;
  isRunning: boolean;
  homeTeam: Team;
  awayTeam: Team;
  events: GameEvent[];
  possession: string; // teamId
} 