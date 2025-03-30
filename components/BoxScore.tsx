import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Player } from '../types/game';

const StatHeader = ({ label }: { label: string }) => (
  <Text style={styles.headerCell}>{label}</Text>
);

const StatCell = ({ value }: { value: number | string }) => (
  <Text style={styles.cell}>{value}</Text>
);

const PlayerRow = ({ player }: { player: Player }) => {
  const { stats } = player;
  const fgPercentage = stats.fgAttempts > 0
    ? Math.round((stats.fgMade / stats.fgAttempts) * 100)
    : 0;
  const threePtPercentage = stats.threePtAttempts > 0
    ? Math.round((stats.threePtMade / stats.threePtAttempts) * 100)
    : 0;
  const ftPercentage = stats.ftAttempts > 0
    ? Math.round((stats.ftMade / stats.ftAttempts) * 100)
    : 0;

  return (
    <View style={[styles.row, !player.isOnCourt && styles.benchPlayer]}>
      <Text style={styles.playerName}>{`${player.number} ${player.name}`}</Text>
      <StatCell value={stats.points} />
      <StatCell value={`${stats.fgMade}/${stats.fgAttempts}`} />
      <StatCell value={`${fgPercentage}%`} />
      <StatCell value={`${stats.threePtMade}/${stats.threePtAttempts}`} />
      <StatCell value={`${threePtPercentage}%`} />
      <StatCell value={`${stats.ftMade}/${stats.ftAttempts}`} />
      <StatCell value={`${ftPercentage}%`} />
      <StatCell value={stats.rebounds} />
      <StatCell value={stats.assists} />
      <StatCell value={stats.steals} />
      <StatCell value={stats.blocks} />
      <StatCell value={stats.fouls} />
    </View>
  );
};

const TeamBoxScore = ({ players, teamName }: { players: Player[], teamName: string }) => (
  <View style={styles.teamSection}>
    <Text style={styles.teamName}>{teamName}</Text>
    <View style={styles.headerRow}>
      <Text style={styles.playerNameHeader}>Player</Text>
      <StatHeader label="PTS" />
      <StatHeader label="FG" />
      <StatHeader label="FG%" />
      <StatHeader label="3P" />
      <StatHeader label="3P%" />
      <StatHeader label="FT" />
      <StatHeader label="FT%" />
      <StatHeader label="REB" />
      <StatHeader label="AST" />
      <StatHeader label="STL" />
      <StatHeader label="BLK" />
      <StatHeader label="PF" />
    </View>
    {players.map((player) => (
      <PlayerRow key={player.id} player={player} />
    ))}
  </View>
);

export const BoxScore = () => {
  const { homeTeam, awayTeam } = useGameStore();

  return (
    <ScrollView style={styles.container} horizontal>
      <ScrollView>
        <TeamBoxScore players={homeTeam.players} teamName={homeTeam.name} />
        <View style={styles.divider} />
        <TeamBoxScore players={awayTeam.players} teamName={awayTeam.name} />
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  teamSection: {
    padding: 16,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  benchPlayer: {
    opacity: 0.6,
  },
  playerNameHeader: {
    width: 120,
    color: '#fff',
    fontWeight: 'bold',
  },
  playerName: {
    width: 120,
    color: '#fff',
  },
  headerCell: {
    width: 60,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  cell: {
    width: 60,
    textAlign: 'center',
    color: '#fff',
  },
  divider: {
    height: 2,
    backgroundColor: '#333',
    marginVertical: 16,
  },
}); 