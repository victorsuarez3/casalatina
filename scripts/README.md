# Build Automation Scripts

## 🚀 bump-build.js

Automatically increments build numbers in `app.config.ts` for both iOS and Android platforms.

### What it does:
- **iOS**: Increments `buildNumber` (string) in app.config.ts
- **Android**: Increments `versionCode` (number) in app.config.ts
- **Safety**: Only increments existing values, doesn't modify version strings

### Usage:

#### Manual bump:
```bash
npm run bump-build
```

#### Build with automatic bump:
```bash
# iOS only
npm run build:ios

# Android only
npm run build:android

# Both platforms
npm run build:all
```

### Example Output:
```
🚀 Auto-incrementing build numbers...
📱 iOS buildNumber: 2 → 3
🤖 Android versionCode: 2 → 3
✅ Build numbers updated successfully!
📝 Don't forget to commit these changes before building.
```

### Important Notes:
- **Always commit** the build number changes before pushing to production
- The script modifies `app.config.ts` directly
- Build numbers increment independently for each platform
- Safe to run multiple times (will continue incrementing)

### Integration with EAS Build:
The `build:*` scripts automatically run `bump-build` before calling `eas build`, ensuring your build numbers are always up to date.