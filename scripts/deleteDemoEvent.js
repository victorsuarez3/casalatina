/**
 * Delete Demo Event
 *
 * This script removes the demo event created for screenshots
 *
 * Usage: node scripts/deleteDemoEvent.js
 */

const admin = require('firebase-admin');

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

async function deleteDemoEvent() {
  console.log('🗑️  Deleting demo event...');

  const eventId = 'demo-vip-party-2025';

  // Delete from Firestore
  await db.collection('events').doc(eventId).delete();
  console.log('✅ Demo event deleted from Firestore');

  // Delete image from Storage
  try {
    const file = bucket.file('events/demo/party_background.webp');
    await file.delete();
    console.log('✅ Demo event image deleted from Storage');
  } catch (error) {
    if (error.code === 404) {
      console.log('ℹ️  Image already deleted or not found');
    } else {
      console.warn('⚠️  Could not delete image:', error.message);
    }
  }

  console.log('\n✅ Demo event cleanup complete!');
}

async function main() {
  try {
    console.log('🚀 Starting demo event cleanup...\n');
    await deleteDemoEvent();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
