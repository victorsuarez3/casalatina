/**
 * Firebase Configuration
 * 
 * IMPORTANT: Replace the placeholder values below with your actual Firebase project credentials.
 * 
 * To get your Firebase config:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select an existing one
 * 3. Go to Project Settings > General
 * 4. Scroll down to "Your apps" section
 * 5. Click on the Web app icon (</>) to add a web app
 * 6. Copy the firebaseConfig object values
 * 7. Replace the TODO_REPLACE values below
 * 
 * Required Firebase services:
 * - Authentication (Email/Password)
 * - Cloud Firestore
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBPyqFGEdXR9AlBnEP7hxTxg30l3UvpieY",
  authDomain: "gotham-6fc37.firebaseapp.com",
  projectId: "gotham-6fc37",
  storageBucket: "gotham-6fc37.firebasestorage.app",
  messagingSenderId: "1013997283624",
  appId: "1:1013997283624:web:b30b2e7c806cc00f74481d",
};

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

