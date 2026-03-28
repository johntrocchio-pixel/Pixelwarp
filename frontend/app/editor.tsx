import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import ALL tool components
import AdjustTool from '../components/tools/AdjustTool';
import FilterTool from '../components/tools/FilterTool';
import TextTool from '../components/tools/TextTool';
import PaintTool from '../components/tools/PaintTool';
import StickerTool from '../components/tools/StickerTool';
import BalloonTool from '../components/tools/BalloonTool';
import WarpTool from '../components/tools/WarpTool';
import PropsTool from '../components/tools/PropsTool';
import CropTool from '../components/tools/CropTool';
import RotateTool from '../components/tools/RotateTool';
import FlipTool from '../components/tools/FlipTool';
import BlurTool from '../components/tools/BlurTool';
import SharpenTool from '../components/tools/SharpenTool';
import CanvasOverlay from '../components/CanvasOverlay';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

  // Image manipulation state
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [blurIntensity, setBlurIntensity] = useState(0);
  const [sharpenIntensity, setSharpenIntensity] = useState(0);
  
  // Adjustments state
  const [adjustments, setAdjustments] = useState({
    brightness: 1,
    contrast: 1,
    saturation: 1,
  });

  // Canvas elements state
  const [textElements, setTextElements] = useState<any[]>([]);
  const [stickers, setStickers] = useState<any[]>([]);
  const [balloons, setBalloons] = useState<any[]>([]);
  const [props, setProps] = useState<any[]>([]);

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

  // Tool handlers
  const handleRotate = (degrees: number) => {
    setRotation(degrees);
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
      setFlipHorizontal(!flipHorizontal);
    } else {
      setFlipVertical(!flipVertical);
    }
  };

  const handleAddText = (textData: any) => {
    setTextElements([...textElements, textData]);
  };

  const handleUpdateText = (id: string, updates: any) => {
    setTextElements(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteText = (id: string) => {
    setTextElements(prev => prev.filter(item => item.id !== id));
  };

  const handleAddSticker = (emoji: string) => {
    const newSticker = {
      id: Date.now().toString(),
      type: emoji,
      x: 150,
      y: 150,
      width: 80,
      height: 80,
      rotation: 0,
    };
    setStickers([...stickers, newSticker]);
  };

  const handleUpdateSticker = (id: string, updates: any) => {
    setStickers(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteSticker = (id: string) => {
    setStickers(prev => prev.filter(item => item.id !== id));
  };

  const handleAddBalloon = (balloonData: any) => {
    setBalloons([...balloons, balloonData]);
  };

  const handleAddProp = (emoji: string) => {
    const newProp = {
      id: Date.now().toString(),
      type: emoji,
      x: 150,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
    };
    setProps([...props, newProp]);
  };

  const getImageStyle = () => {
    const transform: any[] = [];
    
    // Apply rotation
    if (rotation !== 0) {
      transform.push(`rotate(${rotation}deg)`);
    }
    
    // Apply flips
    const scaleX = flipHorizontal ? -1 : 1;
    const scaleY = flipVertical ? -1 : 1;
    if (scaleX !== 1 || scaleY !== 1) {
      transform.push(`scaleX(${scaleX}) scaleY(${scaleY})`);
    }

    const styles: any = { 
      width: SCREEN_WIDTH * imageScale, 
      height: SCREEN_WIDTH * imageScale,
    };

    if (transform.length > 0) {
      styles.transform = transform.join(' ');
    }
    
    // Apply filters
    const filters = [];
    
    // Named filters
    if (currentFilter === 'grayscale') filters.push('grayscale(1)');
    if (currentFilter === 'sepia') filters.push('sepia(1)');
    if (currentFilter === 'invert') filters.push('invert(1)');
    if (currentFilter === 'vintage') {
      filters.push('sepia(0.5)');
      filters.push('contrast(1.2)');
    }
    if (currentFilter === 'warm') {
      filters.push('sepia(0.3)');
      filters.push('saturate(1.3)');
    }
    if (currentFilter === 'cool') {
      filters.push('hue-rotate(180deg)');
      filters.push('saturate(1.2)');
    }
    
    // Blur
    if (blurIntensity > 0) {
      filters.push(`blur(${blurIntensity}px)`);
    }
    
    // Adjustments
    if (adjustments.brightness !== 1) {
      filters.push(`brightness(${adjustments.brightness})`);
    }
    if (adjustments.contrast !== 1) {
      filters.push(`contrast(${adjustments.contrast})`);
    }
    if (adjustments.saturation !== 1) {
      filters.push(`saturate(${adjustments.saturation})`);
    }
    
    // Sharpen (approximated with contrast)
    if (sharpenIntensity > 0) {
      filters.push(`contrast(${1 + sharpenIntensity})`);
    }
    
    if (filters.length > 0) {
      styles.filter = filters.join(' ');
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
        return <TextTool onAddText={handleAddText} />;
      case 'paint':
        return <PaintTool onPaintSettingsChange={(data) => console.log('Paint settings:', data)} />;
      case 'sticker':
        return <StickerTool onAddSticker={handleAddSticker} />;
      case 'balloon':
        return <BalloonTool onAddBalloon={handleAddBalloon} />;
      case 'warp':
        return <WarpTool onWarpSettingsChange={(data) => console.log('Warp settings:', data)} />;
      case 'props':
        return <PropsTool onAddProp={handleAddProp} />;
      case 'crop':
        return <CropTool onCrop={(data) => console.log('Crop:', data)} />;
      case 'rotate':
        return <RotateTool onRotate={handleRotate} />;
      case 'flip':
        return <FlipTool onFlip={handleFlip} />;
      case 'blur':
        return <BlurTool onBlurChange={setBlurIntensity} />;
      case 'sharpen':
        return <SharpenTool onSharpenChange={setSharpenIntensity} />;
      case 'redeye':
        return (
          <View style={{ padding: 16, backgroundColor: '#111' }}>
            <Text style={{ color: '#FFF', textAlign: 'center' }}>
              Tap on red eyes in the image to remove them
            </Text>
          </View>
        );
      case 'distort':
        return (
          <View style={{ padding: 16, backgroundColor: '#111' }}>
            <Text style={{ color: '#FFF', textAlign: 'center' }}>
              Distort effects coming soon
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* FIXED Top Bar */}
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

      {/* FULL SCREEN Canvas */}
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
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: imageUri }}
              style={getImageStyle()}
              resizeMode="contain"
            />
            
            {/* Canvas Overlay with draggable elements */}
            <CanvasOverlay
              textElements={textElements}
              stickers={stickers}
              balloons={balloons}
              props={props}
              onUpdateText={handleUpdateText}
              onDeleteText={handleDeleteText}
              onUpdateSticker={handleUpdateSticker}
              onDeleteSticker={handleDeleteSticker}
              imageScale={imageScale}
            />
          </View>
        </ViewShot>
      </ScrollView>

      {/* FLOATING Bottom UI */}
      <View style={styles.floatingBottomContainer}>
        {/* Tool Panel */}
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

        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          {(['basic', 'effects', 'draw', 'fun'] as const).map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, selectedCategory === category && styles.categoryTabActive]}
              onPress={() => {
                setSelectedCategory(category);
                setSelectedTool(null);
              }}
            >
              <Ionicons 
                name={category === 'basic' ? 'hammer' : category === 'effects' ? 'color-wand' : category === 'draw' ? 'create' : 'happy'} 
                size={18} 
                color={selectedCategory === category ? '#00D9FF' : '#666'} 
              />
              <Text style={[styles.categoryLabel, selectedCategory === category && styles.categoryLabelActive]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tool Icons */}
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
    </GestureHandlerRootView>
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
    paddingTop: 50,
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
    paddingTop: 100,
    paddingBottom: 280,
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
    paddingBottom: 30,
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
