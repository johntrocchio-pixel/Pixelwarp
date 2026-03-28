import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface PropsToolProps {
  onAddProp: (prop: string) => void;
}

const props = [
  { id: 'glasses1', emoji: '👓', name: 'Glasses' },
  { id: 'glasses2', emoji: '🕶️', name: 'Sunglasses' },
  { id: 'hat1', emoji: '🎩', name: 'Top Hat' },
  { id: 'hat2', emoji: '👒', name: 'Hat' },
  { id: 'crown', emoji: '👑', name: 'Crown' },
  { id: 'mustache', emoji: '🧢', name: 'Mustache' },
  { id: 'beard', emoji: '🧔', name: 'Beard' },
  { id: 'mask', emoji: '🎭', name: 'Mask' },
  { id: 'bow', emoji: '🎀', name: 'Bow' },
  { id: 'tie', emoji: '👔', name: 'Tie' },
  { id: 'lips', emoji: '👄', name: 'Lips' },
  { id: 'nose', emoji: '👃', name: 'Nose' },
];

export default function PropsTool({ onAddProp }: PropsToolProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.propsList}
      >
        {props.map((prop) => (
          <TouchableOpacity
            key={prop.id}
            style={styles.propButton}
            onPress={() => onAddProp(prop.emoji)}
          >
            <Text style={styles.emoji}>{prop.emoji}</Text>
            <Text style={styles.propName}>{prop.name}</Text>
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
  propsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  propButton: {
    width: 70,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  propName: {
    fontSize: 10,
    color: '#95a5a6',
    textAlign: 'center',
  },
});