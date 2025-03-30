import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useGameClock } from '../hooks/useGameClock';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const ActionButton = ({ label, onPress, color = '#4CAF50', size = 'medium' }: ActionButtonProps) => {
  const buttonSize = {
    small: 60,
    medium: 80,
    large: 100,
  }[size];

  return (
    <Pressable
      style={[
        styles.actionButton,
        {
          backgroundColor: color,
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.actionButtonText}>{label}</Text>
    </Pressable>
  );
};

export const GameControls = () => {
  const { addPoints, addFoul, addTimeout, toggleClock, addEvent } = useGameStore();
  const { homeTeam, awayTeam } = useGameStore();
  const { currentTime, isRunning } = useGameClock();

  const handleAction = (
    teamId: string,
    playerId: string,
    action: string,
    points?: number
  ) => {
    const team = teamId === homeTeam.id ? homeTeam : awayTeam;
    const player = team.players.find(p => p.id === playerId && p.isOnCourt);
    
    if (!player) return;

    switch (action) {
      case 'POINT':
        if (points) {
          addPoints(teamId, playerId, points);
          addEvent({
            type: 'POINT',
            teamId,
            playerId,
            value: points,
            gameTime: currentTime,
            description: `${points}pt by ${player.name}`,
          });
        }
        break;
      case 'FOUL':
        addFoul(teamId, playerId);
        addEvent({
          type: 'FOUL',
          teamId,
          playerId,
          gameTime: currentTime,
          description: `Foul on ${player.name}`,
        });
        break;
      case 'TIMEOUT':
        addTimeout(teamId);
        addEvent({
          type: 'TIMEOUT',
          teamId,
          playerId,
          gameTime: currentTime,
          description: `Timeout ${team.name}`,
        });
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Scoring Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scoring</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            label="1pt"
            color="#2196F3"
            size="small"
            onPress={() => handleAction(homeTeam.id, homeTeam.players[0]?.id, 'POINT', 1)}
          />
          <ActionButton
            label="2pt"
            color="#4CAF50"
            size="medium"
            onPress={() => handleAction(homeTeam.id, homeTeam.players[0]?.id, 'POINT', 2)}
          />
          <ActionButton
            label="3pt"
            color="#FF9800"
            size="large"
            onPress={() => handleAction(homeTeam.id, homeTeam.players[0]?.id, 'POINT', 3)}
          />
        </View>
      </View>

      {/* Game Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Controls</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            label={isRunning ? "⏸" : "⏱"}
            color="#9C27B0"
            onPress={toggleClock}
          />
          <ActionButton
            label="Foul"
            color="#F44336"
            onPress={() => handleAction(homeTeam.id, homeTeam.players[0]?.id, 'FOUL')}
          />
          <ActionButton
            label="T.O."
            color="#607D8B"
            onPress={() => handleAction(homeTeam.id, homeTeam.players[0]?.id, 'TIMEOUT')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 