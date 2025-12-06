/**
 * Authentication Service
 * Firebase Auth operations for signup and login
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserDoc, MembershipStatus } from '../models/firestore';

/**
 * Sign up a new user with email and password
 * Creates Firebase Auth user and Firestore user document
 */
export const signUp = async (
  email: string,
  password: string,
  fullName: string
): Promise<FirebaseUser> => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create Firestore user document
    const userDoc: Omit<UserDoc, 'createdAt'> & { createdAt: any } = {
      fullName,
      email,
      membershipStatus: 'not_applied' as MembershipStatus,
      role: 'member',
      createdAt: serverTimestamp(),
    };

    const userRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userRef, userDoc);

    return firebaseUser;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error;
  }
};



