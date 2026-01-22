# Development & Testing Guide

## Quick Start

This guide helps you test the app locally before deploying.

## Prerequisites Check

```bash
# Check Node.js version (should be 18+)
node --version

# Check if npm is installed
npm --version

# Install Expo CLI globally (if not already installed)
npm install -g expo-cli

# Install EAS CLI globally (for builds)
npm install -g eas-cli

# Login to Expo (creates account if needed)
expo login
```

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

This will:
- Start the Metro bundler
- Display a QR code
- Open the Expo DevTools in your browser

### 3. Run on Device/Emulator

**Option A: Using Expo Go (Easiest)**
- Install "Expo Go" app from App Store (iOS) or Google Play (Android)
- Scan the QR code from the terminal

**Option B: iOS Simulator (Mac only)**
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

## Testing the App

### Test Cases

1. **Initial Load**
   - App should load https://code.imdaniel.fyi
   - Two buttons should be visible at the top
   - "Download Cache" button should be visible (no cache yet)
   - "Reload" button should be visible

2. **Download Cache**
   - Tap "Download Cache" button
   - Wait for success alert: "Page cached successfully!"
   - Button should change to "Clear Cache"

3. **Navigate Within Domain**
   - Click links within code.imdaniel.fyi
   - Cache should work for all pages within the domain

4. **Clear Cache**
   - Tap "Clear Cache" button
   - Confirm in the alert dialog
   - Wait for success alert: "Cache cleared successfully!"
   - Button should change back to "Download Cache"

5. **Reload**
   - Tap "Reload" button
   - Page should reload from network

6. **Offline Mode**
   - Download cache first
   - Enable airplane mode on device
   - Close and reopen app
   - Cached content should still be accessible

## Building with EAS

### Development Build

```bash
# Login to Expo
eas login

# Configure the project
eas build:configure

# Build for iOS (simulator)
eas build --platform ios --profile development

# Build for Android (APK)
eas build --platform android --profile development
```

### Production Build

```bash
# iOS App Store
eas build --platform ios --profile production

# Android Play Store
eas build --platform android --profile production
```

## CI/CD Testing

### Test the GitHub Actions Workflow

1. Set up EXPO_TOKEN secret in GitHub repository settings
2. Push any change to trigger the workflow
3. Check Actions tab in GitHub to see build progress

### Get EXPO_TOKEN

```bash
# Method 1: From CLI
expo whoami

# Method 2: Create at
# https://expo.dev/accounts/[your-username]/settings/access-tokens
```

## Troubleshooting

### Common Issues

**Issue**: Metro bundler not starting
```bash
# Clear cache and restart
npx expo start --clear
```

**Issue**: Dependencies not installing
```bash
# Clear npm cache
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Build failing in CI/CD
- Check that EXPO_TOKEN is set correctly in GitHub secrets
- Verify app.json and eas.json are valid JSON
- Check GitHub Actions logs for specific errors

**Issue**: WebView not loading
- Check internet connection
- Verify the URL is accessible
- Check console logs for errors

**Issue**: Cache not working
- Ensure expo-file-system is installed
- Check device storage permissions
- View console logs for cache errors

## Project Structure

```
rn-webview/
├── .github/workflows/
│   └── eas-build.yml          # CI/CD configuration
├── assets/                     # App icons and splash screens
├── App.js                      # Main application code
├── app.json                    # Expo configuration
├── eas.json                    # EAS Build profiles
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
└── README.md                   # Documentation
```

## Key Features Implemented

### WebView Component
- Points to https://code.imdaniel.fyi
- Enables JavaScript and DOM storage
- Handles navigation state changes
- Supports message passing between web and native

### Caching System
- Uses expo-file-system for persistence
- Stores HTML content in document directory
- Creates hash-based filenames from URLs
- Maintains metadata for cached pages
- Supports offline-first loading

### UI Controls
- **Cache Control Button**: Dynamic label based on cache state
- **Reload Button**: Forces fresh network request
- Both buttons styled with iOS-like appearance

### CI/CD Pipeline
- Triggers on every push to any branch
- Builds both iOS and Android
- Uses development profile for Expo Go compatibility
- Checks for EXPO_TOKEN before running

## Next Steps

1. **Customize the App**
   - Update app.json with your app name and identifiers
   - Replace placeholder assets with your own icons
   - Modify colors and styling in App.js

2. **Production Setup**
   - Configure production build profiles in eas.json
   - Set up app store accounts (Apple Developer, Google Play)
   - Add app signing credentials

3. **Enhanced Features**
   - Implement background cache refresh
   - Add cache size management
   - Implement selective cache clearing
   - Add loading indicators
   - Enhance error handling

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)
