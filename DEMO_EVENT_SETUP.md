# Demo Event Setup for App Store/Play Store Screenshots

## Quick Start

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **casa-latina-premium-app**
3. Click ⚙️ > **Project settings** > **Service accounts** tab
4. Click **Generate new private key**
5. Save the file as `serviceAccountKey.json` in the project root

### Step 2: Create the Demo Event

```bash
export PATH="$HOME/.nvm/versions/node/v22.14.0/bin:$PATH"
node scripts/createDemoEvent.js
```

This creates a spectacular **VIP New Year Rooftop Party** event with:
- 🎨 Your party_background.webp image
- 🎉 Premium event details (VIP party, Brickell rooftop, cocktail attire)
- 👥 22 attendees showing social proof
- ⭐ Exclusive, high-energy vibe perfect for screenshots
- 📅 Scheduled for this Saturday at 8:00 PM

### Step 3: Take Your Screenshots

1. Open the app on your device/simulator
2. The demo event will appear at the top of "Upcoming Events"
3. Capture your App Store/Play Store screenshots

### Step 4: Clean Up

```bash
export PATH="$HOME/.nvm/versions/node/v22.14.0/bin:$PATH"
node scripts/deleteDemoEvent.js
```

This removes the demo event and image from Firebase.

## What the Demo Event Looks Like

**Title:** VIP New Year Rooftop Party
**Subtitle:** The most exclusive celebration in Miami
**Location:** Brickell Heights Rooftop · Brickell
**Dress Code:** Cocktail Attire / All Black
**Vibe:** Exclusive · High-Energy · Unforgettable
**Attendees:** 22 members going (28 spots remaining)

**Description:**
> Ring in the new year at Miami's most exclusive rooftop celebration. Featuring world-class DJs, premium open bar, gourmet canapés, and breathtaking 360° views of the Miami skyline. Limited to Casa Latina members only.
>
> ✨ Highlights:
> • Live DJ spinning Latin house & reggaeton
> • Premium open bar with signature cocktails
> • Gourmet passed hors d'oeuvres
> • Professional photographer
> • Stunning skyline & ocean views
> • Members-only networking

## Notes

- ✅ firebase-admin already installed
- ✅ party_background.webp verified (198KB)
- ⚠️ You need to download the serviceAccountKey.json file
- 📱 Event will be a real Firestore event (not a showcase event)
- 🗑️ Easy cleanup with deleteDemoEvent.js script
