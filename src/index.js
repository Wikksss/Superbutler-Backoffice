import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getMessaging, getToken, isSupported } from "firebase/messaging";
//import { ConnectedRouter } from 'react-router-redux';
//import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import {registerServiceWorker} from './servicesworker';
import { firebaseConfig, firebaseVapidKey }  from './helpers/GlobalData';
// Create browser history to use in the Redux store
//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
//const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(initialState);

  if (isSupported()) {
   const firebaseApp  = firebase.initializeApp(firebaseConfig);
    const messaging = getMessaging(firebaseApp);
    
  // messaging.requestPermission().then(function() {
  //     console.log('Notification permission granted.');
  //     return messaging.getToken();
  //   }).then(function(token) {
  //     console.log('token',token)
  //   }).catch(function(err) {
  //     console.log('Unable to get permission to notify.', err);
  //   });


    // getToken(messaging, { vapidKey: firebaseVapidKey }).then((currentToken) => {
    //     if (currentToken) {
    //       console.log('current token for client: ', currentToken);
    //     } else {
    //       console.log('No registration token available. Request permission to generate one.');
    //     }
    //   }).catch((err) => {
    //     console.log('An error occurred while retrieving token. ', err);
    //   });
    
  } else {
    console.log('no-support :(')
  }

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
  //   }
  // const store = createStore(allReducer)
const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    
      <App />
   
  </Provider>,
  rootElement);

registerServiceWorker()
