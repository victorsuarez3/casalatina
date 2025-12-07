# Build Automation Scripts

## 🚀 bump-build.js

Automatically increments build numbers in `app.config.ts` for both iOS and Android platforms.

### What it does:
- **iOS**: Increments `buildNumber` (string) in app.config.ts
- **Android**: Increments `versionCode` (number) in app.config.ts
- **Safety**: Only increments existing values, doesn't modify version strings
- **Smart**: Detects EAS Build vs local environment

## 🎯 Usage Methods (Scripts NPM - RECOMENDADO)

### Método Principal: Scripts de Build Integrados
```bash
# iOS completo: bump + build + push
npm run build:ios

# Android completo: bump + build + push
npm run build:android

# Ambos: bump + build + push
npm run build:all
```
✅ **Flujo completo automatizado**

### Método Manual: Bump + Commit + Build
```bash
# Paso 1: Incrementar números
npm run bump-build

# Paso 2: Commit cambios
git add app.config.ts
git commit -m "build: bump to v1.0.4 (iOS: 3, Android: 3)"

# Paso 3: Build normal
eas build --platform ios
eas build --platform android
```

## 📊 Example Outputs

### Scripts Integrados (Recomendado):
```
🚀 Auto-incrementing build numbers locally...
📱 iOS buildNumber: 2 → 3
🤖 Android versionCode: 2 → 3
✅ Build numbers updated successfully!
📝 Don't forget to commit these changes before pushing to production

> eas build --platform ios
[Build process starts...]
```

### Bump Manual:
```
🚀 Auto-incrementing build numbers locally...
📱 iOS buildNumber: 2 → 3
🤖 Android versionCode: 2 → 3
✅ Build numbers updated successfully!
📝 Don't forget to commit these changes before pushing to production
💡 Use: npm run build:ios, npm run build:android, or npm run build:all
```

## ⚠️ Important Notes

### Workflows Recomendados:

#### Para Desarrollo Rápido:
```bash
npm run build:ios  # Bump + Build + Push automático
```

#### Para Producción Controlada:
```bash
npm run bump-build    # Solo incrementa
# Revisar cambios en app.config.ts
git add app.config.ts
git commit -m "build: release v1.0.4"
eas build --platform ios --profile production
```

### Safety Features:
- ✅ Only modifies existing numeric values
- ✅ Preserves all other app.config.ts content
- ✅ Works with any current build numbers
- ✅ Independent increment for iOS/Android
- ✅ Reversible with `git checkout`

### Troubleshooting:
- Si `npm run build:*` falla: Usa método manual
- Si necesitas reset: `git checkout -- app.config.ts`
- Build numbers siempre se incrementan (+1 cada vez)