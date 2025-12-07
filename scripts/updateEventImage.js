/**
 * Update Event Image
 * Uploads party_background.webp and updates the VIP event
 *
 * Usage: node scripts/updateEventImage.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gotham-6fc37.firebasestorage.app',
  databaseURL: 'https://gotham-6fc37.firebaseio.com'
});

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

async function uploadPartyBackground() {
  console.log('📸 Uploading party_background.webp to Firebase Storage...');

  const imagePath = path.join(__dirname, '..', 'assets', 'backgrounds', 'party_background.webp');

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found at: ${imagePath}`);
  }

  // Upload to Firebase Storage
  const destination = 'events/vip-party/party_background.webp';
  await bucket.upload(imagePath, {
    destination,
    metadata: {
      contentType: 'image/webp',
      metadata: {
        uploadedAt: new Date().toISOString(),
        purpose: 'vip-event-image',
      },
    },
  });

  console.log('✅ Image uploaded to:', destination);

  // Make the file publicly accessible
  const file = bucket.file(destination);
  await file.makePublic();

  // Get the public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
  console.log('🌐 Public URL:', publicUrl);

  return publicUrl;
}

async function findAndUpdateVIPEvent(imageUrl) {
  console.log('\n🔍 Finding VIP New Year Rooftop Party event...');

  // Search for the event by title
  const eventsRef = db.collection('events');
  const querySnapshot = await eventsRef
    .where('title', '==', 'VIP New Year Rooftop Party')
    .limit(1)
    .get();

  if (querySnapshot.empty) {
    console.log('❌ VIP event not found. Creating it...');
    // If event doesn't exist, we could create it here
    return null;
  }

  const eventDoc = querySnapshot.docs[0];
  const eventId = eventDoc.id;

  console.log(`✅ Found event: ${eventId}`);
  console.log(`📝 Updating image...`);

  // Update the event with the new image
  await eventDoc.ref.update({
    image: imageUrl,
    coverImageUrl: imageUrl,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log('✅ Event image updated successfully!');

  return { id: eventId, ...eventDoc.data() };
}

async function main() {
  try {
    console.log('🚀 Starting event image update...\n');

    // Step 1: Upload the party background image
    const imageUrl = await uploadPartyBackground();

    // Step 2: Find and update the VIP event
    const updatedEvent = await findAndUpdateVIPEvent(imageUrl);

    if (updatedEvent) {
      console.log('\n✅ All done! Event image has been updated.');
      console.log(`\n📱 The event now uses: party_background.webp`);
      console.log(`🔗 Image URL: ${imageUrl}`);
    } else {
      console.log('\n⚠️  Event not found, but image was uploaded.');
      console.log(`\n📱 You can manually update the event with this URL:`);
      console.log(`🔗 ${imageUrl}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
