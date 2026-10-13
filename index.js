/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Register Firebase background message handler (executes when app is in background or quit state)
try {
  const messaging = getMessaging();
  setBackgroundMessageHandler(messaging, async (remoteMessage) => {
    console.log('[FCM Background] Notification received in background/quit state:', remoteMessage);
    // If received as a data-only payload (no remoteMessage.notification), display via Notifee
    if (!remoteMessage.notification && remoteMessage.data) {
      try {
        const { notificationService } = require('./src/services/firebase/notificationService');
        await notificationService.displayPushNotification(remoteMessage);
      } catch (err) {
        console.warn('[FCM Background] Error displaying background notification:', err);
      }
    }
  });
} catch (e) {
  console.warn('[FCM Background] Failed to register background handler:', e);
}

// Register Notifee background event handler (for notification clicks while app is in background)
try {
  const notifee = require('@notifee/react-native').default;
  const { EventType } = require('@notifee/react-native');
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('[Notifee Background] User tapped push notification:', detail.notification);
    }
  });
} catch (e) {
  console.warn('[Notifee Background] Failed to register background event handler:', e);
}

AppRegistry.registerComponent(appName, () => App);
