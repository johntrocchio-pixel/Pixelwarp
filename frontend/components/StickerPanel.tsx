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

interface StickerPanelProps {
  onAddSticker: (sticker: any) => void;
  onClose: () => void;
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
];

const speechBubbles = [
  { id: 'bubble1', text: 'WOW!', type: 'speech' },
  { id: 'bubble2', text: 'LOL', type: 'speech' },
  { id: 'bubble3', text: 'OMG', type: 'speech' },
  { id: 'bubble4', text: 'COOL', type: 'speech' },
];

export default function StickerPanel({ onAddSticker, onClose }: StickerPanelProps) {
  const handleAddSticker = (sticker: any) => {
    onAddSticker({
      id: Date.now().toString(),
      type: sticker.emoji || sticker.text,
      x: 150,
      y: 150,
      width: 80,
      height: 80,
      rotation: 0,
    });
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
            <Text style={styles.title}>Stickers & Emojis</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Emojis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emojis</Text>
              <View style={styles.grid}>
                {stickers.map((sticker) => (
                  <TouchableOpacity
                    key={sticker.id}
                    style={styles.stickerButton}
                    onPress={() => handleAddSticker(sticker)}
                  >
                    <Text style={styles.emoji}>{sticker.emoji}</Text>
                    <Text style={styles.stickerName}>{sticker.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Speech Bubbles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Speech Bubbles</Text>
              <View style={styles.grid}>
                {speechBubbles.map((bubble) => (
                  <TouchableOpacity
                    key={bubble.id}
                    style={styles.bubbleButton}
                    onPress={() => handleAddSticker(bubble)}
                  >
                    <View style={styles.bubbleContent}>
                      <Text style={styles.bubbleText}>{bubble.text}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#4ECDC4" />
              <Text style={styles.infoText}>
                Tap a sticker to add it. Long press on the canvas to delete.
              </Text>
            </View>
          </ScrollView>
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stickerButton: {
    width: 80,
    height: 80,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  emoji: {
    fontSize: 40,
  },
  stickerName: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  bubbleButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleContent: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000',
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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
});