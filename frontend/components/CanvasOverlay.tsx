import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
  rotation: number;
  outlineColor?: string;
  outlineWidth?: number;
}

interface StickerElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface CanvasOverlayProps {
  textElements: TextElement[];
  stickers: StickerElement[];
  balloons: any[];
  props: any[];
  onUpdateText: (id: string, updates: Partial<TextElement>) => void;
  onDeleteText: (id: string) => void;
  onUpdateSticker: (id: string, updates: Partial<StickerElement>) => void;
  onDeleteSticker: (id: string) => void;
  imageScale: number;
}

export default function CanvasOverlay({
  textElements,
  stickers,
  balloons,
  props,
  onUpdateText,
  onDeleteText,
  onUpdateSticker,
  onDeleteSticker,
  imageScale,
}: CanvasOverlayProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  return (
    <View style={[styles.overlay, { transform: [{ scale: imageScale }] }]} pointerEvents="box-none">
      {/* Text Elements */}
      {textElements.map((element) => (
        <DraggableText
          key={element.id}
          element={element}
          isSelected={selectedId === element.id}
          onSelect={() => setSelectedId(element.id)}
          onUpdate={(updates) => onUpdateText(element.id, updates)}
          onDelete={() => onDeleteText(element.id)}
        />
      ))}

      {/* Sticker Elements */}
      {stickers.map((sticker) => (
        <DraggableSticker
          key={sticker.id}
          sticker={sticker}
          isSelected={selectedId === sticker.id}
          onSelect={() => setSelectedId(sticker.id)}
          onUpdate={(updates) => onUpdateSticker(sticker.id, updates)}
          onDelete={() => onDeleteSticker(sticker.id)}
        />
      ))}

      {/* Balloon Elements */}
      {balloons.map((balloon) => (
        <DraggableBalloon
          key={balloon.id}
          balloon={balloon}
          isSelected={selectedId === balloon.id}
          onSelect={() => setSelectedId(balloon.id)}
        />
      ))}

      {/* Props Elements */}
      {props.map((prop) => (
        <DraggableSticker
          key={prop.id}
          sticker={prop}
          isSelected={selectedId === prop.id}
          onSelect={() => setSelectedId(prop.id)}
          onUpdate={(updates) => onUpdateSticker(prop.id, updates)}
          onDelete={() => onDeleteSticker(prop.id)}
        />
      ))}
    </View>
  );
}

// Draggable Text Component
function DraggableText({ element, isSelected, onSelect, onUpdate, onDelete }: any) {
  const translateX = useSharedValue(element.x);
  const translateY = useSharedValue(element.y);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = element.x + e.translationX;
      translateY.value = element.y + e.translationY;
    })
    .onEnd(() => {
      onUpdate({ x: translateX.value, y: translateY.value });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.draggable, animatedStyle]}>
        <TouchableOpacity onPress={onSelect} activeOpacity={0.9}>
          <Text
            style={[
              styles.textElement,
              {
                fontSize: element.fontSize,
                color: element.color,
                textShadowColor: element.outlineColor || '#000',
                textShadowOffset: { width: element.outlineWidth || 0, height: element.outlineWidth || 0 },
                textShadowRadius: element.outlineWidth || 0,
              },
            ]}
          >
            {element.text}
          </Text>
          {isSelected && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

// Draggable Sticker Component
function DraggableSticker({ sticker, isSelected, onSelect, onUpdate, onDelete }: any) {
  const translateX = useSharedValue(sticker.x);
  const translateY = useSharedValue(sticker.y);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = sticker.x + e.translationX;
      translateY.value = sticker.y + e.translationY;
    })
    .onEnd(() => {
      onUpdate({ x: translateX.value, y: translateY.value });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.draggable, animatedStyle]}>
        <TouchableOpacity onPress={onSelect} activeOpacity={0.9}>
          <Text style={{ fontSize: sticker.width / 1.5 }}>{sticker.type}</Text>
          {isSelected && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

// Draggable Balloon Component
function DraggableBalloon({ balloon, isSelected, onSelect }: any) {
  const translateX = useSharedValue(balloon.x);
  const translateY = useSharedValue(balloon.y);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = balloon.x + e.translationX;
      translateY.value = balloon.y + e.translationY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.draggable, animatedStyle]}>
        <TouchableOpacity onPress={onSelect} activeOpacity={0.9}>
          <View style={styles.balloonContainer}>
            <View style={[
              styles.balloon,
              isSelected && styles.balloonSelected,
            ]}>
              <Text style={styles.balloonText}>{balloon.text}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  draggable: {
    position: 'absolute',
  },
  textElement: {
    fontWeight: 'bold',
    padding: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  balloonContainer: {
    padding: 10,
  },
  balloon: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000',
    minWidth: 80,
  },
  balloonSelected: {
    borderColor: '#00D9FF',
  },
  balloonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});
