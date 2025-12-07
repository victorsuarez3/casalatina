# Debugging Production Crashes (TestFlight/App Store)

## Recent Fixes Applied

### 1. Error Boundary
- Added global `ErrorBoundary` component to catch JavaScript errors
- Prevents complete app crashes and shows user-friendly error message
- Location: `src/components/ErrorBoundary.tsx`

### 2. Image Loading Safety (ALL SCREENS)
- **All screens** with background images now handle loading failures gracefully
- Falls back to solid background if image fails to load
- No more crashes from missing or corrupted assets
- **Updated screens:**
  - `ApplicationFormScreen` (Auth flow)
  - `LoginScreen` (Auth flow)
  - `RegisterScreen` (Auth flow)
  - `PendingApprovalScreen` (Auth flow)
  - `ApplicationReviewScreen` (Main app)
  - `InviteScreen` (Main app)
  - `SettingsScreen` (Main app)

### 3. Loading Timeout Protection
- `AuthProvider` now has a 10-second timeout to prevent infinite loading
- If user document doesn't load, creates a fallback state
- User will see the application form instead of being stuck

### 4. Enhanced Error Logging
- Added console logs throughout navigation flow
- Logs show which screen the app is trying to render
- Check logs to see where crashes occur

## How to Debug TestFlight Crashes

### Option 1: Using Console.app (macOS)
1. Connect your iOS device to your Mac
2. Open Console.app (in /Applications/Utilities/)
3. Select your device in the sidebar
4. Start the app on your device
5. Watch the console output in real-time
6. Look for logs starting with `[App]`, `[AuthProvider]`, etc.

### Option 2: Using Xcode Device Logs
1. Connect your iOS device to your Mac
2. Open Xcode
3. Go to Window > Devices and Simulators
4. Select your device
5. Click "Open Console" button
6. Launch the app and watch the logs

### Option 3: TestFlight Crash Reports
1. Open App Store Connect
2. Go to TestFlight > Builds
3. Select your build
4. Click on "Crashes" tab
5. Download crash logs to analyze

## Common Issues and Solutions

### Issue: App crashes after account creation
**Solution:**
- The app now creates a fallback user document if Firestore fails
- ErrorBoundary catches crashes and shows error screen
- Check AuthProvider timeout (10 seconds) is sufficient for your network

### Issue: App crashes on login
**Solution:**
- Same as above - enhanced error handling in AuthProvider
- ApplicationFormScreen now safely handles asset loading

### Issue: Blank screen or infinite loading
**Solution:**
- Loading timeout now triggers after 10 seconds
- User will see application form with fallback state
- Check Firebase connection and rules

## What to Check if Crashes Still Occur

1. **Firebase Configuration**
   - Verify app.config.ts has correct Firebase credentials
   - Check that Firestore database name is correct: `casa-latina-premium-app`
   - Ensure storage rules are deployed

2. **Assets**
   - Verify all font files exist in `assets/fonts/`
   - Check background image exists: `assets/backgrounds/official-background.jpeg`

3. **Network Connection**
   - App requires internet for Firebase operations
   - Poor connection may cause timeouts (increased to 10s)

4. **Device Logs**
   - Look for error messages starting with `[App]`, `[AuthProvider]`
   - Check for JavaScript errors in console

## Testing the Fixes

### Test Case 1: Create Account
1. Launch app
2. Create new account with email/password
3. **Expected:** App should load application form within 10 seconds
4. **If it fails:** Check console for timeout message

### Test Case 2: Login with Existing Account
1. Launch app
2. Login with existing credentials
3. **Expected:** App routes based on membership status
4. **If it fails:** ErrorBoundary shows error screen

### Test Case 3: Poor Network
1. Enable Airplane Mode
2. Launch app
3. Disable Airplane Mode after 2 seconds
4. **Expected:** App recovers and loads within 10 seconds

## Error Messages to Look For

```
[App] Routing user with status: not_applied
[App] Navigating to ApplicationStartScreen
```
Good - app is routing correctly

```
Loading timeout - creating fallback user document
```
Warning - Firestore is slow, but app will continue with fallback

```
ErrorBoundary caught an error: [error details]
```
Error - JavaScript exception occurred but app didn't crash

## Next Steps if Issues Persist

1. Share device logs from Console.app or Xcode
2. Check Firebase Console for database errors
3. Verify network connectivity during crash
4. Test with different iOS versions
5. Try force-closing and reopening the app
