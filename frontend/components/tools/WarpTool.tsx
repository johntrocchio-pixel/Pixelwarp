import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface WarpToolProps {
  onWarpSettingsChange: (settings: any) => void;
}

export default function WarpTool({ onWarpSettingsChange }: WarpToolProps) {
  const [mode, setMode] = useState<'push' | 'pull' | 'twirl'>('push');
  const [brushSize, setBrushSize] = useState(50);
  const [strength, setStrength] = useState(0.5);

  const handleChange = () => {
    onWarpSettingsChange({ mode, brushSize, strength });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Warp Mode</Text>
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'push' && styles.modeButtonActive,
            ]}
            onPress={() => {
              setMode('push');
              handleChange();
            }}
          >
            <Ionicons
              name="arrow-forward"
              size={20}
              color={mode === 'push' ? '#3498db' : '#ecf0f1'}
            />
            <Text style={[styles.modeText, mode === 'push' && styles.modeTextActive]}>
              Push
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'pull' && styles.modeButtonActive,
            ]}
            onPress={() => {
              setMode('pull');
              handleChange();
            }}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={mode === 'pull' ? '#3498db' : '#ecf0f1'}
            />
            <Text style={[styles.modeText, mode === 'pull' && styles.modeTextActive]}>
              Pull
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'twirl' && styles.modeButtonActive,
            ]}
            onPress={() => {
              setMode('twirl');
              handleChange();
            }}
          >
            <Ionicons
              name="git-compare"
              size={20}
              color={mode === 'twirl' ? '#3498db' : '#ecf0f1'}
            />
            <Text style={[styles.modeText, mode === 'twirl' && styles.modeTextActive]}>
              Twirl
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Brush Size: {Math.round(brushSize)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={20}
          maximumValue={150}
          value={brushSize}
          onValueChange={(val) => {
            setBrushSize(val);
            handleChange();
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#7f8c8d"
          thumbTintColor="#3498db"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Strength: {Math.round(strength * 100)}%</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.1}
          maximumValue={1}
          value={strength}
          onValueChange={(val) => {
            setStrength(val);
            handleChange();
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#7f8c8d"
          thumbTintColor="#3498db"
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color="#3498db" />
        <Text style={styles.infoText}>
          Drag on the image to warp pixels
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#ecf0f1',
    marginBottom: 8,
    fontWeight: '600',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#34495e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#34495e',
  },
  modeButtonActive: {
    borderColor: '#3498db',
  },
  modeText: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 4,
  },
  modeTextActive: {
    color: '#3498db',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#34495e',
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#95a5a6',
  },
});