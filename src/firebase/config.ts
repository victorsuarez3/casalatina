/**
 * Firebase Configuration
 *
 * Uses environment variables from .env file (EXPO_PUBLIC_FIREBASE_*)
 *
 * Required Firebase services:
 * - Authentication (Email/Password)
 * - Cloud Firestore
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

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
