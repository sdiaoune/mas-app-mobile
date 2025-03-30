import { create } from 'zustand';
import { GameState, Team, Player, GameEvent } from '../types/game';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameStore extends GameState {
  // Game Actions
  startGame: (homeTeam: Team, awayTeam: Team) => void;
  resetGame: () => void;
  toggleClock: () => void;
  updateClock: (time: string) => void;
  nextPeriod: () => void;
  
  // Scoring Actions
  addPoints: (teamId: string, playerId: string, points: number) => void;
  addFoul: (teamId: string, playerId: string) => void;
  addTimeout: (teamId: string) => void;
  
  // Player Stats Actions
  updatePlayerStat: (
    teamId: string,
    playerId: string,
    stat: keyof Player['stats'],
    value: number
  ) => void;
  togglePlayerOnCourt: (teamId: string, playerId: string) => void;
  
  // Event Actions
  addEvent: (event: Omit<GameEvent, 'id' | 'timestamp'>) => void;
}

const initialState: GameState = {
  gameId: '',
  period: 1,
  clock: '12:00',
  isRunning: false,
  homeTeam: {
    id: '',
    name: '',
    score: 0,
    timeouts: 4,
    players: [],
  },
  awayTeam: {
    id: '',
    name: '',
    score: 0,
    timeouts: 4,
    players: [],
  },
  events: [],
  possession: '',
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: (homeTeam, awayTeam) => set({
        gameId: Date.now().toString(),
        homeTeam,
        awayTeam,
        possession: homeTeam.id,
      }),

      resetGame: () => set(initialState),

      toggleClock: () => set(state => ({ isRunning: !state.isRunning })),

      updateClock: (time) => set({ clock: time }),

      nextPeriod: () => set(state => ({ 
        period: state.period + 1,
        clock: '12:00',
        isRunning: false,
      })),

      addPoints: (teamId, playerId, points) => {
        const state = get();
        const team = teamId === state.homeTeam.id ? 'homeTeam' : 'awayTeam';
        const player = state[team].players.find(p => p.id === playerId);
        
        if (player) {
          set(state => ({
            [team]: {
              ...state[team],
              score: state[team].score + points,
              players: state[team].players.map(p =>
                p.id === playerId
                  ? {
                      ...p,
                      stats: {
                        ...p.stats,
                        points: p.stats.points + points,
                        fgAttempts: p.stats.fgAttempts + 1,
                        fgMade: points > 0 ? p.stats.fgMade + 1 : p.stats.fgMade,
                        threePtAttempts: points === 3 ? p.stats.threePtAttempts + 1 : p.stats.threePtAttempts,
                        threePtMade: points === 3 ? p.stats.threePtMade + 1 : p.stats.threePtMade,
                      },
                    }
                  : p
              ),
            },
          }));
        }
      },

      addFoul: (teamId, playerId) => {
        const state = get();
        const team = teamId === state.homeTeam.id ? 'homeTeam' : 'awayTeam';
        
        set(state => ({
          [team]: {
            ...state[team],
            players: state[team].players.map(p =>
              p.id === playerId
                ? {
                    ...p,
                    stats: {
                      ...p.stats,
                      fouls: p.stats.fouls + 1,
                    },
                  }
                : p
            ),
          },
        }));
      },

      addTimeout: (teamId) => {
        const state = get();
        const team = teamId === state.homeTeam.id ? 'homeTeam' : 'awayTeam';
        
        set(state => ({
          [team]: {
            ...state[team],
            timeouts: Math.max(0, state[team].timeouts - 1),
          },
        }));
      },

      updatePlayerStat: (teamId, playerId, stat, value) => {
        const state = get();
        const team = teamId === state.homeTeam.id ? 'homeTeam' : 'awayTeam';
        
        set(state => ({
          [team]: {
            ...state[team],
            players: state[team].players.map(p =>
              p.id === playerId
                ? {
                    ...p,
                    stats: {
                      ...p.stats,
                      [stat]: value,
                    },
                  }
                : p
            ),
          },
        }));
      },

      togglePlayerOnCourt: (teamId, playerId) => {
        const state = get();
        const team = teamId === state.homeTeam.id ? 'homeTeam' : 'awayTeam';
        
        set(state => ({
          [team]: {
            ...state[team],
            players: state[team].players.map(p =>
              p.id === playerId
                ? { ...p, isOnCourt: !p.isOnCourt }
                : p
            ),
          },
        }));
      },

      addEvent: (event) => set(state => ({
        events: [
          {
            ...event,
            id: Date.now().toString(),
            timestamp: Date.now(),
          },
          ...state.events,
        ],
      })),
    }),
    {
      name: 'basketball-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 