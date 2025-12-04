/**
 * Firebase Configuration
 * 
 * Uses environment variables from .env file (via Expo Constants)
 * 
 * Required Firebase services:
 * - Authentication (Email/Password)
 * - Cloud Firestore
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Get Firebase config from Expo Constants (injected from .env via app.config.ts)
const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
};

// Validate that all required config values are present
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error(
    'Firebase configuration is missing. Please check your .env file and ensure all EXPO_PUBLIC_FIREBASE_* variables are set.'
  );
}

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Export auth and firestore instances
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;

