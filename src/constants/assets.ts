/**
 * Centralized Asset Constants
 *
 * Manages all external images, backgrounds, and static assets used throughout the app.
 * Centralizing these makes it easier to update, maintain, and potentially migrate
 * to local assets in the future.
 */

export const ASSETS = {
  // Background Images
  backgrounds: {
    // Premium lounge/social background - warm, sophisticated atmosphere
    premiumLounge: require('../../assets/backgrounds/party_background.webp'),
  },

  // Add other centralized assets here as needed
  // icons: {},
  // illustrations: {},
} as const;

// Type-safe access to asset modules
export type AssetCategory = keyof typeof ASSETS;
export type BackgroundAsset = keyof typeof ASSETS.backgrounds;
