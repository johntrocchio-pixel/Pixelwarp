import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface TextEditorProps {
  onAddText: (text: any) => void;
  onClose: () => void;
}

const colors = [
  '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
];

const fonts = ['System', 'Monospace', 'Serif'];

export default function TextEditor({ onAddText, onClose }: TextEditorProps) {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const [color, setColor] = useState('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [outlineWidth, setOutlineWidth] = useState(2);
  const [fontFamily, setFontFamily] = useState('System');
  const [showOutline, setShowOutline] = useState(true);

  const handleAdd = () => {
    if (!text.trim()) return;

    onAddText({
      id: Date.now().toString(),
      text: text.trim(),
      x: 200,
      y: 200,
      fontSize,
      color,
      fontFamily,
      rotation: 0,
      outlineColor: showOutline ? outlineColor : undefined,
      outlineWidth: showOutline ? outlineWidth : undefined,
    });

    setText('');
    onClose();
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
            <Text style={styles.title}>Add Text</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Text Input */}
            <TextInput
              style={[styles.input, { fontSize, color, fontFamily }]}
              value={text}
              onChangeText={setText}
              placeholder="Enter text..."
              placeholderTextColor="#666"
              multiline
            />

            {/* Font Size */}
            <View style={styles.section}>
              <Text style={styles.label}>Font Size: {fontSize}</Text>
              <Slider
                style={styles.slider}
                minimumValue={16}
                maximumValue={80}
                value={fontSize}
                onValueChange={setFontSize}
                minimumTrackTintColor="#FF6B6B"
                maximumTrackTintColor="#666"
                thumbTintColor="#FF6B6B"
              />
            </View>

            {/* Text Color */}
            <View style={styles.section}>
              <Text style={styles.label}>Text Color</Text>
              <View style={styles.colorGrid}>
                {colors.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorButton,
                      { backgroundColor: c },
                      color === c && styles.colorButtonSelected,
                    ]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>
            </View>

            {/* Outline */}
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Outline</Text>
                <TouchableOpacity
                  style={[styles.toggle, showOutline && styles.toggleActive]}
                  onPress={() => setShowOutline(!showOutline)}
                >
                  <Text style={styles.toggleText}>{showOutline ? 'ON' : 'OFF'}</Text>
                </TouchableOpacity>
              </View>

              {showOutline && (
                <>
                  <View style={styles.colorGrid}>
                    {colors.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[
                          styles.colorButton,
                          { backgroundColor: c },
                          outlineColor === c && styles.colorButtonSelected,
                        ]}
                        onPress={() => setOutlineColor(c)}
                      />
                    ))}
                  </View>
                  <Text style={styles.label}>Width: {outlineWidth}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    value={outlineWidth}
                    onValueChange={setOutlineWidth}
                    minimumTrackTintColor="#FF6B6B"
                    maximumTrackTintColor="#666"
                    thumbTintColor="#FF6B6B"
                  />
                </>
              )}
            </View>
          </ScrollView>

          {/* Add Button */}
          <TouchableOpacity
            style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={!text.trim()}
          >
            <Text style={styles.addButtonText}>Add Text</Text>
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
    maxHeight: '80%',
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
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    minHeight: 80,
    marginBottom: 24,
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggle: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: '#FF6B6B',
  },
  toggleText: {
    color: '#FFF',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#666',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});