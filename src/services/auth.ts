/**
 * Authentication Service
 * Firebase Auth operations for signup and login
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser as firebaseDeleteUser,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';
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

/**
 * Delete user account completely
 * Removes user data from Firestore, Storage, and Firebase Auth
 *
 * @param user - The Firebase user to delete
 * @throws Error if deletion fails
 */
export const deleteAccount = async (user: FirebaseUser): Promise<void> => {
  if (!user) {
    throw new Error('No user provided for deletion');
  }

  try {
    const userId = user.uid;

    // 1. Delete all user photos from Storage
    try {
      const userPhotosRef = ref(storage, `profiles/${userId}`);
      const photosList = await listAll(userPhotosRef);

      // Delete all files in the user's profile folder
      const deletePromises = photosList.items.map(item => deleteObject(item));
      await Promise.all(deletePromises);
    } catch (storageError: any) {
      // Continue even if storage deletion fails (folder might not exist)
      if (storageError?.code !== 'storage/object-not-found') {
        console.warn('Could not delete user photos:', storageError?.message);
      }
    }

    // 2. Delete Firestore user document
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef);

    // 3. Delete Firebase Auth account (must be last)
    await firebaseDeleteUser(user);

  } catch (error: any) {
    console.error('Error deleting account:', error);
    throw new Error(
      error?.code === 'auth/requires-recent-login'
        ? 'For security reasons, please log out and log back in before deleting your account.'
        : 'Failed to delete account. Please try again or contact support.'
    );
  }
};
