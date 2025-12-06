import 'dotenv/config';

export default {
  expo: {
    name: 'Casa Latina',
    slug: 'casa-latina',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    description: 'An exclusive members-only community connecting Latinos through curated events and experiences in Miami.',
    primaryColor: '#D5C4A1',
    splash: {
      image: './assets/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.casalatina.app',
      buildNumber: '1',
      infoPlist: {
        NSPhotoLibraryUsageDescription: 'Casa Latina needs access to your photo library to upload profile pictures and share event photos.',
        NSCameraUsageDescription: 'Casa Latina needs camera access to take profile pictures.',
        NSPhotoLibraryAddUsageDescription: 'Casa Latina needs permission to save photos to your library.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icon-transparent.png',
        backgroundColor: '#000000',
      },
      package: 'com.casalatina.app',
      versionCode: 1,
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'CAMERA',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    scheme: 'casalatina',
    extra: {
      eas: {
        projectId: '45050d16-7ca5-4645-8876-e8f57321d85c',
      },
      // Firebase config with fallbacks for production builds
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBPyqFGEdXR9AlBnEP7hxTxg30l3UvpieY',
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'gotham-6fc37.firebaseapp.com',
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'gotham-6fc37',
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'gotham-6fc37.firebasestorage.app',
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1013997283624',
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:1013997283624:web:b30b2e7c806cc00f74481d',
    },
  },
};

