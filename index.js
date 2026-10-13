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
  });
} catch (e) {
  console.warn('[FCM Background] Failed to register background handler:', e);
}

AppRegistry.registerComponent(appName, () => App);
