import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Auto-request permissions on mount
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'PixelWarp needs camera and photo access to edit images.',
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
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>PixelWarp</Text>
        <Text style={styles.tagline}>Photo Editor</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Ionicons name="images" size={120} color="#3498db" />
        
        <Text style={styles.instruction}>Select a photo to start editing</Text>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={pickImageFromGallery}
          activeOpacity={0.8}
        >
          <Ionicons name="images-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Choose Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={takePhoto}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0 • For modern phones</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#3498db',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  instruction: {
    fontSize: 18,
    color: '#ecf0f1',
    marginTop: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
  },
});
