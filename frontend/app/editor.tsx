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

// Import tool components
import AdjustTool from '../components/tools/AdjustTool';
import FilterTool from '../components/tools/FilterTool';
import TextTool from '../components/tools/TextTool';
import PaintTool from '../components/tools/PaintTool';
import StickerTool from '../components/tools/StickerTool';
import BalloonTool from '../components/tools/BalloonTool';
import WarpTool from '../components/tools/WarpTool';
import PropsTool from '../components/tools/PropsTool';
import CropTool from '../components/tools/CropTool';

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

  // State for all edits
  const [currentFilter, setCurrentFilter] = useState('none');
  const [adjustments, setAdjustments] = useState({
    brightness: 1,
    contrast: 1,
    saturation: 1,
  });

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

  const getImageStyle = () => {
    const styles: any = { width: '100%', height: '100%' };
    
    // Apply filter
    if (currentFilter !== 'none') {
      const filters = [];
      if (currentFilter === 'grayscale') filters.push('grayscale(1)');
      if (currentFilter === 'sepia') filters.push('sepia(1)');
      if (currentFilter === 'invert') filters.push('invert(1)');
      if (currentFilter === 'blur') filters.push('blur(5px)');
      
      if (filters.length > 0) {
        styles.filter = filters.join(' ');
      }
    }
    
    // Apply adjustments
    const adjustFilters = [];
    if (adjustments.brightness !== 1) {
      adjustFilters.push(`brightness(${adjustments.brightness})`);
    }
    if (adjustments.contrast !== 1) {
      adjustFilters.push(`contrast(${adjustments.contrast})`);
    }
    if (adjustments.saturation !== 1) {
      adjustFilters.push(`saturate(${adjustments.saturation})`);
    }
    
    if (adjustFilters.length > 0) {
      styles.filter = (styles.filter || '') + ' ' + adjustFilters.join(' ');
    }
    
    return styles;
  };

  const renderToolPanel = () => {
    switch (selectedTool) {
      case 'adjust':
        return <AdjustTool onAdjust={setAdjustments} />;
      case 'filter':
        return <FilterTool currentFilter={currentFilter} onFilterChange={setCurrentFilter} />;
      case 'text':
        return <TextTool onAddText={(data) => console.log('Add text:', data)} />;
      case 'paint':
        return <PaintTool onPaintSettingsChange={(data) => console.log('Paint settings:', data)} />;
      case 'sticker':
        return <StickerTool onAddSticker={(sticker) => console.log('Add sticker:', sticker)} />;
      case 'balloon':
        return <BalloonTool onAddBalloon={(data) => console.log('Add balloon:', data)} />;
      case 'warp':
        return <WarpTool onWarpSettingsChange={(data) => console.log('Warp settings:', data)} />;
      case 'props':
        return <PropsTool onAddProp={(prop) => console.log('Add prop:', prop)} />;
      case 'crop':
        return <CropTool onCrop={(data) => console.log('Crop:', data)} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      {/* FIXED Top Bar */}
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

      {/* SCROLLABLE Image Canvas - This zooms independently */}
      <ScrollView
        style={styles.canvasScrollView}
        contentContainerStyle={styles.canvasContentContainer}
        maximumZoomScale={3}
        minimumZoomScale={1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'jpg', quality: 1.0 }}
          style={styles.viewShot}
        >
          <Image
            source={{ uri: imageUri }}
            style={getImageStyle()}
            resizeMode="contain"
          />
        </ViewShot>
      </ScrollView>

      {/* FIXED Bottom UI - Category Tabs, Tools, and Panels */}
      <View style={styles.bottomContainer}>
        {/* Tool Panel - Shows above tabs when tool selected */}
        {selectedTool && (
          <View style={styles.toolPanelContainer}>
            {renderToolPanel()}
          </View>
        )}

        {/* Category Tabs - Always visible */}
        <View style={styles.categoryTabs}>
          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'basic' && styles.categoryTabActive]}
            onPress={() => {
              setSelectedCategory('basic');
              setSelectedTool(null);
            }}
          >
            <Ionicons name="hammer" size={20} color={selectedCategory === 'basic' ? '#3498db' : '#95a5a6'} />
            <Text style={[styles.categoryLabel, selectedCategory === 'basic' && styles.categoryLabelActive]}>
              Basic
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'effects' && styles.categoryTabActive]}
            onPress={() => {
              setSelectedCategory('effects');
              setSelectedTool(null);
            }}
          >
            <Ionicons name="color-wand" size={20} color={selectedCategory === 'effects' ? '#3498db' : '#95a5a6'} />
            <Text style={[styles.categoryLabel, selectedCategory === 'effects' && styles.categoryLabelActive]}>
              Effects
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'draw' && styles.categoryTabActive]}
            onPress={() => {
              setSelectedCategory('draw');
              setSelectedTool(null);
            }}
          >
            <Ionicons name="create" size={20} color={selectedCategory === 'draw' ? '#3498db' : '#95a5a6'} />
            <Text style={[styles.categoryLabel, selectedCategory === 'draw' && styles.categoryLabelActive]}>
              Draw
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'fun' && styles.categoryTabActive]}
            onPress={() => {
              setSelectedCategory('fun');
              setSelectedTool(null);
            }}
          >
            <Ionicons name="happy" size={20} color={selectedCategory === 'fun' ? '#3498db' : '#95a5a6'} />
            <Text style={[styles.categoryLabel, selectedCategory === 'fun' && styles.categoryLabelActive]}>
              Fun
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tool Icons - Always visible */}
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
                onPress={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
              >
                <View style={[
                  styles.toolIcon,
                  selectedTool === tool.id && styles.toolIconActive,
                ]}>
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
      </View>
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
  canvasScrollView: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  canvasContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  viewShot: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  bottomContainer: {
    backgroundColor: '#2c3e50',
  },
  toolPanelContainer: {
    maxHeight: SCREEN_HEIGHT * 0.35,
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
  toolIconActive: {
    borderColor: '#3498db',
    backgroundColor: '#34495e',
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
});
