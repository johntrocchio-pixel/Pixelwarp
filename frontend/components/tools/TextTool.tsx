import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface TextToolProps {
  onAddText: (textData: any) => void;
}

const colors = [
  '#FFFFFF', '#000000', '#FF6B6B', '#3498db', '#27ae60',
  '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e',
];

export default function TextTool({ onAddText }: TextToolProps) {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState('#000000');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAddText({
      id: Date.now().toString(),
      text: text.trim(),
      x: 200,
      y: 200,
      fontSize,
      color,
      outlineColor,
      rotation: 0,
    });
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter text..."
        placeholderTextColor="#7f8c8d"
        multiline
      />

      <View style={styles.section}>
        <Text style={styles.label}>Size: {fontSize}</Text>
        <Slider
          style={styles.slider}
          minimumValue={16}
          maximumValue={72}
          value={fontSize}
          onValueChange={setFontSize}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#7f8c8d"
          thumbTintColor="#3498db"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Text Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorButton,
                  { backgroundColor: c },
                  color === c && styles.colorButtonActive,
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Outline Color</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorButton,
                  { backgroundColor: c },
                  outlineColor === c && styles.colorButtonActive,
                ]}
                onPress={() => setOutlineColor(c)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
        onPress={handleAdd}
        disabled={!text.trim()}
      >
        <Text style={styles.addButtonText}>Add Text</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  input: {
    backgroundColor: '#34495e',
    borderRadius: 8,
    padding: 12,
    color: '#ecf0f1',
    fontSize: 16,
    minHeight: 60,
    marginBottom: 16,
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
  addButton: {
    backgroundColor: '#27ae60',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#7f8c8d',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});