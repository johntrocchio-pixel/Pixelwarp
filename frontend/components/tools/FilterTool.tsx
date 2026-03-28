import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterToolProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: 'none', name: 'Original', icon: 'image' },
  { id: 'grayscale', name: 'B&W', icon: 'contrast' },
  { id: 'sepia', name: 'Sepia', icon: 'sunny' },
  { id: 'vintage', name: 'Vintage', icon: 'film' },
  { id: 'warm', name: 'Warm', icon: 'flame' },
  { id: 'cool', name: 'Cool', icon: 'snow' },
  { id: 'invert', name: 'Invert', icon: 'invert-mode' },
  { id: 'blur', name: 'Blur', icon: 'water' },
];

export default function FilterTool({ currentFilter, onFilterChange }: FilterToolProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              currentFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => onFilterChange(filter.id)}
          >
            <View style={[styles.filterIcon, currentFilter === filter.id && styles.filterIconActive]}>
              <Ionicons
                name={filter.icon as any}
                size={24}
                color={currentFilter === filter.id ? '#3498db' : '#ecf0f1'}
              />
            </View>
            <Text style={[styles.filterName, currentFilter === filter.id && styles.filterNameActive]}>
              {filter.name}
            </Text>
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
  filterList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  filterButton: {
    alignItems: 'center',
    width: 70,
  },
  filterButtonActive: {
    opacity: 1,
  },
  filterIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#34495e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34495e',
  },
  filterIconActive: {
    borderColor: '#3498db',
  },
  filterName: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 6,
    textAlign: 'center',
  },
  filterNameActive: {
    color: '#3498db',
    fontWeight: '600',
  },
});