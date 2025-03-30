import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, ScrollView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Player } from '../types/game';

interface RosterManagerProps {
  visible: boolean;
  onClose: () => void;
  teamId: string;
}

interface PlayerFormData {
  name: string;
  number: string;
}

export const RosterManager = ({ visible, onClose, teamId }: RosterManagerProps) => {
  const { homeTeam, awayTeam, updatePlayerStat } = useGameStore();
  const team = teamId === homeTeam.id ? homeTeam : awayTeam;
  const [formData, setFormData] = useState<PlayerFormData>({ name: '', number: '' });

  const handleAddPlayer = () => {
    if (!formData.name || !formData.number) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: formData.name,
      number: formData.number,
      isOnCourt: false,
      stats: {
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        fouls: 0,
        fgAttempts: 0,
        fgMade: 0,
        threePtAttempts: 0,
        threePtMade: 0,
        ftAttempts: 0,
        ftMade: 0,
      },
    };

    // Add the player to the team's roster
    team.players.push(newPlayer);

    // Reset form
    setFormData({ name: '', number: '' });
  };

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
            <Text style={styles.title}>{`${team.name} - Roster Management`}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Add Player Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Player Name"
              placeholderTextColor="#666"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Jersey Number"
              placeholderTextColor="#666"
              value={formData.number}
              onChangeText={(text) => setFormData(prev => ({ ...prev, number: text }))}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Pressable style={styles.addButton} onPress={handleAddPlayer}>
              <Text style={styles.buttonText}>Add Player</Text>
            </Pressable>
          </View>

          {/* Current Roster */}
          <Text style={styles.sectionTitle}>Current Roster</Text>
          <ScrollView style={styles.rosterList}>
            {team.players.map((player) => (
              <View key={player.id} style={styles.playerItem}>
                <Text style={styles.playerNumber}>#{player.number}</Text>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={[styles.playerStatus, player.isOnCourt ? styles.active : styles.bench]}>
                  {player.isOnCourt ? 'Active' : 'Bench'}
                </Text>
              </View>
            ))}
            {team.players.length === 0 && (
              <Text style={styles.emptyText}>No players added yet</Text>
            )}
          </ScrollView>
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
  form: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  rosterList: {
    flex: 1,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 8,
  },
  playerNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    width: 50,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  playerStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  active: {
    color: '#4CAF50',
  },
  bench: {
    color: '#FFA726',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
}); 