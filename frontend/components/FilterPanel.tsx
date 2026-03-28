import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterPanelProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onClose: () => void;
}

const filters = [
  { id: 'none', name: 'Original', icon: 'image' },
  { id: 'grayscale', name: 'Grayscale', icon: 'contrast' },
  { id: 'sepia', name: 'Sepia', icon: 'sunny' },
  { id: 'invert', name: 'Invert', icon: 'invert-mode' },
  { id: 'blur', name: 'Blur', icon: 'water' },
  { id: 'vintage', name: 'Vintage', icon: 'film' },
  { id: 'warm', name: 'Warm', icon: 'flame' },
  { id: 'cool', name: 'Cool', icon: 'snow' },
];

export default function FilterPanel({
  currentFilter,
  onFilterChange,
  onClose,
}: FilterPanelProps) {
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
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Filters Grid */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  currentFilter === filter.id && styles.filterButtonActive,
                ]}
                onPress={() => onFilterChange(filter.id)}
              >
                <View
                  style={[
                    styles.filterPreview,
                    currentFilter === filter.id && styles.filterPreviewActive,
                  ]}
                >
                  <Ionicons
                    name={filter.icon as any}
                    size={32}
                    color={currentFilter === filter.id ? '#FF6B6B' : '#FFF'}
                  />
                </View>
                <Text
                  style={[
                    styles.filterName,
                    currentFilter === filter.id && styles.filterNameActive,
                  ]}
                >
                  {filter.name}
                </Text>
                {currentFilter === filter.id && (
                  <Ionicons name="checkmark-circle" size={20} color="#FF6B6B" />
                )}
              </TouchableOpacity>
            ))}
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
  filtersContainer: {
    padding: 20,
    gap: 16,
  },
  filterButton: {
    alignItems: 'center',
    gap: 8,
    width: 100,
  },
  filterPreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  filterPreviewActive: {
    borderColor: '#FF6B6B',
    backgroundColor: '#3a3a3a',
  },
  filterName: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  filterNameActive: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});