import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useGameStore } from '../store/gameStore';

interface ClockEditorProps {
  visible: boolean;
  onClose: () => void;
}

export const ClockEditor = ({ visible, onClose }: ClockEditorProps) => {
  const { clock, updateClock } = useGameStore();
  const [minutes, setMinutes] = useState(parseInt(clock.split(':')[0]));
  const [seconds, setSeconds] = useState(parseInt(clock.split(':')[1]));

  const handleTimeChange = (type: 'minutes' | 'seconds', change: number) => {
    if (type === 'minutes') {
      setMinutes(prev => Math.max(0, Math.min(59, prev + change)));
    } else {
      setSeconds(prev => {
        const newSeconds = prev + change;
        if (newSeconds >= 60) {
          setMinutes(m => Math.min(59, m + 1));
          return 0;
        }
        if (newSeconds < 0) {
          if (minutes > 0) {
            setMinutes(m => m - 1);
            return 59;
          }
          return 0;
        }
        return newSeconds;
      });
    }
  };

  const handleSave = () => {
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateClock(formattedTime);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Edit Game Clock</Text>
          
          <View style={styles.timeContainer}>
            {/* Minutes */}
            <View style={styles.timeSection}>
              <Pressable
                style={styles.timeButton}
                onPress={() => handleTimeChange('minutes', 1)}
              >
                <Text style={styles.buttonText}>+</Text>
              </Pressable>
              
              <View style={styles.timeDisplay}>
                <Text style={styles.timeText}>{minutes.toString().padStart(2, '0')}</Text>
                <Text style={styles.timeLabel}>MIN</Text>
              </View>
              
              <Pressable
                style={styles.timeButton}
                onPress={() => handleTimeChange('minutes', -1)}
              >
                <Text style={styles.buttonText}>-</Text>
              </Pressable>
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            {/* Seconds */}
            <View style={styles.timeSection}>
              <Pressable
                style={styles.timeButton}
                onPress={() => handleTimeChange('seconds', 1)}
              >
                <Text style={styles.buttonText}>+</Text>
              </Pressable>
              
              <View style={styles.timeDisplay}>
                <Text style={styles.timeText}>{seconds.toString().padStart(2, '0')}</Text>
                <Text style={styles.timeLabel}>SEC</Text>
              </View>
              
              <Pressable
                style={styles.timeButton}
                onPress={() => handleTimeChange('seconds', -1)}
              >
                <Text style={styles.buttonText}>-</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
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
    width: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  timeSection: {
    alignItems: 'center',
  },
  timeButton: {
    width: 48,
    height: 48,
    backgroundColor: '#333',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  timeDisplay: {
    alignItems: 'center',
    marginVertical: 8,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#666',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 