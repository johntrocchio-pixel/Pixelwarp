import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FlipToolProps {
  onFlip: (direction: 'horizontal' | 'vertical') => void;
}

export default function FlipTool({ onFlip }: FlipToolProps) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Flip Image</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => onFlip('horizontal')}
          >
            <Ionicons name="swap-horizontal" size={32} color="#00D9FF" />
            <Text style={styles.buttonText}>Flip Horizontal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => onFlip('vertical')}
          >
            <Ionicons name="swap-vertical" size={32} color="#00D9FF" />
            <Text style={styles.buttonText}>Flip Vertical</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color="#00D9FF" />
        <Text style={styles.infoText}>
          Tap to mirror the image horizontally or vertically
        </Text>
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
    gap: 12,
  },
  flipButton: {
    flex: 1,
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#888',
  },
});