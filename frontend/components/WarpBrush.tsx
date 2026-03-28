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

interface WarpBrushProps {
  onClose: () => void;
}

export default function WarpBrush({ onClose }: WarpBrushProps) {
  const [brushSize, setBrushSize] = useState(50);
  const [strength, setStrength] = useState(0.5);
  const [mode, setMode] = useState<'push' | 'pull' | 'twirl'>('push');

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>Warp Brush</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.label}>Warp Mode</Text>
              <View style={styles.modesContainer}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    mode === 'push' && styles.modeButtonActive,
                  ]}
                  onPress={() => setMode('push')}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={mode === 'push' ? '#FF6B6B' : '#FFF'}
                  />
                  <Text
                    style={[
                      styles.modeText,
                      mode === 'push' && styles.modeTextActive,
                    ]}
                  >
                    Push
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    mode === 'pull' && styles.modeButtonActive,
                  ]}
                  onPress={() => setMode('pull')}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={mode === 'pull' ? '#FF6B6B' : '#FFF'}
                  />
                  <Text
                    style={[
                      styles.modeText,
                      mode === 'pull' && styles.modeTextActive,
                    ]}
                  >
                    Pull
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    mode === 'twirl' && styles.modeButtonActive,
                  ]}
                  onPress={() => setMode('twirl')}
                >
                  <Ionicons
                    name="git-compare"
                    size={24}
                    color={mode === 'twirl' ? '#FF6B6B' : '#FFF'}
                  />
                  <Text
                    style={[
                      styles.modeText,
                      mode === 'twirl' && styles.modeTextActive,
                    ]}
                  >
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
                onValueChange={setBrushSize}
                minimumTrackTintColor="#FF6B6B"
                maximumTrackTintColor="#666"
                thumbTintColor="#FF6B6B"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Strength: {Math.round(strength * 100)}%</Text>
              <Slider
                style={styles.slider}
                minimumValue={0.1}
                maximumValue={1}
                value={strength}
                onValueChange={setStrength}
                minimumTrackTintColor="#4ECDC4"
                maximumTrackTintColor="#666"
                thumbTintColor="#4ECDC4"
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#4ECDC4" />
              <Text style={styles.infoText}>
                Push: Drag to push pixels away{'\n'}
                Pull: Drag to pull pixels toward center{'\n'}
                Twirl: Drag to create a swirl effect
              </Text>
            </View>

            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color="#FFA07A" />
              <Text style={styles.warningText}>
                Note: Warp effects are processor-intensive and work best on smaller images.
              </Text>
            </View>
          </View>

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
  modesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#444',
  },
  modeButtonActive: {
    backgroundColor: '#3a3a3a',
    borderColor: '#FF6B6B',
  },
  modeText: {
    fontSize: 14,
    color: '#999',
  },
  modeTextActive: {
    color: '#FF6B6B',
    fontWeight: '600',
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
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 160, 122, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFA07A',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#FFA07A',
    lineHeight: 18,
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
