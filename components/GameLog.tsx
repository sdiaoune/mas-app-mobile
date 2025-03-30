import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { GameEvent } from '../types/game';

const EventItem = ({ event }: { event: GameEvent }) => {
  const getEventColor = () => {
    switch (event.type) {
      case 'POINT':
        return '#4CAF50';
      case 'FOUL':
        return '#F44336';
      case 'TIMEOUT':
        return '#607D8B';
      case 'SUBSTITUTION':
        return '#9C27B0';
      default:
        return '#fff';
    }
  };

  return (
    <View style={styles.eventItem}>
      <Text style={styles.eventTime}>{event.gameTime}</Text>
      <View style={[styles.eventIndicator, { backgroundColor: getEventColor() }]} />
      <Text style={styles.eventDescription}>{event.description}</Text>
    </View>
  );
};

export const GameLog = () => {
  const { events } = useGameStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Log</Text>
      <ScrollView style={styles.eventList}>
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
        {events.length === 0 && (
          <Text style={styles.emptyText}>No events yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  eventList: {
    flex: 1,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  eventTime: {
    width: 60,
    color: '#ccc',
    fontSize: 14,
  },
  eventIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  eventDescription: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
}); 