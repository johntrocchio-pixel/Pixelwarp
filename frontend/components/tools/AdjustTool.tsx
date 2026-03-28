import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

interface AdjustToolProps {
  onAdjust: (adjustments: any) => void;
}

export default function AdjustTool({ onAdjust }: AdjustToolProps) {
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);

  const handleChange = (key: string, value: number) => {
    const adjustments = { brightness, contrast, saturation, [key]: value };
    if (key === 'brightness') setBrightness(value);
    if (key === 'contrast') setContrast(value);
    if (key === 'saturation') setSaturation(value);
    onAdjust(adjustments);
  };

  return (
    <View style={styles.container}>
      <View style={styles.control}>
        <View style={styles.labelRow}>
          <Ionicons name="sunny" size={16} color="#3498db" />
          <Text style={styles.label}>Brightness</Text>
          <Text style={styles.value}>{Math.round(brightness * 100)}%</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={1.5}
          value={brightness}
          onValueChange={(val) => handleChange('brightness', val)}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#7f8c8d"
          thumbTintColor="#3498db"
        />
      </View>

      <View style={styles.control}>
        <View style={styles.labelRow}>
          <Ionicons name="contrast" size={16} color="#3498db" />
          <Text style={styles.label}>Contrast</Text>
          <Text style={styles.value}>{Math.round(contrast * 100)}%</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={1.5}
          value={contrast}
          onValueChange={(val) => handleChange('contrast', val)}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#7f8c8d"
          thumbTintColor="#3498db"
        />
      </View>

      <View style={styles.control}>
        <View style={styles.labelRow}>
          <Ionicons name="color-palette" size={16} color="#3498db" />
          <Text style={styles.label}>Saturation</Text>
          <Text style={styles.value}>{Math.round(saturation * 100)}%</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2}
          value={saturation}
          onValueChange={(val) => handleChange('saturation', val)}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#7f8c8d"
          thumbTintColor="#3498db"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#111',
  },
  control: {
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
});