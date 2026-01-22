import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';

const TARGET_URL = 'https://code.imdaniel.fyi';
const CACHE_DIR = FileSystem.documentDirectory + 'webview_cache/';

export default function App() {
  const webViewRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(TARGET_URL);
  const [hasCache, setHasCache] = useState(false);
  const [cacheLoaded, setCacheLoaded] = useState(false);

  // Initialize cache directory and check for existing cache
  useEffect(() => {
    initializeCache();
  }, []);

  const initializeCache = async () => {
    try {
      // Create cache directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
      }
      
      // Check if cache exists
      await checkCacheExists();
    } catch (error) {
      console.error('Error initializing cache:', error);
    }
  };

  const checkCacheExists = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
      setHasCache(files.length > 0);
    } catch (error) {
      console.error('Error checking cache:', error);
      setHasCache(false);
    }
  };

  const getCacheFileName = (url) => {
    // Create a simple hash of the URL for the filename
    const hash = url.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `page_${Math.abs(hash)}.html`;
  };

  const downloadCache = async () => {
    try {
      // Inject JavaScript to get the current page HTML
      const injectedJS = `
        (function() {
          const html = document.documentElement.outerHTML;
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pageHtml',
            url: window.location.href,
            html: html
          }));
        })();
        true;
      `;
      
      webViewRef.current?.injectJavaScript(injectedJS);
    } catch (error) {
      console.error('Error downloading cache:', error);
      Alert.alert('Error', 'Failed to download cache');
    }
  };

  const saveToCache = async (url, html) => {
    try {
      const fileName = getCacheFileName(url);
      const filePath = CACHE_DIR + fileName;
      
      await FileSystem.writeAsStringAsync(filePath, html);
      
      // Create a metadata file
      const metadataPath = CACHE_DIR + 'metadata.json';
      let metadata = {};
      
      try {
        const metadataContent = await FileSystem.readAsStringAsync(metadataPath);
        metadata = JSON.parse(metadataContent);
      } catch (e) {
        // Metadata file doesn't exist yet
      }
      
      metadata[url] = {
        fileName: fileName,
        timestamp: new Date().toISOString()
      };
      
      await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata));
      
      setHasCache(true);
      Alert.alert('Success', 'Page cached successfully!');
    } catch (error) {
      console.error('Error saving to cache:', error);
      Alert.alert('Error', 'Failed to save cache');
    }
  };

  const loadFromCache = async (url) => {
    try {
      const fileName = getCacheFileName(url);
      const filePath = CACHE_DIR + fileName;
      
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const html = await FileSystem.readAsStringAsync(filePath);
        return html;
      }
      return null;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return null;
    }
  };

  const clearCache = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
      
      for (const file of files) {
        await FileSystem.deleteAsync(CACHE_DIR + file);
      }
      
      setHasCache(false);
      setCacheLoaded(false);
      Alert.alert('Success', 'Cache cleared successfully!');
      
      // Reload the page from network
      webViewRef.current?.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const handleCacheButtonPress = () => {
    if (hasCache) {
      Alert.alert(
        'Clear Cache',
        'Are you sure you want to clear all cached content?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', onPress: clearCache, style: 'destructive' }
        ]
      );
    } else {
      downloadCache();
    }
  };

  const handleReload = () => {
    setCacheLoaded(false);
    webViewRef.current?.reload();
  };

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'pageHtml') {
        await saveToCache(data.url, data.html);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  const handleNavigationStateChange = async (navState) => {
    setCurrentUrl(navState.url);
    
    // Only load from cache on initial load if not already loaded from cache
    if (!cacheLoaded && navState.url.includes('code.imdaniel.fyi')) {
      const cachedHtml = await loadFromCache(navState.url);
      if (cachedHtml) {
        setCacheLoaded(true);
        // Note: In a production app, you'd want to inject this cached HTML
        // and then fetch fresh content in the background
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cacheButton]} 
          onPress={handleCacheButtonPress}
        >
          <Text style={styles.buttonText}>
            {hasCache ? 'Clear Cache' : 'Download Cache'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.reloadButton]} 
          onPress={handleReload}
        >
          <Text style={styles.buttonText}>Reload</Text>
        </TouchableOpacity>
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: TARGET_URL }}
        style={styles.webview}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        cacheEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cacheButton: {
    backgroundColor: '#007AFF',
  },
  reloadButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
  },
});
