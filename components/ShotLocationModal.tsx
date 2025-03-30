import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Pressable,
  Text,
  ImageBackground,
  GestureResponderEvent,
  Dimensions,
} from 'react-native';

interface ShotLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (location: { x: number; y: number }) => void;
}

export const ShotLocationModal = ({ visible, onClose, onConfirm }: ShotLocationModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState<{ x: number; y: number } | null>(null);

  const handleCourtPress = (event: GestureResponderEvent) => {
    // Get the coordinates relative to the view
    const { locationX, locationY } = event.nativeEvent;
    const width = Dimensions.get('window').width * 0.9; // 90% of screen width (matches modal width)
    const height = width * 1.1; // matches aspectRatio

    // Convert to percentages (0-100) for storage
    setSelectedLocation({
      x: Math.round((locationX / width) * 100),
      y: Math.round((locationY / height) * 100),
    });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation);
      setSelectedLocation(null);
    }
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
          <Text style={styles.modalTitle}>Select Shot Location</Text>
          <Text style={styles.modalSubtitle}>Tap where the shot was taken</Text>

          <Pressable 
            style={styles.courtContainer}
            onPress={handleCourtPress}
          >
            <ImageBackground
              source={require('../assets/images/court.png')}
              style={styles.courtImage}
              resizeMode="contain"
            >
              {selectedLocation && (
                <View
                  style={[
                    styles.locationMarker,
                    {
                      left: `${selectedLocation.x}%`,
                      top: `${selectedLocation.y}%`,
                    },
                  ]}
                />
              )}
            </ImageBackground>
          </Pressable>

          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => {
                setSelectedLocation(null);
                onClose();
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalButton,
                styles.modalButtonConfirm,
                !selectedLocation && styles.modalButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!selectedLocation}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 600,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 24,
    textAlign: 'center',
  },
  courtContainer: {
    width: '100%',
    aspectRatio: 1.1, // Adjust based on your court image aspect ratio
    marginBottom: 24,
  },
  courtImage: {
    width: '100%',
    height: '100%',
  },
  locationMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: '#fff',
    transform: [{ translateX: -10 }, { translateY: -10 }], // Center the marker on the tap location
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    width: '100%',
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