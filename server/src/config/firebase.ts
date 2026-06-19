import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let isFirebaseAdminReady = false;

try {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountVar) {
    console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT environment variable is not defined.');
  } else {
    const serviceAccount = JSON.parse(serviceAccountVar);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    isFirebaseAdminReady = true;
    console.log('Firebase Admin SDK initialized successfully.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export { isFirebaseAdminReady };
export default admin;
