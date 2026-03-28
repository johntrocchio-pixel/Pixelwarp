import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CropToolProps {
  onCrop: (cropData: any) => void;
}

export default function CropTool({ onCrop }: CropToolProps) {
  const [aspectRatio, setAspectRatio] = useState<string>('free');

  const ratios = [
    { id: 'free', label: 'Free', icon: 'expand' },
    { id: '1:1', label: '1:1', icon: 'square' },
    { id: '4:3', label: '4:3', icon: 'tablet-landscape' },
    { id: '16:9', label: '16:9', icon: 'tablet-landscape' },
    { id: '9:16', label: '9:16', icon: 'phone-portrait' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Aspect Ratio</Text>
        <View style={styles.ratioRow}>
          {ratios.map((ratio) => (
            <TouchableOpacity
              key={ratio.id}
              style={[
                styles.ratioButton,
                aspectRatio === ratio.id && styles.ratioButtonActive,
              ]}
              onPress={() => setAspectRatio(ratio.id)}
            >
              <Ionicons
                name={ratio.icon as any}
                size={20}
                color={aspectRatio === ratio.id ? '#3498db' : '#ecf0f1'}
              />
              <Text
                style={[
                  styles.ratioText,
                  aspectRatio === ratio.id && styles.ratioTextActive,
                ]}
              >
                {ratio.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color="#3498db" />
        <Text style={styles.infoText}>
          Drag the corners on the image to crop
        </Text>
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => onCrop({ aspectRatio })}
      >
        <Ionicons name="crop" size={20} color="#FFF" />
        <Text style={styles.applyButtonText}>Apply Crop</Text>
      </TouchableOpacity>
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
  ratioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratioButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#34495e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#34495e',
    minWidth: 60,
  },
  ratioButtonActive: {
    borderColor: '#3498db',
  },
  ratioText: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 4,
  },
  ratioTextActive: {
    color: '#3498db',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#34495e',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#95a5a6',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});