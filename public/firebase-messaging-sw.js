// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


//   const firebaseConfig = {

//   apiKey: "AIzaSyDHRnN_B-KGuHsUBUIKxjN7oSEX4S4g8rM",
//   authDomain: "superbutler-7c566.firebaseapp.com",
//   projectId: "superbutler-7c566",
//   storageBucket: "superbutler-7c566.appspot.com",
//   messagingSenderId: "477573516701",
//   appId: "1:477573516701:web:3e30c1f157f1c96822b374",
//   measurementId: "G-BBZ3XCDR9K"
//  };
 

//  const app = firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// self.addEventListener('notificationclick', function(event) {
//   console.log('[firebase-messaging-sw.js] Received notificationclick event ', event);
  
//   var click_action = event.notification.data;
//   event.notification.close();
  
//   event.waitUntil(clients.matchAll({
//       type: "window"
//   }).then(function(clientList) {
//       for (var i = 0; i < clientList.length; i++) {
//           var client = clientList[i];
//           if (client.url == click_action  && 'focus' in client)
//               return client.focus();
//       }
//       if (clients.openWindow)
//           return clients.openWindow(click_action);
//       }));
  
//   });


  
//   const showMessage = function(payload){
//       console.log('showMessage', payload);
//       const notificationTitle = payload.data.title;
//       const notificationOptions = {
//           body: payload.data.body,
//           icon: payload.data.icon,
//           image: payload.data.image,
//           click_action: payload.data.click_action,
//           data:payload.data.click_action
      
//     }
  
  
//     return self.registration.showNotification(notificationTitle,notificationOptions); 
//   }   
//   messaging.onBackgroundMessage(showMessage);
  
//   self.addEventListener('message', function (evt) {     
//     console.log("self",self);
//     showMessage( evt.data );
//   })


// // }

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = firebaseConfig = {
    apiKey: "AIzaSyDHRnN_B-KGuHsUBUIKxjN7oSEX4S4g8rM",
    authDomain: "superbutler-7c566.firebaseapp.com",
    projectId: "superbutler-7c566",
    storageBucket: "superbutler-7c566.appspot.com",
    messagingSenderId: "477573516701",
    appId: "1:477573516701:web:3e30c1f157f1c96822b374",
    measurementId: "G-BBZ3XCDR9K"
   };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//    console.log('Received background message', payload);

//   const notificationTitle = payload.Notification.Title;
//   const notificationOptions = {
//     body: payload.Notification.Body,
//     icon: payload.Notification.Icon,
//     image: payload.Notification.Image,
//     OrderToken: "z9odzji4",
//     // click_action: payload.data.click_action,
//     // data:payload.data.click_action
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });


messaging.onBackgroundMessage(async function(payload) {

  // ✅ Extract Order Token from notification payload
  const orderToken = payload.data?.OrderToken;
  if (!orderToken) {
    //   console.error("❌ Order Token not found in payload!");
      return;
  }

//   console.log(`🔹 Order Token Received: ${orderToken}`);
  var PrinterNameCsv = "";
  // ✅ Send Order Token to .NET Backend for Auto-Printing
  try {
    await fetch("http://localhost:5000/api/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ OrderToken: orderToken })
    });
  } catch (error) {
  
    try {
      await fetch("http://localhost:5055/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ OrderToken: orderToken })
      });
    } catch (fallbackError) {
      console.log("Both ports failed:", fallbackError);
    }
  }

  // ✅ Display Notification
  const notificationTitle = payload.notification?.title || "New Order Received";
  const notificationOptions = {
      body: payload.notification?.body || "A new order has arrived!",
      icon: payload.notification?.icon || "",
      image: payload.notification?.image || "",
  };


  if(notificationOptions.icon){
    self.registration.showNotification(notificationTitle, notificationOptions);
  }

});