#!/usr/bin/env node

/**
 * Build Number Auto-Increment Script
 * Automatically increments build numbers in app.config.ts
 */

const fs = require('fs');
const path = require('path');

// Path to app.config.ts
const configPath = path.join(__dirname, '..', 'app.config.ts');

console.log('🚀 Auto-incrementing build numbers...');

try {
  // Read the current config file
  let configContent = fs.readFileSync(configPath, 'utf8');

  // Increment iOS buildNumber
  const iosBuildNumberRegex = /buildNumber:\s*["'](\d+)["']/;
  const iosMatch = configContent.match(iosBuildNumberRegex);

  if (iosMatch) {
    const currentIOSBuild = parseInt(iosMatch[1]);
    const newIOSBuild = currentIOSBuild + 1;
    configContent = configContent.replace(
      iosBuildNumberRegex,
      `buildNumber: "${newIOSBuild}"`
    );
    console.log(`📱 iOS buildNumber: ${currentIOSBuild} → ${newIOSBuild}`);
  }

  // Increment Android versionCode
  const androidVersionCodeRegex = /versionCode:\s*(\d+)/;
  const androidMatch = configContent.match(androidVersionCodeRegex);

  if (androidMatch) {
    const currentAndroidVersion = parseInt(androidMatch[1]);
    const newAndroidVersion = currentAndroidVersion + 1;
    configContent = configContent.replace(
      androidVersionCodeRegex,
      `versionCode: ${newAndroidVersion}`
    );
    console.log(`🤖 Android versionCode: ${currentAndroidVersion} → ${newAndroidVersion}`);
  }

  // Write the updated config back to file
  fs.writeFileSync(configPath, configContent, 'utf8');

  console.log('✅ Build numbers updated successfully!');
  console.log('📝 Don\'t forget to commit these changes before building.');

} catch (error) {
  console.error('❌ Error updating build numbers:', error.message);
  process.exit(1);
}
