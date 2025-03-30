import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useGameClock } from '../hooks/useGameClock';
import { Team, Player } from '../types/game';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const ActionButton = ({ label, onPress, color = '#4CAF50', size = 'medium', disabled = false }: ActionButtonProps) => {
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
          backgroundColor: disabled ? '#666' : color,
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.actionButtonText}>{label}</Text>
    </Pressable>
  );
};

interface PlayerButtonProps {
  player: Player;
  isSelected: boolean;
  onPress: () => void;
}

const PlayerButton = ({ player, isSelected, onPress }: PlayerButtonProps) => (
  <Pressable
    style={[
      styles.playerButton,
      isSelected && styles.playerButtonSelected,
      !player.isOnCourt && styles.playerButtonBench
    ]}
    onPress={onPress}
  >
    <Text style={styles.playerButtonNumber}>#{player.number}</Text>
    <Text style={styles.playerButtonName}>{player.name}</Text>
    {!player.isOnCourt && (
      <Text style={styles.benchIndicator}>On Bench</Text>
    )}
  </Pressable>
);

export const GameControls = () => {
  const { addPoints, addFoul, addTimeout, toggleClock, addEvent } = useGameStore();
  const { homeTeam, awayTeam } = useGameStore();
  const { currentTime, isRunning } = useGameClock();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setSelectedPlayer(null); // Reset player selection when team changes
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleAction = (action: string, points?: number) => {
    if (!selectedTeam || !selectedPlayer) return;

    switch (action) {
      case 'POINT':
        if (points) {
          addPoints(selectedTeam.id, selectedPlayer.id, points);
          addEvent({
            type: 'POINT',
            teamId: selectedTeam.id,
            playerId: selectedPlayer.id,
            value: points,
            gameTime: currentTime,
            description: `${points}pt by ${selectedPlayer.name}`,
          });
        }
        break;
      case 'FOUL':
        addFoul(selectedTeam.id, selectedPlayer.id);
        addEvent({
          type: 'FOUL',
          teamId: selectedTeam.id,
          playerId: selectedPlayer.id,
          gameTime: currentTime,
          description: `Foul on ${selectedPlayer.name}`,
        });
        break;
      case 'TIMEOUT':
        addTimeout(selectedTeam.id);
        addEvent({
          type: 'TIMEOUT',
          teamId: selectedTeam.id,
          playerId: selectedPlayer.id,
          gameTime: currentTime,
          description: `Timeout ${selectedTeam.name}`,
        });
        break;
    }
  };

  const noPlayerSelected = !selectedPlayer || !selectedPlayer.isOnCourt;

  return (
    <View style={styles.container}>
      {/* Team Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Team</Text>
        <View style={styles.teamButtons}>
          <Pressable
            style={[
              styles.teamButton,
              selectedTeam?.id === homeTeam.id && styles.teamButtonSelected
            ]}
            onPress={() => handleTeamSelect(homeTeam)}
          >
            <Text style={styles.teamButtonText}>{homeTeam.name}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.teamButton,
              selectedTeam?.id === awayTeam.id && styles.teamButtonSelected
            ]}
            onPress={() => handleTeamSelect(awayTeam)}
          >
            <Text style={styles.teamButtonText}>{awayTeam.name}</Text>
          </Pressable>
        </View>
      </View>

      {/* Player Selection */}
      {selectedTeam && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Player</Text>
          <ScrollView horizontal style={styles.playerList}>
            {selectedTeam.players.map((player) => (
              <PlayerButton
                key={player.id}
                player={player}
                isSelected={selectedPlayer?.id === player.id}
                onPress={() => handlePlayerSelect(player)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Scoring Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scoring</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            label="1pt"
            color="#2196F3"
            size="small"
            onPress={() => handleAction('POINT', 1)}
            disabled={noPlayerSelected}
          />
          <ActionButton
            label="2pt"
            color="#4CAF50"
            size="medium"
            onPress={() => handleAction('POINT', 2)}
            disabled={noPlayerSelected}
          />
          <ActionButton
            label="3pt"
            color="#FF9800"
            size="large"
            onPress={() => handleAction('POINT', 3)}
            disabled={noPlayerSelected}
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
            onPress={() => handleAction('FOUL')}
            disabled={noPlayerSelected}
          />
          <ActionButton
            label="T.O."
            color="#607D8B"
            onPress={() => handleAction('TIMEOUT')}
            disabled={!selectedTeam}
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
  teamButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  teamButtonSelected: {
    backgroundColor: '#1976D2',
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  teamButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  playerButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 100,
  },
  playerButtonSelected: {
    backgroundColor: '#1976D2',
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  playerButtonBench: {
    opacity: 0.6,
  },
  playerButtonNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerButtonName: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  benchIndicator: {
    color: '#FFA726',
    fontSize: 12,
    marginTop: 4,
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