import React, { useState, useRef, useCallback } from 'react';
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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

import ImageCanvas from '../components/ImageCanvas';
import ToolBar from '../components/ToolBar';
import TextEditor from '../components/TextEditor';
import DrawingPanel from '../components/DrawingPanel';
import FilterPanel from '../components/FilterPanel';
import StickerPanel from '../components/StickerPanel';
import AdjustmentPanel from '../components/AdjustmentPanel';
import WarpBrush from '../components/WarpBrush';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type Tool = 
  | 'none' 
  | 'text' 
  | 'draw' 
  | 'filter' 
  | 'sticker' 
  | 'adjust' 
  | 'warp'
  | 'crop';

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  rotation: number;
  outlineColor?: string;
  outlineWidth?: number;
  shadowColor?: string;
  shadowOffset?: { x: number; y: number };
}

export interface DrawPath {
  id: string;
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
}

export interface StickerElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export default function EditorScreen() {
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string;
  const imageBase64 = params.imageBase64 as string;

  const viewShotRef = useRef<ViewShot>(null);

  const [selectedTool, setSelectedTool] = useState<Tool>('none');
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [drawPaths, setDrawPaths] = useState<DrawPath[]>([]);
  const [stickers, setStickers] = useState<StickerElement[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('none');
  const [adjustments, setAdjustments] = useState({
    brightness: 1,
    contrast: 1,
    saturation: 1,
    hue: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((state: any) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      // Restore state
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      // Restore state
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Request media library permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library access to save images');
        setIsSaving(false);
        return;
      }

      // Capture the view as image
      if (!viewShotRef.current) {
        Alert.alert('Error', 'Unable to save image');
        setIsSaving(false);
        return;
      }

      const uri = await viewShotRef.current.capture();
      
      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('PicSay Pro', asset, false);

      Alert.alert(
        'Success',
        'Image saved to gallery!',
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

  const handleAddText = (newText: TextElement) => {
    setTextElements([...textElements, newText]);
    addToHistory({ textElements: [...textElements, newText] });
  };

  const handleUpdateText = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteText = (id: string) => {
    setTextElements(prev => prev.filter(item => item.id !== id));
  };

  const handleAddDrawPath = (path: DrawPath) => {
    setDrawPaths([...drawPaths, path]);
    addToHistory({ drawPaths: [...drawPaths, path] });
  };

  const handleAddSticker = (sticker: StickerElement) => {
    setStickers([...stickers, sticker]);
    addToHistory({ stickers: [...stickers, sticker] });
  };

  const handleUpdateSticker = (id: string, updates: Partial<StickerElement>) => {
    setStickers(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteSticker = (id: string) => {
    setStickers(prev => prev.filter(item => item.id !== id));
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    addToHistory({ currentFilter: filter });
  };

  const handleAdjustmentChange = (key: string, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            Alert.alert(
              'Discard Changes?',
              'Are you sure you want to go back? All changes will be lost.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Discard', onPress: () => router.back(), style: 'destructive' },
              ]
            );
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Photo</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={undo}
            disabled={historyIndex <= 0}
          >
            <Ionicons
              name="arrow-undo"
              size={24}
              color={historyIndex <= 0 ? '#666' : '#FFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Ionicons
              name="arrow-redo"
              size={24}
              color={historyIndex >= history.length - 1 ? '#666' : '#FFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="checkmark" size={24} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Canvas Area */}
      <View style={styles.canvasContainer}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'jpg', quality: 1.0 }}
          style={styles.viewShot}
        >
          <ImageCanvas
            imageUri={imageUri}
            textElements={textElements}
            drawPaths={drawPaths}
            stickers={stickers}
            filter={currentFilter}
            adjustments={adjustments}
            onUpdateText={handleUpdateText}
            onDeleteText={handleDeleteText}
            onUpdateSticker={handleUpdateSticker}
            onDeleteSticker={handleDeleteSticker}
            isWarpMode={selectedTool === 'warp'}
          />
        </ViewShot>
      </View>

      {/* Tool Panels */}
      {selectedTool === 'text' && (
        <TextEditor onAddText={handleAddText} onClose={() => setSelectedTool('none')} />
      )}
      
      {selectedTool === 'draw' && (
        <DrawingPanel onAddPath={handleAddDrawPath} onClose={() => setSelectedTool('none')} />
      )}
      
      {selectedTool === 'filter' && (
        <FilterPanel
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
          onClose={() => setSelectedTool('none')}
        />
      )}
      
      {selectedTool === 'sticker' && (
        <StickerPanel onAddSticker={handleAddSticker} onClose={() => setSelectedTool('none')} />
      )}
      
      {selectedTool === 'adjust' && (
        <AdjustmentPanel
          adjustments={adjustments}
          onAdjustmentChange={handleAdjustmentChange}
          onClose={() => setSelectedTool('none')}
        />
      )}
      
      {selectedTool === 'warp' && (
        <WarpBrush onClose={() => setSelectedTool('none')} />
      )}

      {/* Bottom Toolbar */}
      <ToolBar selectedTool={selectedTool} onSelectTool={setSelectedTool} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewShot: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
  },
});
