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
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'effects' | 'draw' | 'fun'>('basic');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageScale, setImageScale] = useState(1);

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

  const handleZoomIn = () => {
    const newScale = Math.min(imageScale + 0.5, 3);
    setImageScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(imageScale - 0.5, 1);
    setImageScale(newScale);
  };

  const handleResetZoom = () => {
    setImageScale(1);
  };

  const getImageStyle = () => {
    const styles: any = { 
      width: SCREEN_WIDTH * imageScale, 
      height: SCREEN_WIDTH * imageScale 
    };
    
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* FIXED Top Bar - Floating */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>PixelWarp</Text>

        <View style={styles.topRight}>
          {/* Zoom Controls */}
          <TouchableOpacity 
            style={styles.zoomButton} 
            onPress={handleZoomOut}
            disabled={imageScale <= 1}
          >
            <Ionicons name="remove" size={20} color={imageScale <= 1 ? '#555' : '#FFF'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.zoomButton} onPress={handleResetZoom}>
            <Text style={styles.zoomText}>{Math.round(imageScale * 100)}%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.zoomButton} 
            onPress={handleZoomIn}
            disabled={imageScale >= 3}
          >
            <Ionicons name="add" size={20} color={imageScale >= 3 ? '#555' : '#FFF'} />
          </TouchableOpacity>

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
      </View>

      {/* FULL SCREEN Canvas - Behind Everything */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.canvasScrollView}
        contentContainerStyle={styles.canvasContentContainer}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        scrollEnabled={true}
        bounces={true}
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

      {/* FLOATING Bottom UI - ABSOLUTE POSITION - Always on Top */}
      <View style={styles.floatingBottomContainer}>
        {/* Tool Panel - Floats above everything */}
        {selectedTool && (
          <View style={styles.toolPanelContainer}>
            <View style={styles.toolPanelHeader}>
              <Text style={styles.toolPanelTitle}>
                {toolCategories[selectedCategory].find(t => t.id === selectedTool)?.label}
              </Text>
              <TouchableOpacity onPress={() => setSelectedTool(null)}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            {renderToolPanel()}
          </View>
        )}

        {/* Category Tabs - Floating */}
        <View style={styles.categoryTabs}>
          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'basic' && styles.categoryTabActive]}
            onPress={() => {
              setSelectedCategory('basic');
              setSelectedTool(null);
            }}
          >
            <Ionicons name="hammer" size={18} color={selectedCategory === 'basic' ? '#00D9FF' : '#666'} />
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
            <Ionicons name="color-wand" size={18} color={selectedCategory === 'effects' ? '#00D9FF' : '#666'} />
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
            <Ionicons name="create" size={18} color={selectedCategory === 'draw' ? '#00D9FF' : '#666'} />
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
            <Ionicons name="happy" size={18} color={selectedCategory === 'fun' ? '#00D9FF' : '#666'} />
            <Text style={[styles.categoryLabel, selectedCategory === 'fun' && styles.categoryLabelActive]}>
              Fun
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tool Icons - Floating */}
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
                    size={26}
                    color={selectedTool === tool.id ? '#00D9FF' : '#CCC'}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 50, // Safe area top
    paddingBottom: 10,
    backgroundColor: 'rgba(17, 17, 17, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#00D9FF',
    zIndex: 100,
  },
  topButton: {
    padding: 8,
    minWidth: 40,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zoomButton: {
    padding: 6,
    minWidth: 36,
    alignItems: 'center',
  },
  zoomText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#00D900',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00D9FF',
  },
  canvasScrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  canvasContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100, // Space for top bar
    paddingBottom: 280, // Space for bottom tools
    padding: 10,
  },
  viewShot: {
    backgroundColor: '#000',
  },
  floatingBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 17, 17, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#222',
    zIndex: 100,
    paddingBottom: 30, // Safe area bottom
  },
  toolPanelContainer: {
    maxHeight: SCREEN_HEIGHT * 0.35,
    borderTopWidth: 1,
    borderTopColor: '#00D9FF',
  },
  toolPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  toolPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D9FF',
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: '#111',
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryTabActive: {
    borderBottomColor: '#00D9FF',
  },
  categoryLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  categoryLabelActive: {
    color: '#00D9FF',
    fontWeight: '600',
  },
  toolBar: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
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
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  toolIconActive: {
    borderColor: '#00D9FF',
    backgroundColor: '#1a1a1a',
  },
  toolLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  toolLabelActive: {
    color: '#00D9FF',
    fontWeight: '600',
  },
});
