import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RotateToolProps {
  onRotate: (degrees: number) => void;
}

export default function RotateTool({ onRotate }: RotateToolProps) {
  const [currentRotation, setCurrentRotation] = useState(0);

  const handleRotate = (degrees: number) => {
    const newRotation = (currentRotation + degrees) % 360;
    setCurrentRotation(newRotation);
    onRotate(newRotation);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Quick Rotate</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.rotateButton}
            onPress={() => handleRotate(-90)}
          >
            <Ionicons name="arrow-undo" size={24} color="#00D9FF" />
            <Text style={styles.buttonText}>90° Left</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rotateButton}
            onPress={() => handleRotate(90)}
          >
            <Ionicons name="arrow-redo" size={24} color="#00D9FF" />
            <Text style={styles.buttonText}>90° Right</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rotateButton}
            onPress={() => handleRotate(180)}
          >
            <Ionicons name="repeat" size={24} color="#00D9FF" />
            <Text style={styles.buttonText}>180°</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Current rotation: {currentRotation}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#111',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rotateButton: {
    flex: 1,
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoBox: {
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#00D9FF',
    fontWeight: '600',
  },
});