# Build Automation Scripts

## 🚀 bump-build.js

Automatically increments build numbers in `app.config.ts` for both iOS and Android platforms.

### What it does:
- **iOS**: Increments `buildNumber` (string) in app.config.ts
- **Android**: Increments `versionCode` (number) in app.config.ts
- **Safety**: Only increments existing values, doesn't modify version strings
- **Smart**: Detects EAS Build vs local environment

## 🎯 Usage Methods

### Method 1: EAS Build (Recommended)
```bash
# Automatic bump + build in one command
eas build --platform ios
eas build --platform android
eas build --platform all
```
✅ **EAS Build automatically runs bump-build via postCheckout hook**

### Method 2: Local Build Scripts
```bash
# iOS only
npm run build:ios

# Android only
npm run build:android

# Both platforms
npm run build:all
```
✅ **Scripts run bump-build locally before EAS build**

### Method 3: Manual Bump
```bash
npm run bump-build
```
✅ **Only increments numbers, then commit manually**

## 📊 Example Outputs

### Local Environment:
```
🚀 Auto-incrementing build numbers locally...
📱 iOS buildNumber: 2 → 3
🤖 Android versionCode: 2 → 3
✅ Build numbers updated successfully!
📝 Don't forget to commit these changes before pushing to production
💡 Use: npm run build:ios, npm run build:android, or npm run build:all
```

### EAS Build Environment:
```
🏗️  EAS Build detected - Auto-incrementing build numbers...
📱 iOS buildNumber: 2 → 3
🤖 Android versionCode: 2 → 3
✅ Build numbers updated successfully!
🏗️  Build numbers incremented in EAS Build environment
📦 Proceeding with automated build...
```

## ⚠️ Important Notes

### For Local Builds:
- **Always commit** the build number changes before pushing
- Build numbers increment independently for each platform
- Safe to run multiple times (continues incrementing)

### For EAS Builds:
- **Automatic**: No manual intervention needed
- **postCheckout hook** runs bump-build in EAS servers
- **Changes are included** in the build automatically
- **Recommended workflow** for production builds

### Safety Features:
- Only modifies existing numeric values
- Preserves all other app.config.ts content
- Works with any current build numbers
- Reversible with `git checkout`