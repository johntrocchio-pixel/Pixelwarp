import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface AdjustmentPanelProps {
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
  };
  onAdjustmentChange: (key: string, value: number) => void;
  onClose: () => void;
}

export default function AdjustmentPanel({
  adjustments,
  onAdjustmentChange,
  onClose,
}: AdjustmentPanelProps) {
  const resetAll = () => {
    onAdjustmentChange('brightness', 1);
    onAdjustmentChange('contrast', 1);
    onAdjustmentChange('saturation', 1);
    onAdjustmentChange('hue', 0);
  };

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
            <Text style={styles.title}>Adjustments</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={resetAll} style={styles.resetButton}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Brightness */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <View style={styles.labelLeft}>
                  <Ionicons name="sunny" size={20} color="#FF6B6B" />
                  <Text style={styles.label}>Brightness</Text>
                </View>
                <Text style={styles.value}>{Math.round(adjustments.brightness * 100)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={1.5}
                value={adjustments.brightness}
                onValueChange={(val) => onAdjustmentChange('brightness', val)}
                minimumTrackTintColor="#FF6B6B"
                maximumTrackTintColor="#666"
                thumbTintColor="#FF6B6B"
              />
            </View>

            {/* Contrast */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <View style={styles.labelLeft}>
                  <Ionicons name="contrast" size={20} color="#4ECDC4" />
                  <Text style={styles.label}>Contrast</Text>
                </View>
                <Text style={styles.value}>{Math.round(adjustments.contrast * 100)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={1.5}
                value={adjustments.contrast}
                onValueChange={(val) => onAdjustmentChange('contrast', val)}
                minimumTrackTintColor="#4ECDC4"
                maximumTrackTintColor="#666"
                thumbTintColor="#4ECDC4"
              />
            </View>

            {/* Saturation */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <View style={styles.labelLeft}>
                  <Ionicons name="color-palette" size={20} color="#FFA07A" />
                  <Text style={styles.label}>Saturation</Text>
                </View>
                <Text style={styles.value}>{Math.round(adjustments.saturation * 100)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={2}
                value={adjustments.saturation}
                onValueChange={(val) => onAdjustmentChange('saturation', val)}
                minimumTrackTintColor="#FFA07A"
                maximumTrackTintColor="#666"
                thumbTintColor="#FFA07A"
              />
            </View>

            {/* Hue */}
            <View style={styles.section}>
              <View style={styles.labelRow}>
                <View style={styles.labelLeft}>
                  <Ionicons name="prism" size={20} color="#BB8FCE" />
                  <Text style={styles.label}>Hue</Text>
                </View>
                <Text style={styles.value}>{Math.round(adjustments.hue)}°</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={-180}
                maximumValue={180}
                value={adjustments.hue}
                onValueChange={(val) => onAdjustmentChange('hue', val)}
                minimumTrackTintColor="#BB8FCE"
                maximumTrackTintColor="#666"
                thumbTintColor="#BB8FCE"
              />
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#4ECDC4" />
              <Text style={styles.infoText}>
                Adjust these values to enhance your photo. Use 'Reset' to restore defaults.
              </Text>
            </View>
          </ScrollView>

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
    maxHeight: '70%',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  resetText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4ECDC4',
    marginTop: 8,
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