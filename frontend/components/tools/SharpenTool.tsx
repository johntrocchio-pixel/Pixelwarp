import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

interface SharpenToolProps {
  onSharpenChange: (intensity: number) => void;
}

export default function SharpenTool({ onSharpenChange }: SharpenToolProps) {
  const [sharpenIntensity, setSharpenIntensity] = useState(0);

  const handleChange = (value: number) => {
    setSharpenIntensity(value);
    onSharpenChange(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Ionicons name="diamond" size={16} color="#00D9FF" />
          <Text style={styles.label}>Sharpen Intensity</Text>
          <Text style={styles.value}>{Math.round(sharpenIntensity * 100)}%</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          value={sharpenIntensity}
          onValueChange={handleChange}
          minimumTrackTintColor="#00D9FF"
          maximumTrackTintColor="#333"
          thumbTintColor="#00D9FF"
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color="#00D9FF" />
        <Text style={styles.infoText}>
          Increase sharpness to enhance image details
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#00D9FF',
  },
  slider: {
    width: '100%',
    height: 40,
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