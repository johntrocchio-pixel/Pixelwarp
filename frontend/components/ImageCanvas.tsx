import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Svg, { Text as SvgText, Path, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageCanvasProps {
  imageUri: string;
  textElements: any[];
  drawPaths: any[];
  stickers: any[];
  filter: string;
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
  };
  onUpdateText: (id: string, updates: any) => void;
  onDeleteText: (id: string) => void;
  onUpdateSticker: (id: string, updates: any) => void;
  onDeleteSticker: (id: string) => void;
  isWarpMode: boolean;
}

export default function ImageCanvas({
  imageUri,
  textElements,
  drawPaths,
  stickers,
  filter,
  adjustments,
  onUpdateText,
  onDeleteText,
  onUpdateSticker,
  onDeleteSticker,
  isWarpMode,
}: ImageCanvasProps) {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: SCREEN_WIDTH, height: SCREEN_WIDTH });

  const getFilterStyle = () => {
    const filterStyles: any = {};

    // Apply adjustments
    const filters = [];
    if (adjustments.brightness !== 1) {
      filters.push(`brightness(${adjustments.brightness})`);
    }
    if (adjustments.contrast !== 1) {
      filters.push(`contrast(${adjustments.contrast})`);
    }
    if (adjustments.saturation !== 1) {
      filters.push(`saturate(${adjustments.saturation})`);
    }

    // Apply named filters
    switch (filter) {
      case 'grayscale':
        filters.push('grayscale(1)');
        break;
      case 'sepia':
        filters.push('sepia(1)');
        break;
      case 'invert':
        filters.push('invert(1)');
        break;
      case 'blur':
        filters.push('blur(5px)');
        break;
    }

    if (filters.length > 0) {
      filterStyles.filter = filters.join(' ');
    }

    return filterStyles;
  };

  return (
    <View style={styles.container}>
      {/* Base Image */}
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, getFilterStyle()]}
        resizeMode="contain"
        onLoad={(e) => {
          const { width, height } = e.nativeEvent.source;
          const aspectRatio = width / height;
          setImageSize({
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH / aspectRatio,
          });
        }}
      />

      {/* Drawing Layer */}
      <Svg
        style={[styles.overlay, { width: imageSize.width, height: imageSize.height }]}
        viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
      >
        {drawPaths.map((path) => {
          const pathData = path.points
            .map((point: any, index: number) => {
              const command = index === 0 ? 'M' : 'L';
              return `${command}${point.x},${point.y}`;
            })
            .join(' ');

          return (
            <Path
              key={path.id}
              d={pathData}
              stroke={path.color}
              strokeWidth={path.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* Text Elements */}
        {textElements.map((textEl) => (
          <G key={textEl.id}>
            <SvgText
              x={textEl.x}
              y={textEl.y}
              fontSize={textEl.fontSize}
              fill={textEl.color}
              fontWeight="bold"
              textAnchor="middle"
              stroke={textEl.outlineColor || 'transparent'}
              strokeWidth={textEl.outlineWidth || 0}
            >
              {textEl.text}
            </SvgText>
          </G>
        ))}
      </Svg>

      {/* Text Elements (Touchable) */}
      {textElements.map((textEl) => (
        <TouchableOpacity
          key={`touch-${textEl.id}`}
          style={[
            styles.textElement,
            {
              left: textEl.x - 50,
              top: textEl.y - textEl.fontSize / 2,
            },
          ]}
          onPress={() => setSelectedText(textEl.id)}
          onLongPress={() => onDeleteText(textEl.id)}
        >
          <Text
            style={{
              fontSize: textEl.fontSize,
              color: textEl.color,
              fontWeight: 'bold',
            }}
          >
            {textEl.text}
          </Text>
          {selectedText === textEl.id && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteText(textEl.id)}
            >
              <Ionicons name="close-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}

      {/* Sticker Elements */}
      {stickers.map((sticker) => (
        <TouchableOpacity
          key={sticker.id}
          style={[
            styles.stickerElement,
            {
              left: sticker.x,
              top: sticker.y,
              width: sticker.width,
              height: sticker.height,
              transform: [{ rotate: `${sticker.rotation}deg` }],
            },
          ]}
          onPress={() => setSelectedSticker(sticker.id)}
          onLongPress={() => onDeleteSticker(sticker.id)}
        >
          <Text style={{ fontSize: sticker.width / 2 }}>{sticker.type}</Text>
          {selectedSticker === sticker.id && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteSticker(sticker.id)}
            >
              <Ionicons name="close-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textElement: {
    position: 'absolute',
    padding: 8,
  },
  stickerElement: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
});