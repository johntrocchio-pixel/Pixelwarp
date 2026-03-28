import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BalloonToolProps {
  onAddBalloon: (balloonData: any) => void;
}

const balloonTypes = [
  { id: 'speech', icon: 'chatbubble', label: 'Speech' },
  { id: 'thought', icon: 'ellipsis-horizontal-circle', label: 'Thought' },
  { id: 'shout', icon: 'volume-high', label: 'Shout' },
  { id: 'whisper', icon: 'volume-low', label: 'Whisper' },
];

const quickTexts = ['WOW!', 'LOL', 'OMG', 'COOL', 'YES!', 'NO!', 'HI!', 'BYE!'];

export default function BalloonTool({ onAddBalloon }: BalloonToolProps) {
  const [text, setText] = useState('');
  const [balloonType, setBalloonType] = useState('speech');

  const handleAdd = (balloonText: string) => {
    if (!balloonText.trim()) return;
    onAddBalloon({
      id: Date.now().toString(),
      text: balloonText.trim(),
      type: balloonType,
      x: 150,
      y: 150,
    });
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Balloon Type</Text>
        <View style={styles.typeRow}>
          {balloonTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                balloonType === type.id && styles.typeButtonActive,
              ]}
              onPress={() => setBalloonType(type.id)}
            >
              <Ionicons
                name={type.icon as any}
                size={24}
                color={balloonType === type.id ? '#3498db' : '#ecf0f1'}
              />
              <Text
                style={[
                  styles.typeLabel,
                  balloonType === type.id && styles.typeLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Custom Text</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Enter text..."
            placeholderTextColor="#7f8c8d"
          />
          <TouchableOpacity
            style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
            onPress={() => handleAdd(text)}
            disabled={!text.trim()}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Quick Text</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.quickRow}>
            {quickTexts.map((quickText) => (
              <TouchableOpacity
                key={quickText}
                style={styles.quickButton}
                onPress={() => handleAdd(quickText)}
              >
                <Text style={styles.quickText}>{quickText}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#34495e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#34495e',
  },
  typeButtonActive: {
    borderColor: '#3498db',
  },
  typeLabel: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 4,
  },
  typeLabelActive: {
    color: '#3498db',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#34495e',
    borderRadius: 8,
    padding: 12,
    color: '#ecf0f1',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#27ae60',
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#7f8c8d',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    backgroundColor: '#34495e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  quickText: {
    color: '#ecf0f1',
    fontSize: 14,
    fontWeight: '600',
  },
});