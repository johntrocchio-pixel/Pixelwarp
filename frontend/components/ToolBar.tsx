import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ToolBarProps {
  selectedTool: string;
  onSelectTool: (tool: any) => void;
}

const tools = [
  { id: 'text', icon: 'text', label: 'Text' },
  { id: 'draw', icon: 'brush', label: 'Draw' },
  { id: 'filter', icon: 'color-filter', label: 'Filter' },
  { id: 'adjust', icon: 'contrast', label: 'Adjust' },
  { id: 'sticker', icon: 'happy', label: 'Sticker' },
  { id: 'warp', icon: 'git-compare', label: 'Warp' },
  { id: 'crop', icon: 'crop', label: 'Crop' },
];

export default function ToolBar({ selectedTool, onSelectTool }: ToolBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[
              styles.toolButton,
              selectedTool === tool.id && styles.toolButtonActive,
            ]}
            onPress={() => onSelectTool(tool.id as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tool.icon as any}
              size={24}
              color={selectedTool === tool.id ? '#FF6B6B' : '#FFF'}
            />
            <Text
              style={[
                styles.toolLabel,
                selectedTool === tool.id && styles.toolLabelActive,
              ]}
            >
              {tool.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    gap: 8,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    minWidth: 70,
  },
  toolButtonActive: {
    backgroundColor: '#3a3a3a',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  toolLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  toolLabelActive: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});