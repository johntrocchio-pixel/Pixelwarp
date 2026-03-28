import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Tool categories matching PicSay Pro
const toolCategories = {
  basic: [
    { id: 'crop', icon: 'crop', label: 'Crop' },
    { id: 'rotate', icon: 'refresh', label: 'Rotate' },
    { id: 'flip', icon: 'swap-horizontal', label: 'Flip' },
    { id: 'adjust', icon: 'contrast', label: 'Adjust' },
  ],
  effects: [
    { id: 'filter', icon: 'color-filter', label: 'Filters' },
    { id: 'blur', icon: 'water', label: 'Blur' },
    { id: 'sharpen', icon: 'diamond', label: 'Sharpen' },
    { id: 'redeye', icon: 'eye', label: 'Red-Eye' },
  ],
  draw: [
    { id: 'paint', icon: 'brush', label: 'Paint' },
    { id: 'text', icon: 'text', label: 'Text' },
    { id: 'balloon', icon: 'chatbubble', label: 'Balloon' },
  ],
  fun: [
    { id: 'sticker', icon: 'happy', label: 'Stickers' },
    { id: 'props', icon: 'glasses', label: 'Props' },
    { id: 'warp', icon: 'git-compare', label: 'Warp' },
    { id: 'distort', icon: 'prism', label: 'Distort' },
  ],
};

export default function EditorScreen() {
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string;
  
  const viewShotRef = useRef<ViewShot>(null);
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'effects' | 'draw' | 'fun'>('basic');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library access to save images');
        setIsSaving(false);
        return;
      }

      if (!viewShotRef.current) {
        Alert.alert('Error', 'Unable to save image');
        setIsSaving(false);
        return;
      }

      const uri = await viewShotRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('PixelWarp', asset, false);

      Alert.alert(
        'Saved!',
        'Your photo has been saved to gallery.',
        [
          { text: 'Edit Another', onPress: () => router.back() },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Discard Changes?',
      'All changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', onPress: () => router.back(), style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      {/* Top Bar - PicSay Pro Style */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>PixelWarp</Text>

        <TouchableOpacity
          style={[styles.topButton, styles.saveButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="checkmark" size={28} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Image Canvas */}
      <View style={styles.canvasContainer}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'jpg', quality: 1.0 }}
          style={styles.viewShot}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </ViewShot>
      </View>

      {/* Category Tabs - PicSay Pro Style */}
      <View style={styles.categoryTabs}>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'basic' && styles.categoryTabActive]}
          onPress={() => setSelectedCategory('basic')}
        >
          <Ionicons name="hammer" size={20} color={selectedCategory === 'basic' ? '#3498db' : '#95a5a6'} />
          <Text style={[styles.categoryLabel, selectedCategory === 'basic' && styles.categoryLabelActive]}>
            Basic
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'effects' && styles.categoryTabActive]}
          onPress={() => setSelectedCategory('effects')}
        >
          <Ionicons name="color-wand" size={20} color={selectedCategory === 'effects' ? '#3498db' : '#95a5a6'} />
          <Text style={[styles.categoryLabel, selectedCategory === 'effects' && styles.categoryLabelActive]}>
            Effects
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'draw' && styles.categoryTabActive]}
          onPress={() => setSelectedCategory('draw')}
        >
          <Ionicons name="create" size={20} color={selectedCategory === 'draw' ? '#3498db' : '#95a5a6'} />
          <Text style={[styles.categoryLabel, selectedCategory === 'draw' && styles.categoryLabelActive]}>
            Draw
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'fun' && styles.categoryTabActive]}
          onPress={() => setSelectedCategory('fun')}
        >
          <Ionicons name="happy" size={20} color={selectedCategory === 'fun' ? '#3498db' : '#95a5a6'} />
          <Text style={[styles.categoryLabel, selectedCategory === 'fun' && styles.categoryLabelActive]}>
            Fun
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tool Icons - PicSay Pro Style */}
      <View style={styles.toolBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolList}
        >
          {toolCategories[selectedCategory].map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.toolButton,
                selectedTool === tool.id && styles.toolButtonActive,
              ]}
              onPress={() => setSelectedTool(tool.id)}
            >
              <View style={styles.toolIcon}>
                <Ionicons
                  name={tool.icon as any}
                  size={28}
                  color={selectedTool === tool.id ? '#3498db' : '#ecf0f1'}
                />
              </View>
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

      {/* Info Message */}
      {selectedTool && (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>
            Tool panels coming soon! This is the PicSay Pro interface layout.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#2c3e50',
    borderBottomWidth: 1,
    borderBottomColor: '#3498db',
  },
  topButton: {
    padding: 8,
    minWidth: 48,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewShot: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    borderTopWidth: 1,
    borderTopColor: '#34495e',
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryTabActive: {
    borderBottomColor: '#3498db',
  },
  categoryLabel: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 4,
  },
  categoryLabelActive: {
    color: '#3498db',
    fontWeight: '600',
  },
  toolBar: {
    backgroundColor: '#34495e',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2c3e50',
  },
  toolList: {
    paddingHorizontal: 8,
    gap: 12,
  },
  toolButton: {
    alignItems: 'center',
    minWidth: 70,
  },
  toolButtonActive: {
    opacity: 1,
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34495e',
  },
  toolLabel: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 6,
    textAlign: 'center',
  },
  toolLabelActive: {
    color: '#3498db',
    fontWeight: '600',
  },
  infoBar: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
  },
});
