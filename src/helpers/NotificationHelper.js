import  { getMessaging, isSupported, getToken, onMessage  } from "firebase/messaging";

export let RegisterDevice = ()=>{

return '';

}

/*

export let SaveMessagingDeviceToken =  () => {
    try {
    
    const currentToken = getToken(getMessaging());
      console.log('1');
      if (currentToken) {
        console.log('Got FCM device token:', currentToken);
        // Saving the Device Token to Cloud Firestore.
        //const tokenRef = doc(getFirestore(), 'fcmTokens', currentToken);
        //await setDoc(tokenRef, { uid: getAuth().currentUser.uid });
  
        // This will fire when a message is received while the app is in the foreground.
        // When the app is in the background, firebase-messaging-sw.js will receive the message instead.
        
        onMessage(getMessaging(), (message) => {
          console.log(
            'New foreground notification from Firebase Messaging!',
            message.notification
          );
        });
        return currentToken;
      } else {
        console.log('No Token.' + currentToken);
        // Need to request permissions to show notifications.
        requestNotificationsPermissions();
      }
    } catch(error) {
      console.error('Unable to get messaging token.', error);
    };
  }

  async function  requestNotificationsPermissions () {
    console.log('Requesting notifications permission...');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Notification permission granted.
      return await SaveMessagingDeviceToken();
    } else {
      console.log('Unable to get permission to notify.');
      return 
    }
  }
*/