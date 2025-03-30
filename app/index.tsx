import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { Scoreboard } from '../components/Scoreboard';
import { GameControls } from '../components/GameControls';
import { BoxScore } from '../components/BoxScore';
import { GameLog } from '../components/GameLog';
import { SubstitutionModal } from '../components/SubstitutionModal';
import { ClockEditor } from '../components/ClockEditor';
import { useGameStore } from '../store/gameStore';

export default function App() {
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [showClockEditor, setShowClockEditor] = useState(false);
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
          <Pressable
            style={styles.subButton}
            onPress={() => handleSubstitution('home')}
          >
            <Text style={styles.subButtonText}>Home Substitution</Text>
          </Pressable>
          <Pressable
            style={styles.subButton}
            onPress={() => handleSubstitution('away')}
          >
            <Text style={styles.subButtonText}>Away Substitution</Text>
          </Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  teamControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  subButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  subButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 