import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Player, Team } from '../types/game';

interface PlayerCardProps {
  player: Player;
  onPress: () => void;
  isSelected: boolean;
}

const PlayerCard = ({ player, onPress, isSelected }: PlayerCardProps) => (
  <Pressable
    style={[
      styles.playerCard,
      player.isOnCourt && styles.onCourt,
      isSelected && styles.selected,
    ]}
    onPress={onPress}
  >
    <Text style={styles.playerNumber}>{player.number}</Text>
    <Text style={styles.playerName}>{player.name}</Text>
    <View style={styles.statsContainer}>
      <Text style={styles.statText}>{`PTS: ${player.stats.points}`}</Text>
      <Text style={styles.statText}>{`PF: ${player.stats.fouls}`}</Text>
    </View>
  </Pressable>
);

interface SubstitutionModalProps {
  visible: boolean;
  onClose: () => void;
  team: Team;
}

export const SubstitutionModal = ({ visible, onClose, team }: SubstitutionModalProps) => {
  const { togglePlayerOnCourt, addEvent } = useGameStore();
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers(current => {
      if (current.includes(playerId)) {
        return current.filter(id => id !== playerId);
      }
      if (current.length < 2) {
        return [...current, playerId];
      }
      return current;
    });
  };

  const handleSubstitution = () => {
    if (selectedPlayers.length !== 2) return;

    const [outPlayer, inPlayer] = selectedPlayers;
    togglePlayerOnCourt(team.id, outPlayer);
    togglePlayerOnCourt(team.id, inPlayer);

    const outPlayerName = team.players.find(p => p.id === outPlayer)?.name;
    const inPlayerName = team.players.find(p => p.id === inPlayer)?.name;

    addEvent({
      type: 'SUBSTITUTION',
      teamId: team.id,
      playerId: inPlayer,
      gameTime: '12:00', // TODO: Get actual game time
      description: `${inPlayerName} in for ${outPlayerName}`,
    });

    setSelectedPlayers([]);
    onClose();
  };

  const canSubstitute = selectedPlayers.length === 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{`${team.name} - Substitutions`}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.courtSection}>
            <Text style={styles.sectionTitle}>On Court</Text>
            <ScrollView horizontal style={styles.playerList}>
              {team.players
                .filter(p => p.isOnCourt)
                .map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onPress={() => handlePlayerSelect(player.id)}
                    isSelected={selectedPlayers.includes(player.id)}
                  />
                ))}
            </ScrollView>
          </View>

          <View style={styles.benchSection}>
            <Text style={styles.sectionTitle}>Bench</Text>
            <ScrollView horizontal style={styles.playerList}>
              {team.players
                .filter(p => !p.isOnCourt)
                .map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onPress={() => handlePlayerSelect(player.id)}
                    isSelected={selectedPlayers.includes(player.id)}
                  />
                ))}
            </ScrollView>
          </View>

          <Pressable
            style={[styles.substituteButton, !canSubstitute && styles.disabledButton]}
            onPress={handleSubstitution}
            disabled={!canSubstitute}
          >
            <Text style={styles.substituteButtonText}>
              {canSubstitute ? 'Confirm Substitution' : 'Select Players to Substitute'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  courtSection: {
    marginBottom: 24,
  },
  benchSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  playerList: {
    flexDirection: 'row',
  },
  playerCard: {
    width: 120,
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    marginRight: 12,
  },
  onCourt: {
    backgroundColor: '#2a4d69',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  playerNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerName: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  statsContainer: {
    marginTop: 8,
  },
  statText: {
    fontSize: 12,
    color: '#ccc',
  },
  substituteButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  substituteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 