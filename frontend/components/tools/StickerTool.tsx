import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface StickerToolProps {
  onAddSticker: (sticker: string) => void;
}

const stickers = [
  { id: 'heart', emoji: '❤️', name: 'Heart' },
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'fire', emoji: '🔥', name: 'Fire' },
  { id: 'like', emoji: '👍', name: 'Like' },
  { id: 'laugh', emoji: '😂', name: 'Laugh' },
  { id: 'cool', emoji: '😎', name: 'Cool' },
  { id: 'love', emoji: '😍', name: 'Love' },
  { id: 'party', emoji: '🎉', name: 'Party' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket' },
  { id: 'sparkle', emoji: '✨', name: 'Sparkle' },
  { id: 'check', emoji: '✅', name: 'Check' },
  { id: 'idea', emoji: '💡', name: 'Idea' },
  { id: 'camera', emoji: '📷', name: 'Camera' },
  { id: 'music', emoji: '🎵', name: 'Music' },
  { id: 'sun', emoji: '☀️', name: 'Sun' },
  { id: 'moon', emoji: '🌙', name: 'Moon' },
];

export default function StickerTool({ onAddSticker }: StickerToolProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stickerList}
      >
        {stickers.map((sticker) => (
          <TouchableOpacity
            key={sticker.id}
            style={styles.stickerButton}
            onPress={() => onAddSticker(sticker.emoji)}
          >
            <Text style={styles.emoji}>{sticker.emoji}</Text>
            <Text style={styles.stickerName}>{sticker.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: '#2c3e50',
  },
  stickerList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  stickerButton: {
    width: 70,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  stickerName: {
    fontSize: 10,
    color: '#95a5a6',
    textAlign: 'center',
  },
});