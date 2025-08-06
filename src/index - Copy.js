import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import firebase from 'firebase';
//import { getAnalytics } from "firebase/analytics";
//import { ConnectedRouter } from 'react-router-redux';
//import { createBrowserHistory } from 'history';

import configureStore from './store/configureStore';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import { getFirebaseConfig } from './firebase-config';
import {registerServiceWorker} from './servicesworker';
import firebase from 'firebase/compat/app';
import { getMessaging, getToken, onMessage} from 'firebase/messaging'; 

// Create browser history to use in the Redux store
//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
//const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(initialState);

  
  const app = firebase.initializeApp(getFirebaseConfig());
   requestNotificationsPermissions();
  //const messaging = getMessaging(app);
 
  async function saveMessagingDeviceToken() {
    try {
      const currentToken = await getToken(getMessaging(app));
      if (currentToken) {
        // console.log('Got FCM device token:', currentToken);
        // Saving the Device Token to Cloud Firestore.
        //const tokenRef = doc(getFirestore(), 'fcmTokens', currentToken);
        //await setDoc(tokenRef, { uid: getAuth().currentUser.uid });
  
        // This will fire when a message is received while the app is in the foreground.
        // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
        onMessage(getMessaging(), (message) => {
          // console.log(
          //   'New foreground notification from Firebase Messaging!',
          //   message.notification
          // );
        });
      } else {
        // Need to request permissions to show notifications.
        requestNotificationsPermissions();
      }
    } catch(error) {
      console.error('Unable to get messaging token.', error);
    };
  }
 
  async function requestNotificationsPermissions() {
    // console.log('Requesting notifications permission...');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // console.log('Notification permission granted.');
      // Notification permission granted.
      await saveMessagingDeviceToken();
    } else {
      // console.log('Unable to get permission to notify.');
    }
  }
 


  // var tok= FirebaseNotification.requestNotificationsPermissions();
  
  
  
  
  /*if(isSupported()){
    try {
    
      console.log("messaging",messaging);
      
          messaging.requestPermission().then(function() {


            console.log('Notification permission granted.');
            return getToken(); 
    }).then(function(token) {
      console.log('token',token)
    }).catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
     } catch (error) {
          console.error(error);
     }
  }*/
  
  
  //const messaging = getMessaging(app);
  //console.log("messaging",messaging);





  /*export const askForPermissionToReceiveNotifications = async () => {
    try {
    
  console.log("messaging",messaging);
      await messaging.requestPermission();
      const token = await messaging.getToken();
      console.log('Your token is:', token);
      
      return token;
    } catch (error) {
      console.error(error);
    }
  }*/


  //if (messaging.isSupported()) {
    //firebase.initializeApp(firebaseConfig);
    //getAnalytics(firebase);
    


/*

  messaging.requestPermission()
      console.log('Notification permission granted.');
      return messaging.getToken();
    }).then(function(token) {
      console.log('token',token)
    }).catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
  //} 
  //else {
  //  console.log('no-support :(')
 // }
  
*/
 
  
  //  const messaging = firebase.messaging();
  //  console.log("messaging",messaging);
  // let token = messaging.getToken();
  // console.log("token",token);
  // if('serviceWorker' in navigator) { 
  //   navigator.serviceWorker.register('../firebase-messaging-sw.js')
  // .then(function(registration) {
  //  console.log("Service Worker Registered");
  // messaging.useServiceWorker(registration);  
  //   }); 
  //  }
  // const store = createStore(allReducer)
const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    
      <App />
   
  </Provider>,
  rootElement);

registerServiceWorker()
