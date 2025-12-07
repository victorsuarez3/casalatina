/**
 * Create Demo Event for App Store/Play Store Screenshots
 *
 * This script:
 * 1. Uploads party_background.webp to Firebase Storage
 * 2. Creates a spectacular demo event in Firestore
 *
 * Usage: node scripts/createDemoEvent.js
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
  const destination = 'events/demo/party_background.webp';
  await bucket.upload(imagePath, {
    destination,
    metadata: {
      contentType: 'image/webp',
      metadata: {
        uploadedAt: new Date().toISOString(),
        purpose: 'demo-event-screenshot',
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

async function createDemoEvent(imageUrl) {
  console.log('\n🎉 Creating spectacular demo event in Firestore...');

  // Create an event that's coming up soon (this Saturday)
  const now = new Date();
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
  const eventDate = new Date(now);
  eventDate.setDate(now.getDate() + daysUntilSaturday);
  eventDate.setHours(20, 0, 0, 0); // 8:00 PM

  const demoEvent = {
    // Required fields from EventDoc interface
    id: 'demo-vip-party-2025',
    title: 'VIP New Year Rooftop Party',
    subtitle: 'The most exclusive celebration in Miami',
    image: imageUrl,
    date: admin.firestore.Timestamp.fromDate(eventDate),
    location: 'Brickell Heights Rooftop',
    price: 0, // Free for members
    capacity: 50,
    attendees: [
      // Add some fake attendees to show social proof
      'demo-user-1',
      'demo-user-2',
      'demo-user-3',
      'demo-user-4',
      'demo-user-5',
      'demo-user-6',
      'demo-user-7',
      'demo-user-8',
      'demo-user-9',
      'demo-user-10',
      'demo-user-11',
      'demo-user-12',
      'demo-user-13',
      'demo-user-14',
      'demo-user-15',
      'demo-user-16',
      'demo-user-17',
      'demo-user-18',
      'demo-user-19',
      'demo-user-20',
      'demo-user-21',
      'demo-user-22',
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),

    // Showcase/Signature event fields
    isShowcase: false, // This is a REAL event, not a showcase
    neighborhood: 'Brickell',
    venueName: 'Private Penthouse · Brickell Heights',
    dressCode: 'Cocktail Attire / All Black',
    vibe: 'Exclusive · High-Energy · Unforgettable',
    priceRange: 'Complimentary for Members',

    // Legacy/optional fields
    city: 'Miami',
    type: 'VIP_PARTY',
    membersOnly: true,
    coverImageUrl: imageUrl,
    description: 'Ring in the new year at Miami\'s most exclusive rooftop celebration. Featuring world-class DJs, premium open bar, gourmet canapés, and breathtaking 360° views of the Miami skyline. Limited to Casa Latina members only.\n\n✨ Highlights:\n• Live DJ spinning Latin house & reggaeton\n• Premium open bar with signature cocktails\n• Gourmet passed hors d\'oeuvres\n• Professional photographer\n• Stunning skyline & ocean views\n• Members-only networking\n\nThis is THE event to start the year with Miami\'s most ambitious Latin professionals.',
    isActive: true,
  };

  // Save to Firestore
  await db.collection('events').doc(demoEvent.id).set(demoEvent);

  console.log('✅ Demo event created successfully!');
  console.log('\n📋 Event Details:');
  console.log(`   ID: ${demoEvent.id}`);
  console.log(`   Title: ${demoEvent.title}`);
  console.log(`   Date: ${eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })}`);
  console.log(`   Location: ${demoEvent.location} · ${demoEvent.neighborhood}`);
  console.log(`   Attendees: ${demoEvent.attendees.length}/${demoEvent.capacity}`);
  console.log(`   Spots Remaining: ${demoEvent.capacity - demoEvent.attendees.length}`);
  console.log(`   Image: ${imageUrl}`);

  return demoEvent;
}

async function main() {
  try {
    console.log('🚀 Starting demo event creation for App Store/Play Store screenshots...\n');

    // Step 1: Upload the party background image
    const imageUrl = await uploadPartyBackground();

    // Step 2: Create the demo event
    await createDemoEvent(imageUrl);

    console.log('\n✅ All done! Your demo event is ready for screenshots.');
    console.log('\n📱 Next steps:');
    console.log('   1. Open the app on your device/simulator');
    console.log('   2. The demo event will appear in the "Upcoming Events" section');
    console.log('   3. Take your screenshots for App Store/Play Store');
    console.log('\n💡 To remove the demo event, run: node scripts/deleteDemoEvent.js');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
