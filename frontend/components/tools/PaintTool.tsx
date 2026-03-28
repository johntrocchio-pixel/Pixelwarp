import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface PaintToolProps {
  onPaintSettingsChange: (settings: any) => void;
}

const colors = [
  '#FF6B6B', '#3498db', '#27ae60', '#f39c12', '#9b59b6',
  '#e74c3c', '#1abc9c', '#34495e', '#FFFFFF', '#000000',
];

export default function PaintTool({ onPaintSettingsChange }: PaintToolProps) {
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#FF6B6B');

  const handleChange = () => {
    onPaintSettingsChange({ brushSize, brushColor });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Brush Size: {Math.round(brushSize)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={2}
          maximumValue={30}
          value={brushSize}
          onValueChange={(val) => {
            setBrushSize(val);
            handleChange();
          }}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#7f8c8d"
          thumbTintColor="#3498db"
        />
        <View style={styles.previewContainer}>
          <View
            style={[
              styles.brushPreview,
              {
                width: brushSize * 2,
                height: brushSize * 2,
                backgroundColor: brushColor,
                borderRadius: brushSize,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Brush Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorButton,
                  { backgroundColor: c },
                  brushColor === c && styles.colorButtonActive,
                ]}
                onPress={() => {
                  setBrushColor(c);
                  handleChange();
                }}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color="#3498db" />
        <Text style={styles.infoText}>
          Draw directly on the image canvas above
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
  slider: {
    width: '100%',
    height: 40,
  },
  previewContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#34495e',
    borderRadius: 8,
    marginTop: 8,
  },
  brushPreview: {},
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#7f8c8d',
  },
  colorButtonActive: {
    borderColor: '#3498db',
    borderWidth: 3,
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