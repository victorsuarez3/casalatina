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
    premiumLounge: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=90',
  },

  // Add other centralized assets here as needed
  // icons: {},
  // illustrations: {},
} as const;

// Type-safe access to asset URLs
export type AssetCategory = keyof typeof ASSETS;
export type BackgroundAsset = keyof typeof ASSETS.backgrounds;
