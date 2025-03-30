import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
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

type MissType = 'BLOCKED' | 'REBOUNDED' | 'OUT_OF_BOUNDS';

interface MissDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (missType: MissType, byPlayerId?: string) => void;
  opposingTeam: Team;
  shootingTeam: Team;
  shootingPlayerId: string;
}

const MissDetailsModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  opposingTeam,
  shootingTeam,
  shootingPlayerId
}: MissDetailsModalProps) => {
  const [selectedType, setSelectedType] = useState<MissType | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleConfirm = () => {
    if (!selectedType) return;
    onConfirm(selectedType, selectedPlayer?.id);
    setSelectedType(null);
    setSelectedPlayer(null);
  };

  const needsPlayer = selectedType === 'BLOCKED' || selectedType === 'REBOUNDED';

  // Get available players based on the selected miss type
  const availablePlayers = useMemo(() => {
    if (selectedType === 'BLOCKED') {
      // For blocks, only show opposing team's active players
      return opposingTeam.players.filter(p => p.isOnCourt);
    } else if (selectedType === 'REBOUNDED') {
      // For rebounds, show all active players except the shooter
      return [
        ...shootingTeam.players.filter(p => p.isOnCourt && p.id !== shootingPlayerId),
        ...opposingTeam.players.filter(p => p.isOnCourt)
      ];
    }
    return [];
  }, [selectedType, opposingTeam.players, shootingTeam.players, shootingPlayerId]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Shot Details</Text>
          
          <View style={styles.missTypeButtons}>
            <Pressable
              style={[
                styles.missTypeButton,
                selectedType === 'BLOCKED' && styles.missTypeButtonSelected
              ]}
              onPress={() => {
                setSelectedType('BLOCKED');
                setSelectedPlayer(null); // Reset player selection when type changes
              }}
            >
              <Text style={styles.missTypeButtonText}>Blocked</Text>
            </Pressable>
            <Pressable
              style={[
                styles.missTypeButton,
                selectedType === 'REBOUNDED' && styles.missTypeButtonSelected
              ]}
              onPress={() => {
                setSelectedType('REBOUNDED');
                setSelectedPlayer(null); // Reset player selection when type changes
              }}
            >
              <Text style={styles.missTypeButtonText}>Rebounded</Text>
            </Pressable>
            <Pressable
              style={[
                styles.missTypeButton,
                selectedType === 'OUT_OF_BOUNDS' && styles.missTypeButtonSelected
              ]}
              onPress={() => {
                setSelectedType('OUT_OF_BOUNDS');
                setSelectedPlayer(null); // Reset player selection when type changes
              }}
            >
              <Text style={styles.missTypeButtonText}>Out of Bounds</Text>
            </Pressable>
          </View>

          {needsPlayer && (
            <View style={styles.playerSelection}>
              <Text style={styles.modalSubtitle}>
                {selectedType === 'BLOCKED' ? 'Select Blocking Player' : 'Select Rebounding Player'}
              </Text>
              <ScrollView horizontal style={styles.playerList}>
                {availablePlayers.map((player) => (
                  <PlayerButton
                    key={player.id}
                    player={player}
                    isSelected={selectedPlayer?.id === player.id}
                    onPress={() => setSelectedPlayer(player)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalButton,
                styles.modalButtonConfirm,
                (!selectedType || (needsPlayer && !selectedPlayer)) && styles.modalButtonDisabled
              ]}
              onPress={handleConfirm}
              disabled={!selectedType || (needsPlayer && !selectedPlayer)}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const GameControls = () => {
  const { addPoints, addFoul, addTimeout, toggleClock, addEvent } = useGameStore();
  const { homeTeam, awayTeam } = useGameStore();
  const { currentTime, isRunning } = useGameClock();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [missModalVisible, setMissModalVisible] = useState(false);
  const [missPoints, setMissPoints] = useState<number | null>(null);

  // Calculate active players count for both teams
  const activePlayersCount = useMemo(() => ({
    home: homeTeam.players.filter(p => p.isOnCourt).length,
    away: awayTeam.players.filter(p => p.isOnCourt).length
  }), [homeTeam.players, awayTeam.players]);

  // Check if game can proceed (both teams have at least 5 active players)
  const canGameProceed = activePlayersCount.home >= 5 && activePlayersCount.away >= 5;

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setSelectedPlayer(null);
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleAction = (action: string, points?: number) => {
    if (!selectedTeam || !selectedPlayer || !canGameProceed) return;

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

  const handleMiss = (points: number) => {
    setMissPoints(points);
    setMissModalVisible(true);
  };

  const handleMissConfirm = (missType: MissType, byPlayerId?: string) => {
    if (!selectedTeam || !selectedPlayer || !missPoints) return;

    const byPlayerTeamId = byPlayerId ? 
      (byPlayerId === selectedTeam.id ? selectedTeam.id : opposingTeam.id) : undefined;
    
    const byPlayer = byPlayerId ? 
      ([...selectedTeam.players, ...opposingTeam.players]).find(p => p.id === byPlayerId) : 
      undefined;

    // Add the primary miss event
    addEvent({
      type: 'POINT',
      teamId: selectedTeam.id,
      playerId: selectedPlayer.id,
      value: 0, // 0 points for a miss
      gameTime: currentTime,
      description: `Missed ${missPoints}pt shot by ${selectedPlayer.name}`,
    });

    // Add the corresponding event based on miss type
    if (missType === 'BLOCKED' && byPlayerId) {
      addEvent({
        type: 'BLOCK',
        teamId: opposingTeam.id, // Blocks can only come from opposing team
        playerId: byPlayerId,
        gameTime: currentTime,
        description: `Block by ${byPlayer?.name}`,
      });
    } else if (missType === 'REBOUNDED' && byPlayerId && byPlayerTeamId) {
      addEvent({
        type: 'REBOUND',
        teamId: byPlayerTeamId, // Rebounds can come from either team
        playerId: byPlayerId,
        gameTime: currentTime,
        description: `Rebound by ${byPlayer?.name}`,
      });
    }

    setMissModalVisible(false);
    setMissPoints(null);
  };

  const noPlayerSelected = !selectedPlayer || !selectedPlayer.isOnCourt;
  const isActionDisabled = noPlayerSelected || !canGameProceed;

  const opposingTeam = selectedTeam?.id === homeTeam.id ? awayTeam : homeTeam;

  return (
    <View style={styles.container}>
      {!canGameProceed && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Each team must have at least 5 players on court to start the game
          </Text>
          <View style={styles.teamStatusContainer}>
            <Text style={styles.teamStatus}>
              {homeTeam.name}: {activePlayersCount.home}/5 players
            </Text>
            <Text style={styles.teamStatus}>
              {awayTeam.name}: {activePlayersCount.away}/5 players
            </Text>
          </View>
        </View>
      )}

      {/* Team Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Team</Text>
        <View style={styles.teamButtons}>
          <Pressable
            style={[
              styles.teamButton,
              selectedTeam?.id === homeTeam.id && styles.teamButtonSelected,
              activePlayersCount.home < 5 && styles.teamButtonWarning
            ]}
            onPress={() => handleTeamSelect(homeTeam)}
          >
            <Text style={styles.teamButtonText}>{homeTeam.name}</Text>
            <Text style={styles.playerCount}>
              {activePlayersCount.home}/5 players
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.teamButton,
              selectedTeam?.id === awayTeam.id && styles.teamButtonSelected,
              activePlayersCount.away < 5 && styles.teamButtonWarning
            ]}
            onPress={() => handleTeamSelect(awayTeam)}
          >
            <Text style={styles.teamButtonText}>{awayTeam.name}</Text>
            <Text style={styles.playerCount}>
              {activePlayersCount.away}/5 players
            </Text>
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
          <View style={styles.pointColumn}>
            <ActionButton
              label="1pt"
              color="#2196F3"
              size="small"
              onPress={() => handleAction('POINT', 1)}
              disabled={isActionDisabled}
            />
            <ActionButton
              label="Miss"
              color="#B71C1C"
              size="small"
              onPress={() => handleMiss(1)}
              disabled={isActionDisabled}
            />
          </View>
          <View style={styles.pointColumn}>
            <ActionButton
              label="2pt"
              color="#4CAF50"
              size="medium"
              onPress={() => handleAction('POINT', 2)}
              disabled={isActionDisabled}
            />
            <ActionButton
              label="Miss"
              color="#B71C1C"
              size="medium"
              onPress={() => handleMiss(2)}
              disabled={isActionDisabled}
            />
          </View>
          <View style={styles.pointColumn}>
            <ActionButton
              label="3pt"
              color="#FF9800"
              size="large"
              onPress={() => handleAction('POINT', 3)}
              disabled={isActionDisabled}
            />
            <ActionButton
              label="Miss"
              color="#B71C1C"
              size="large"
              onPress={() => handleMiss(3)}
              disabled={isActionDisabled}
            />
          </View>
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
            disabled={!canGameProceed}
          />
          <ActionButton
            label="Foul"
            color="#F44336"
            onPress={() => handleAction('FOUL')}
            disabled={isActionDisabled}
          />
          <ActionButton
            label="T.O."
            color="#607D8B"
            onPress={() => handleAction('TIMEOUT')}
            disabled={!selectedTeam || !canGameProceed}
          />
        </View>
      </View>

      <MissDetailsModal
        visible={missModalVisible}
        onClose={() => {
          setMissModalVisible(false);
          setMissPoints(null);
        }}
        onConfirm={handleMissConfirm}
        opposingTeam={opposingTeam ?? homeTeam}
        shootingTeam={selectedTeam ?? homeTeam}
        shootingPlayerId={selectedPlayer?.id ?? ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  warningContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#E65100',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  teamStatusContainer: {
    marginTop: 8,
  },
  teamStatus: {
    color: '#E65100',
    fontSize: 14,
    textAlign: 'center',
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
  teamButtonWarning: {
    borderWidth: 2,
    borderColor: '#FFA726',
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
  playerCount: {
    color: '#FFA726',
    fontSize: 12,
    marginTop: 4,
  },
  pointColumn: {
    alignItems: 'center',
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  missTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  missTypeButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  missTypeButtonSelected: {
    backgroundColor: '#1976D2',
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  missTypeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerSelection: {
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
  },
  modalButtonCancel: {
    backgroundColor: '#666',
  },
  modalButtonConfirm: {
    backgroundColor: '#4CAF50',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 