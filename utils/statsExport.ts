import { utils, write } from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Team, GameEvent } from '../types/game';

interface ShotData {
  x: number;
  y: number;
  made: boolean;
  points: number;
}

interface PlayerStats {
  name: string;
  number: string;
  points: number;
  fgAttempts: number;
  fgMade: number;
  fgPercentage: string;
  threePtAttempts: number;
  threePtMade: number;
  threePtPercentage: string;
  ftAttempts: number;
  ftMade: number;
  ftPercentage: string;
  rebounds: number;
  assists: number;
  blocks: number;
  steals: number;
  fouls: number;
  shotChart: ShotData[];
}

interface TeamStats {
  teamName: string;
  totalScore: number;
  players: PlayerStats[];
}

const calculatePercentage = (made: number, attempts: number): string => {
  if (attempts === 0) return '0.0%';
  return `${((made / attempts) * 100).toFixed(1)}%`;
};

const getShotDataForPlayer = (events: GameEvent[], playerId: string): ShotData[] => {
  return events
    .filter(event => event.type === 'POINT' && event.playerId === playerId && event.shotLocation)
    .map(event => ({
      x: event.shotLocation!.x,
      y: event.shotLocation!.y,
      made: event.value! > 0,
      points: event.value || 0,
    }));
};

export const exportGameStats = async (
  homeTeam: Team,
  awayTeam: Team,
  events: GameEvent[],
  gameDate: string
): Promise<void> => {
  const formatTeamStats = (team: Team): TeamStats => ({
    teamName: team.name,
    totalScore: team.score,
    players: team.players.map(player => ({
      name: player.name,
      number: player.number,
      ...player.stats,
      fgPercentage: calculatePercentage(player.stats.fgMade, player.stats.fgAttempts),
      threePtPercentage: calculatePercentage(player.stats.threePtMade, player.stats.threePtAttempts),
      ftPercentage: calculatePercentage(player.stats.ftMade, player.stats.ftAttempts),
      shotChart: getShotDataForPlayer(events, player.id),
    })),
  });

  const homeStats = formatTeamStats(homeTeam);
  const awayStats = formatTeamStats(awayTeam);

  // Create workbook
  const wb = utils.book_new();

  // Box Score worksheet
  const boxScoreData = [
    ['Game Date:', gameDate],
    [],
    [homeTeam.name, '', '', '', awayTeam.name],
    ['Player', 'PTS', 'REB', 'AST', 'Player', 'PTS', 'REB', 'AST'],
    ...homeStats.players.map((player, index) => [
      `${player.number} ${player.name}`,
      player.points,
      player.rebounds,
      player.assists,
      awayStats.players[index] ? `${awayStats.players[index].number} ${awayStats.players[index].name}` : '',
      awayStats.players[index]?.points || '',
      awayStats.players[index]?.rebounds || '',
      awayStats.players[index]?.assists || '',
    ]),
    [],
    ['Total', homeStats.totalScore, '', '', 'Total', awayStats.totalScore],
  ];

  // Detailed Stats worksheet
  const detailedStatsData = [
    ['Detailed Player Statistics'],
    [],
    ['Team', 'Player', '#', 'PTS', 'FGM', 'FGA', 'FG%', '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'REB', 'AST', 'BLK', 'STL', 'PF'],
    ...homeStats.players.map(player => [
      homeTeam.name,
      player.name,
      player.number,
      player.points,
      player.fgMade,
      player.fgAttempts,
      player.fgPercentage,
      player.threePtMade,
      player.threePtAttempts,
      player.threePtPercentage,
      player.ftMade,
      player.ftAttempts,
      player.ftPercentage,
      player.rebounds,
      player.assists,
      player.blocks,
      player.steals,
      player.fouls,
    ]),
    ...awayStats.players.map(player => [
      awayTeam.name,
      player.name,
      player.number,
      player.points,
      player.fgMade,
      player.fgAttempts,
      player.fgPercentage,
      player.threePtMade,
      player.threePtAttempts,
      player.threePtPercentage,
      player.ftMade,
      player.ftAttempts,
      player.ftPercentage,
      player.rebounds,
      player.assists,
      player.blocks,
      player.steals,
      player.fouls,
    ]),
  ];

  // Shot Chart Data worksheet
  const shotChartData = [
    ['Shot Chart Data'],
    [],
    ['Team', 'Player', '#', 'Made', 'Points', 'X', 'Y'],
    ...homeStats.players.flatMap(player =>
      player.shotChart.map(shot => [
        homeTeam.name,
        player.name,
        player.number,
        shot.made ? 'Yes' : 'No',
        shot.points,
        shot.x,
        shot.y,
      ])
    ),
    ...awayStats.players.flatMap(player =>
      player.shotChart.map(shot => [
        awayTeam.name,
        player.name,
        player.number,
        shot.made ? 'Yes' : 'No',
        shot.points,
        shot.x,
        shot.y,
      ])
    ),
  ];

  // Game Log worksheet
  const gameLogData = [
    ['Game Log'],
    [],
    ['Time', 'Team', 'Player', 'Event', 'Description'],
    ...events
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(event => {
        const team = event.teamId === homeTeam.id ? homeTeam : awayTeam;
        const player = team.players.find(p => p.id === event.playerId);
        return [
          event.gameTime,
          team.name,
          player ? `${player.number} ${player.name}` : '',
          event.type,
          event.description,
        ];
      }),
  ];

  // Add worksheets to workbook
  utils.book_append_sheet(wb, utils.aoa_to_sheet(boxScoreData), 'Box Score');
  utils.book_append_sheet(wb, utils.aoa_to_sheet(detailedStatsData), 'Detailed Stats');
  utils.book_append_sheet(wb, utils.aoa_to_sheet(shotChartData), 'Shot Chart Data');
  utils.book_append_sheet(wb, utils.aoa_to_sheet(gameLogData), 'Game Log');

  // Generate Excel file
  const wbout = write(wb, { type: 'base64', bookType: 'xlsx' });
  
  // Create filename with date
  const fileName = `basketball_stats_${gameDate.replace(/[^0-9]/g, '')}.xlsx`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  try {
    // Write file
    await FileSystem.writeAsStringAsync(filePath, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share file
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Export Game Statistics',
      UTI: 'com.microsoft.excel.xlsx',
    });

    // Clean up
    await FileSystem.deleteAsync(filePath);
  } catch (error) {
    console.error('Error exporting stats:', error);
    throw new Error('Failed to export statistics');
  }
}; 