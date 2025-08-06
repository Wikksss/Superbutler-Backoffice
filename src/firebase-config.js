/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
const config = {
    apiKey: "AIzaSyDHRnN_B-KGuHsUBUIKxjN7oSEX4S4g8rM",
    authDomain: "superbutler-7c566.firebaseapp.com",
    projectId: "superbutler-7c566",
    storageBucket: "superbutler-7c566.appspot.com",
    messagingSenderId: "477573516701",
    appId: "1:477573516701:web:3e30c1f157f1c96822b374",
    measurementId: "G-BBZ3XCDR9K"
   };

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}