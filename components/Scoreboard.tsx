import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useGameStore } from '../store/gameStore';

export const Scoreboard = () => {
  const { homeTeam, awayTeam, period, clock, isRunning, possession } = useGameStore();

  return (
    <View style={styles.container}>
      <View style={styles.scoreboardContainer}>
        {/* Team Scores */}
        <View style={styles.teamContainer}>
          <View style={[styles.teamScore, possession === homeTeam.id && styles.possessionIndicator]}>
            <Text style={styles.teamName}>{homeTeam.name}</Text>
            <Text style={styles.score}>{homeTeam.score}</Text>
            <Text style={styles.timeouts}>{`Timeouts: ${homeTeam.timeouts}`}</Text>
          </View>
          
          {/* Center Info */}
          <View style={styles.centerInfo}>
            <Text style={styles.period}>{`Q${period}`}</Text>
            <Text style={[styles.clock, isRunning && styles.clockRunning]}>{clock}</Text>
          </View>
          
          <View style={[styles.teamScore, possession === awayTeam.id && styles.possessionIndicator]}>
            <Text style={styles.teamName}>{awayTeam.name}</Text>
            <Text style={styles.score}>{awayTeam.score}</Text>
            <Text style={styles.timeouts}>{`Timeouts: ${awayTeam.timeouts}`}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  scoreboardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  teamScore: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  possessionIndicator: {
    backgroundColor: '#444',
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeouts: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  centerInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  period: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  clock: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  clockRunning: {
    color: '#4CAF50',
  },
}); 