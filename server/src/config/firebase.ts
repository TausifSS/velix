import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

try {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountVar) {
    console.warn('WARNING: FIREBASE_SERVICE_ACCOUNT environment variable is not defined.');
  } else {
    const serviceAccount = JSON.parse(serviceAccountVar);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export default admin;
