# Firebase Admin Scripts

This directory contains Firebase Admin SDK scripts for managing demo data and screenshots.

## Setup

### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **casa-latina-premium-app**
3. Click the gear icon ⚙️ > **Project settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. Save the downloaded JSON file as `serviceAccountKey.json` in the root of your project

```bash
# The file should be at:
/Users/victorsuarez/Projects/casalatina/serviceAccountKey.json
```

⚠️ **IMPORTANT**: Never commit this file to Git! It's already in `.gitignore`.

### 2. Install Dependencies

```bash
npm install firebase-admin
```

## Scripts

### Create Demo Event for Screenshots

Creates a spectacular VIP party event with the `party_background.webp` image. Perfect for App Store and Play Store screenshots.

```bash
node scripts/createDemoEvent.js
```

**What it does:**
- Uploads `assets/backgrounds/party_background.webp` to Firebase Storage
- Creates a demo event with:
  - Title: "VIP New Year Rooftop Party"
  - Location: Brickell Heights Rooftop
  - 22 attendees (shows social proof)
  - 28 spots remaining
  - High-energy party vibe
  - Premium description and details

**Output:**
The event will appear in your app's "Upcoming Events" section, ready for screenshots!

### Delete Demo Event

Removes the demo event and its image after you're done with screenshots.

```bash
node scripts/deleteDemoEvent.js
```

**What it does:**
- Deletes the demo event from Firestore
- Deletes the uploaded image from Firebase Storage
- Cleans up all demo data

## Workflow for Screenshots

1. **Create the demo event:**
   ```bash
   node scripts/createDemoEvent.js
   ```

2. **Take your screenshots:**
   - Open the app on your device/simulator
   - The spectacular event will appear first
   - Capture screenshots for App Store/Play Store

3. **Clean up when done:**
   ```bash
   node scripts/deleteDemoEvent.js
   ```

## Troubleshooting

### "serviceAccountKey.json not found"

Make sure you've downloaded the Firebase service account key and placed it in the project root:

```bash
/Users/victorsuarez/Projects/casalatina/serviceAccountKey.json
```

### "Permission denied" errors

Check that your service account has the following roles:
- Firebase Admin SDK Administrator Service Agent
- Cloud Datastore User
- Storage Object Admin

You can verify/add these in:
Firebase Console > Project Settings > Service Accounts > Manage permissions

### Image not uploading

Verify the image exists:
```bash
ls -la assets/backgrounds/party_background.webp
```

## Notes

- The demo event is set to "this Saturday at 8:00 PM" so it always appears as upcoming
- The event has 22 attendees to show social proof
- The event is members-only with a premium, exclusive vibe
- Perfect for showcasing the app's luxury brand in screenshots
