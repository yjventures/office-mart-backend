const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging')
require('dotenv').config();
const Notification = require('../db/push_notification');

const firebaseConfig = {
  apiKey: "AIzaSyAZT4lTG3mtFh1053ZaiaEbKTU5L5d3pa0",
  authDomain: "sonbola-main.firebaseapp.com",
  databaseURL: "https://sonbola-main-default-rtdb.firebaseio.com",
  projectId: "sonbola-main",
  storageBucket: "sonbola-main.appspot.com",
  messagingSenderId: "621701633642",
  appId: "1:621701633642:web:7c947631d6d1b7fe96dc13",
  measurementId: "G-SR35ZNCBGE"
};

initializeApp(firebaseConfig)

// initializeApp({
//   credential: applicationDefault(),
//   projectId: "sonbola-main",
//   databaseURL: "https://sonbola-main-default-rtdb.firebaseio.com",
// });

const sendMultiplePushNotification = async (user_id, message) => {
  try{
    console.log(`User id: ${user_id}`);
    console.log(`Message: ${message.body}`);
    const tokenCollections = await Notification.find({user_id});
    if (tokenCollections) {
      const tokens = tokenCollections.map((item) => {
        return item.fcm_token;
      })
      const pushMessage = {
        notification: {
          body: message.body,
          title: message.title
        },
        tokens,
      }
      const status = await getMessaging().sendMulticast(pushMessage);
      return status;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
}

const sendPushNotification = async (user_id, message, token) => {
  try{
    console.log(`User id: ${user_id}`);
    console.log(`Message: ${message.body}`);
    const pushMessage = {
      notification: {
        body: message.body,
        title: message.title
      },
      token,
    }
    const status = await getMessaging().send(pushMessage);
    return status;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  sendMultiplePushNotification,
  sendPushNotification,
};
// $env:GOOGLE_APPLICATION_CREDENTIALS="E:\Rebel Force Tech Solutions\Sonbola MVM\Sonbola-Backend\sonbola-main-firebase-adminsdk-yhc7g-9dcc6cecf6.json"
