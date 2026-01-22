# RN WebView

A React Native app built with Expo that displays a WebView to `https://code.imdaniel.fyi` with offline-first caching capabilities.

## Features

- **WebView**: Opens and navigates `code.imdaniel.fyi` domain
- **Offline-First Caching**: Caches pages from the domain for offline access
- **Cache Control**: Download or clear cached content
- **Reload Button**: Force reload from network
- **CI/CD**: Automated builds via GitHub Actions and EAS Build

## Setup

### Prerequisites

- Node.js 18 or later
- Expo CLI
- EAS CLI
- An Expo account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dsyang/rn-webview.git
   cd rn-webview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Running the App

### Expo Go

```bash
npm start
```

Then scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

### Development Build

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

## CI/CD Setup

The repository includes GitHub Actions workflow for automated EAS builds.

### Configure EXPO_TOKEN

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `EXPO_TOKEN`
5. Value: Your Expo access token (get it from `expo whoami` or https://expo.dev/accounts/[username]/settings/access-tokens)

### Workflow Triggers

The workflow runs on every push to any branch and builds:
- iOS development build (simulator compatible)
- Android development build (APK)

## App Structure

```
├── .github/
│   └── workflows/
│       └── eas-build.yml      # CI/CD workflow
├── App.js                      # Main app component
├── app.json                    # Expo configuration
├── eas.json                    # EAS Build configuration
├── package.json                # Dependencies
└── babel.config.js             # Babel configuration
```

## How It Works

### Caching System

- Uses `expo-file-system` to persist cached HTML content
- Caches are stored in the app's document directory
- Each page is saved with a hashed filename based on its URL
- Metadata tracks cached URLs and timestamps

### Cache Control Button

- **"Download Cache"**: Appears when no cache exists - downloads and saves current page
- **"Clear Cache"**: Appears when cache exists - removes all cached content

### Reload Button

- Forces a fresh reload from the network
- Bypasses any cached content

## Technologies

- **Expo SDK 51**: React Native framework
- **react-native-webview**: WebView component
- **expo-file-system**: File system API for caching
- **EAS Build**: Cloud build service

## License

See [LICENSE](LICENSE) file for details.
