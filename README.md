# PicSay Pro Clone - Professional Mobile Photo Editor

A comprehensive photo editing application built with Expo/React Native that replicates all the features of the popular PicSay Pro app, optimized for modern phones.

![PicSay Pro Clone](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎨 Features

### ✨ Complete Photo Editing Suite
- **Text Tool** - Add custom text with fonts, colors, outlines, and shadows
- **Drawing Tools** - Freehand brush with adjustable size and colors
- **Filters** - 8+ professional filters (Grayscale, Sepia, Vintage, Warm, Cool, etc.)
- **Stickers & Emojis** - 12 emoji stickers + speech bubbles
- **Image Adjustments** - Brightness, Contrast, Saturation, Hue controls
- **Warp Brush** - Push, Pull, and Twirl effects for creative distortions
- **Save & Share** - Export high-quality images to gallery

### 📱 Mobile-First Design
- Beautiful, modern UI with dark theme
- Intuitive touch gestures
- Real-time preview
- Undo/Redo functionality
- Permission handling for camera and gallery

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB
- Expo CLI

### Installation

1. **Clone and navigate to project**
```bash
git clone https://github.com/johntrocchio-pixel /Pixelwarp.git
```

2. **Install Frontend Dependencies**
```bash
cd Pixelwarp/frontend
```

3. **Install Backend Dependencies**
```bash
npm install
```

4. **Start Services**
```bash
npx expo start
```

5. **Access the App**
npx eas-cli@latest build --platform android

## 📐 Architecture

### Frontend Stack
- **Framework**: Expo SDK 54 / React Native 0.81
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: React Native + Custom Components
- **State Management**: React Hooks
- **Image Processing**: expo-image-picker, react-native-view-shot, react-native-svg

### Backend Stack
- **Framework**: FastAPI
- **Image Processing**: Pillow, OpenCV
- **Database**: MongoDB
- **Storage**: Base64 encoding for images

### Key Libraries
```json
{
  "expo-image-picker": "Gallery & camera access",
  "expo-media-library": "Save to device",
  "react-native-view-shot": "Canvas capture",
  "react-native-svg": "Vector graphics",
  "@react-native-community/slider": "UI controls",
  "react-native-gesture-handler": "Touch interactions"
}
```

## 🎯 Usage

### 1. Select an Image
- Tap "Choose from Gallery" to pick an existing photo
- Tap "Take Photo" to capture a new image
- Grant necessary permissions when prompted

### 2. Edit Your Photo
- **Add Text**: Tap text icon, customize font, size, color, and outline
- **Draw**: Select brush, choose color and size, draw on canvas
- **Apply Filters**: Browse and apply filters with one tap
- **Add Stickers**: Choose from emojis or speech bubbles
- **Adjust**: Fine-tune brightness, contrast, saturation, and hue
- **Warp**: Use push/pull/twirl modes for creative effects

### 3. Save Your Work
- Tap the checkmark icon in top-right
- Image automatically saves to your gallery
- Find it in the "PicSay Pro" album

## 🛠️ API Endpoints

### Backend Routes
```
POST /api/apply-filter
- Apply advanced filters (vintage, warm, cool)
- Body: { image_base64, filter_type, intensity }

POST /api/save-project
- Save editing project to database
- Body: ImageProject model

GET /api/projects
- Retrieve all saved projects
```

## 📱 Permissions

### iOS (Info.plist)
- `NSPhotoLibraryUsageDescription`: "Select photos to edit"
- `NSCameraUsageDescription`: "Capture photos to edit"
- `NSPhotoLibraryAddUsageDescription`: "Save edited photos"

### Android (AndroidManifest.xml)
- `CAMERA`
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`
- `READ_MEDIA_IMAGES`

## 🎨 Design System

### Color Palette
- **Primary**: #FF6B6B (Coral Red)
- **Secondary**: #4ECDC4 (Turquoise)
- **Background**: #1a1a1a (Dark)
- **Surface**: #2a2a2a (Gray)
- **Accent**: #FFA07A (Salmon)

### Typography
- Titles: 36px Bold
- Headers: 20px Semibold
- Body: 16px Regular
- Captions: 14px Regular

## 🧪 Testing

### Manual Testing Checklist
- [ ] Image selection from gallery works
- [ ] Camera capture works
- [ ] Text tool adds and positions text
- [ ] Drawing tool creates smooth strokes
- [ ] All filters apply correctly
- [ ] Stickers can be added and moved
- [ ] Adjustments update in real-time
- [ ] Save function works and image appears in gallery
- [ ] Undo/Redo functions work
- [ ] Permissions are requested properly

### Testing on Physical Device
1. Install Expo Go from App Store/Play Store
2. Scan QR code from terminal
3. Test all features
4. Verify saved images in gallery

## 📁 Project Structure

```
/app/
├── frontend/
│   ├── app/
│   │   ├── index.tsx          # Home screen
│   │   └── editor.tsx         # Editor screen
│   ├── components/
│   │   ├── ImageCanvas.tsx    # Main canvas
│   │   ├── ToolBar.tsx        # Tool selector
│   │   ├── TextEditor.tsx     # Text tool
│   │   ├── DrawingPanel.tsx   # Drawing tool
│   │   ├── FilterPanel.tsx    # Filters
│   │   ├── StickerPanel.tsx   # Stickers
│   │   ├── AdjustmentPanel.tsx # Adjustments
│   │   └── WarpBrush.tsx      # Warp tool
│   └── package.json
├── backend/
│   ├── server.py              # FastAPI server
│   └── requirements.txt
└── memory/
    ├── PRD.md                 # Product requirements
    └── test_credentials.md    # Test info
```

## 🚧 Known Limitations

1. **Warp Brush** - UI is complete, pixel manipulation requires WebGL implementation
2. **Crop Tool** - Not yet implemented
3. **Custom Fonts** - Limited to system fonts
4. **Large Images** - May be slow on lower-end devices

## 🔮 Future Enhancements

- [ ] Implement actual warp brush pixel manipulation
- [ ] Add crop and rotate tools
- [ ] More sticker packs and fonts
- [ ] Layer management panel
- [ ] Templates and presets
- [ ] Cloud sync
- [ ] Social media sharing
- [ ] Batch processing

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Inspired by the original PicSay Pro application
- Built with Expo and React Native
- Image processing powered by Pillow and OpenCV

## 📞 Support

For issues or questions:
1. Check the PRD.md file in /app/memory/
2. Review test_credentials.md for testing info
3. Check expo logs for frontend errors
4. Check backend logs for API errors

---

**Built with ❤️ using Expo, React Native, and FastAPI**
