import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { Scoreboard } from '../components/Scoreboard';
import { GameControls } from '../components/GameControls';
import { BoxScore } from '../components/BoxScore';
import { GameLog } from '../components/GameLog';
import { SubstitutionModal } from '../components/SubstitutionModal';
import { ClockEditor } from '../components/ClockEditor';
import { RosterManager } from '../components/RosterManager';
import { useGameStore } from '../store/gameStore';

export default function App() {
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [showClockEditor, setShowClockEditor] = useState(false);
  const [showRosterManager, setShowRosterManager] = useState(false);
  const [activeTeamForSub, setActiveTeamForSub] = useState<'home' | 'away'>('home');
  const { homeTeam, awayTeam, startGame } = useGameStore();

  // Initialize a new game if there's no active game
  React.useEffect(() => {
    if (!homeTeam.id || !awayTeam.id) {
      // Sample data - in a real app, this would come from user input
      startGame(
        {
          id: '1',
          name: 'Home Team',
          score: 0,
          timeouts: 4,
          players: [
            {
              id: '1',
              name: 'John Doe',
              number: '23',
              isOnCourt: true,
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
            },
            // Add more players...
          ],
        },
        {
          id: '2',
          name: 'Away Team',
          score: 0,
          timeouts: 4,
          players: [
            {
              id: '3',
              name: 'Jane Smith',
              number: '11',
              isOnCourt: true,
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
            },
            // Add more players...
          ],
        }
      );
    }
  }, []);

  const handleSubstitution = (team: 'home' | 'away') => {
    setActiveTeamForSub(team);
    setShowSubstitutionModal(true);
  };

  const handleRosterManagement = (team: 'home' | 'away') => {
    setActiveTeamForSub(team);
    setShowRosterManager(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Scoreboard Section */}
        <Pressable onPress={() => setShowClockEditor(true)}>
          <Scoreboard />
        </Pressable>

        {/* Game Controls Section */}
        <GameControls />

        {/* Team Management Section */}
        <View style={styles.teamControls}>
          <View style={styles.teamButtons}>
            <Pressable
              style={styles.rosterButton}
              onPress={() => handleRosterManagement('home')}
            >
              <Text style={styles.buttonText}>Home Roster</Text>
            </Pressable>
            <Pressable
              style={styles.subButton}
              onPress={() => handleSubstitution('home')}
            >
              <Text style={styles.buttonText}>Home Sub</Text>
            </Pressable>
          </View>

          <View style={styles.teamButtons}>
            <Pressable
              style={styles.rosterButton}
              onPress={() => handleRosterManagement('away')}
            >
              <Text style={styles.buttonText}>Away Roster</Text>
            </Pressable>
            <Pressable
              style={styles.subButton}
              onPress={() => handleSubstitution('away')}
            >
              <Text style={styles.buttonText}>Away Sub</Text>
            </Pressable>
          </View>
        </View>

        {/* Box Score Section */}
        <BoxScore />

        {/* Game Log Section */}
        <GameLog />
      </ScrollView>

      {/* Modals */}
      <SubstitutionModal
        visible={showSubstitutionModal}
        onClose={() => setShowSubstitutionModal(false)}
        team={activeTeamForSub === 'home' ? homeTeam : awayTeam}
      />

      <ClockEditor
        visible={showClockEditor}
        onClose={() => setShowClockEditor(false)}
      />

      <RosterManager
        visible={showRosterManager}
        onClose={() => setShowRosterManager(false)}
        teamId={activeTeamForSub === 'home' ? homeTeam.id : awayTeam.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  teamControls: {
    padding: 16,
  },
  teamButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rosterButton: {
    backgroundColor: '#9C27B0',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  subButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 