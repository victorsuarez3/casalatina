/**
 * Storage Service - Casa Latina Premium
 * 
 * Handles file uploads to Firebase Storage
 * Primarily used for profile photos and event images
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Uploads a profile photo to Firebase Storage
 * 
 * @param userId - The user's UID
 * @param uri - Local URI of the image to upload
 * @returns Promise with the download URL of the uploaded image
 */
export async function uploadProfilePhoto(
  userId: string,
  uri: string
): Promise<string> {
  try {
    // Create a unique filename with timestamp to bust cache
    const timestamp = Date.now();
    const filename = `profile_${timestamp}.jpg`;
    const storageRef = ref(storage, `profiles/${userId}/${filename}`);

    // Fetch the image as blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob, {
      contentType: 'image/jpeg',
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw new Error('Failed to upload profile photo');
  }
}

/**
 * Gets the storage path for a user's profile photos
 * 
 * @param userId - The user's UID
 * @returns The storage path string
 */
export function getProfilePhotoPath(userId: string): string {
  return `profiles/${userId}`;
}

