import admin from "firebase-admin";
import firebaseConfig from "../../firebase-applet-config.json";

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
    // Note: In local development with Firebase Emulators or if running 
    // in GAE/Cloud Run, this often works without explicit credentials 
    // if using the default service account.
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
