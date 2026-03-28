import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are needed to edit photos.',
        [{ text: 'OK' }]
      );
      setHasPermission(false);
      return false;
    }
    
    setHasPermission(true);
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const base64 = result.assets[0].base64;
        
        router.push({
          pathname: '/editor',
          params: { 
            imageUri,
            imageBase64: base64 || '',
          },
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const base64 = result.assets[0].base64;
        
        router.push({
          pathname: '/editor',
          params: { 
            imageUri,
            imageBase64: base64 || '',
          },
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="images" size={80} color="#FF6B6B" />
          <Text style={styles.title}>PicSay Pro</Text>
          <Text style={styles.subtitle}>Professional Photo Editor</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={pickImageFromGallery}
            activeOpacity={0.8}
          >
            <Ionicons name="images-outline" size={32} color="#FFF" />
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={takePhoto}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-outline" size={32} color="#FFF" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features:</Text>
          <View style={styles.featuresList}>
            <FeatureItem icon="text" text="Add Text & Fonts" />
            <FeatureItem icon="brush" text="Draw & Paint" />
            <FeatureItem icon="color-filter" text="Filters & Effects" />
            <FeatureItem icon="happy" text="Stickers & Emojis" />
            <FeatureItem icon="git-compare" text="Warp & Distort" />
            <FeatureItem icon="crop" text="Crop & Rotate" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const FeatureItem = ({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={20} color="#FF6B6B" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 48,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#CCC',
  },
});
