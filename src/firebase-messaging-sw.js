import firebase from 'firebase/compat/app';
import { getMessaging } from 'firebase/messaging/sw';
import { getFirebaseConfig } from './firebase-config';

const firebaseApp = firebase.initializeApp(getFirebaseConfig());
getMessaging(firebaseApp);
console.info('Firebase messaging service worker is set up');