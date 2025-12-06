/**
 * Firebase Configuration
 *
 * Uses Expo Constants to access Firebase config from app.config.ts
 * This ensures the config works in both development and production builds
 *
 * Required Firebase services:
 * - Authentication (Email/Password)
 * - Cloud Firestore
 * - Cloud Storage
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Get Firebase config from app.config.ts via Expo Constants
const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
};

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase configuration is missing. Check app.config.ts');
  throw new Error('Firebase configuration is incomplete. Please check your app.config.ts file.');
}

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

export const firebaseApp = app;

// Initialize Auth
// Note: Auth persistence will use default behavior (memory for React Native)
// For production, consider adding AsyncStorage persistence if needed
export const auth = getAuth(app);

// Initialize Firestore with named database (Native Mode)
// The (default) database is in Datastore Mode which doesn't work with Firebase SDK
export const db = getFirestore(app, 'casa-latina-premium-app');

// Initialize Firebase Storage for profile photos and media
export const storage = getStorage(app);
