import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface DrawingPanelProps {
  onAddPath: (path: any) => void;
  onClose: () => void;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#FFFFFF', '#000000',
];

export default function DrawingPanel({ onAddPath, onClose }: DrawingPanelProps) {
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#FF6B6B');
  const [isDrawing, setIsDrawing] = useState(false);

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Drawing Tools</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Brush Size */}
            <View style={styles.section}>
              <Text style={styles.label}>Brush Size: {Math.round(brushSize)}</Text>
              <Slider
                style={styles.slider}
                minimumValue={2}
                maximumValue={30}
                value={brushSize}
                onValueChange={setBrushSize}
                minimumTrackTintColor="#FF6B6B"
                maximumTrackTintColor="#666"
                thumbTintColor="#FF6B6B"
              />
              {/* Preview */}
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

            {/* Color Picker */}
            <View style={styles.section}>
              <Text style={styles.label}>Brush Color</Text>
              <View style={styles.colorGrid}>
                {colors.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorButton,
                      { backgroundColor: c },
                      brushColor === c && styles.colorButtonSelected,
                    ]}
                    onPress={() => setBrushColor(c)}
                  />
                ))}
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#4ECDC4" />
              <Text style={styles.infoText}>
                Draw directly on the canvas above. Use two fingers to pan/zoom the image.
              </Text>
            </View>
          </View>

          {/* Done Button */}
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
  },
  brushPreview: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#666',
  },
  colorButtonSelected: {
    borderColor: '#FF6B6B',
    borderWidth: 3,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4ECDC4',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});