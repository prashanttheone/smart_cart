import { Platform, PermissionsAndroid } from 'react-native';
import {
  getMessaging,
  requestPermission,
  hasPermission,
  getToken,
  deleteToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  getInitialNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  AuthorizationStatus,
  type RemoteMessage,
} from '@react-native-firebase/messaging';
import { appStorage } from '../storage/asyncStorage';
import { api } from '../api/apiClient';
import { ENDPOINTS } from '../../app/lib/EndPoint';
import { getDeviceInfo } from '../../utils/deviceInfo';

const FCM_TOKEN_STORAGE_KEY = '@smartcart/fcm_token';
const NOTIFICATIONS_ENABLED_KEY = '@smartcart/notifications_enabled';

export interface PermissionStatusResult {
  granted: boolean;
  status: 'authorized' | 'provisional' | 'denied' | 'not_determined' | 'error';
  token?: string | null;
}

function getMessagingInstance() {
  try {
    return getMessaging();
  } catch (error) {
    console.warn('[NotificationService] getMessaging failed:', error);
    return null;
  }
}

/**
 * Service for managing Firebase Push Notifications (FCM)
 * Handles Android 13+ runtime permissions, iOS APNs authorization,
 * FCM token registration, foreground alerts, and background messages.
 */
export const notificationService = {
  /**
   * Request Push Notification permission across Android and iOS
   */
  async requestPermission(): Promise<PermissionStatusResult> {
    try {
      // 1. Android 13+ (API 33+) explicit runtime notification permission
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Push Notification Permission',
            message: 'SmartCart would like to send you delivery updates, exclusive discounts, and order notifications.',
            buttonPositive: 'Allow',
            buttonNegative: 'Not Now',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          await appStorage.setItem(NOTIFICATIONS_ENABLED_KEY, false);
          return { granted: false, status: 'denied' };
        }
      }

      // 2. Request permission through Firebase Messaging (handles iOS and Android FCM status)
      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) {
        return { granted: false, status: 'error' };
      }

      const authStatus = await requestPermission(messagingInstance, {
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        provisional: false,
        sound: true,
      });

      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        await appStorage.setItem(NOTIFICATIONS_ENABLED_KEY, true);
        const token = await this.getFCMToken();
        // Subscribe to general announcement topic by default
        await this.subscribeToTopic('promotions');
        return {
          granted: true,
          status: authStatus === AuthorizationStatus.AUTHORIZED ? 'authorized' : 'provisional',
          token,
        };
      } else {
        await appStorage.setItem(NOTIFICATIONS_ENABLED_KEY, false);
        return { granted: false, status: 'denied' };
      }
    } catch (error) {
      console.warn('[NotificationService] Error requesting notification permission:', error);
      return { granted: false, status: 'error' };
    }
  },

  /**
   * Check if push notification permission is currently granted
   */
  async checkPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const hasAndroidPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (!hasAndroidPermission) return false;
      }

      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) return false;

      const authStatus = await hasPermission(messagingInstance);
      return (
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.warn('[NotificationService] Error checking permission:', error);
      return false;
    }
  },

  /**
   * Retrieve and persist FCM device registration token
   */
  async getFCMToken(): Promise<string | null> {
    try {
      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) return null;

      const token = await getToken(messagingInstance);
      if (token) {
        await appStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        console.log('[NotificationService] FCM Token registered:', token);
        return token;
      }
      return null;
    } catch (error) {
      console.warn('[NotificationService] Error getting FCM token:', error);
      return null;
    }
  },

  /**
   * Retrieve cached FCM token from local storage
   */
  async getStoredToken(): Promise<string | null> {
    try {
      return await appStorage.getItem<string>(FCM_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Retrieve fresh FCM token from Firebase, falling back to local storage
   */
  async getStoredOrFreshToken(): Promise<string | null> {
    try {
      const freshToken = await this.getFCMToken();
      if (freshToken) {
        return freshToken;
      }
    } catch (e) {
      console.warn('[NotificationService] Failed to retrieve fresh token, checking local cache:', e);
    }
    return await this.getStoredToken();
  },

  /**
   * Synchronize FCM token and device metadata with backend server
   */
  async syncTokenWithServer(token?: string | null): Promise<boolean> {
    try {
      const activeToken = token || (await this.getStoredOrFreshToken());
      if (!activeToken) return false;

      const fcmUrl = ENDPOINTS.AUTH.buildUrl(ENDPOINTS.AUTH.FCM_TOKEN);
      const deviceInfo = getDeviceInfo();
      const platform = Platform.OS;

      await api.post(fcmUrl, {
        fcm_token: activeToken,
        fcmToken: activeToken,
        platform,
        device_info: deviceInfo,
        deviceInfo: deviceInfo,
      });
      console.log('[NotificationService] Synced FCM token with backend server successfully');
      return true;
    } catch (error) {
      console.warn('[NotificationService] Error syncing FCM token with server:', error);
      return false;
    }
  },

  /**
   * Unregister FCM token from backend server
   */
  async unregisterTokenFromServer(tokenToRemove?: string | null): Promise<boolean> {
    try {
      const activeToken = tokenToRemove || (await this.getStoredToken());
      if (!activeToken) return false;

      const fcmUrl = ENDPOINTS.AUTH.buildUrl(ENDPOINTS.AUTH.FCM_TOKEN);
      await api.delete(fcmUrl, {
        data: {
          fcm_token: activeToken,
          fcmToken: activeToken,
        },
      });
      console.log('[NotificationService] Unregistered FCM token from server successfully');
      return true;
    } catch (error) {
      console.warn('[NotificationService] Error unregistering FCM token from server:', error);
      return false;
    }
  },

  /**
   * Listen for token refresh events and update storage
   */
  onTokenRefresh(callback?: (token: string) => void): () => void {
    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) return () => {};

    return onTokenRefresh(messagingInstance, async (newToken: string) => {
      console.log('[NotificationService] FCM Token refreshed:', newToken);
      await appStorage.setItem(FCM_TOKEN_STORAGE_KEY, newToken);
      // Attempt to sync refreshed token with backend server
      this.syncTokenWithServer(newToken).catch(() => {});
      if (callback) callback(newToken);
    });
  },

  /**
   * Setup listener for foreground notifications (when app is open and visible)
   */
  onForegroundMessage(
    handler: (message: RemoteMessage) => void
  ): () => void {
    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) return () => {};

    return onMessage(messagingInstance, async (remoteMessage: RemoteMessage) => {
      console.log('[NotificationService] Foreground notification received:', remoteMessage);
      handler(remoteMessage);
    });
  },

  /**
   * Setup listener for notifications tapped while app was in background
   */
  onNotificationOpenedApp(
    handler: (message: RemoteMessage) => void
  ): () => void {
    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) return () => {};

    return onNotificationOpenedApp(messagingInstance, (remoteMessage: RemoteMessage) => {
      console.log('[NotificationService] Notification opened from background:', remoteMessage);
      handler(remoteMessage);
    });
  },

  /**
   * Check if app was launched from a quit state by tapping a notification
   */
  async getInitialNotification(): Promise<RemoteMessage | null> {
    try {
      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) return null;

      const initialMessage = await getInitialNotification(messagingInstance);
      if (initialMessage) {
        console.log('[NotificationService] App opened from quit state via notification:', initialMessage);
        return initialMessage;
      }
      return null;
    } catch (error) {
      console.warn('[NotificationService] Error reading initial notification:', error);
      return null;
    }
  },

  /**
   * Subscribe to notification topic (e.g. "promotions", "orders")
   */
  async subscribeToTopic(topic: string): Promise<boolean> {
    try {
      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) return false;

      await subscribeToTopic(messagingInstance, topic);
      console.log(`[NotificationService] Subscribed to topic: ${topic}`);
      return true;
    } catch (error) {
      console.warn(`[NotificationService] Error subscribing to topic ${topic}:`, error);
      return false;
    }
  },

  /**
   * Unsubscribe from notification topic
   */
  async unsubscribeFromTopic(topic: string): Promise<boolean> {
    try {
      const messagingInstance = getMessagingInstance();
      if (!messagingInstance) return false;

      await unsubscribeFromTopic(messagingInstance, topic);
      console.log(`[NotificationService] Unsubscribed from topic: ${topic}`);
      return true;
    } catch (error) {
      console.warn(`[NotificationService] Error unsubscribing from topic ${topic}:`, error);
      return false;
    }
  },

  /**
   * Delete FCM token (e.g. on account logout)
   */
  async deleteToken(): Promise<boolean> {
    try {
      const currentToken = await this.getStoredToken();
      if (currentToken) {
        await this.unregisterTokenFromServer(currentToken).catch(() => {});
      }
      const messagingInstance = getMessagingInstance();
      if (messagingInstance) {
        await deleteToken(messagingInstance);
      }
      await appStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
      console.log('[NotificationService] FCM token deleted');
      return true;
    } catch (error) {
      console.warn('[NotificationService] Error deleting token:', error);
      return false;
    }
  },

  /**
   * Check if user notification preference is enabled (from storage & system)
   */
  async isNotificationPreferenceEnabled(): Promise<boolean> {
    try {
      const stored = await appStorage.getItem<boolean>(NOTIFICATIONS_ENABLED_KEY);
      if (stored !== null && stored !== undefined) {
        return stored;
      }
      return await this.checkPermission();
    } catch {
      return false;
    }
  },

  /**
   * Set user push notification preference and handle topic subscription
   */
  async setNotificationPreference(enabled: boolean): Promise<boolean> {
    try {
      await appStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled);
      if (!enabled) {
        await this.unsubscribeFromTopic('promotions');
      } else {
        await this.subscribeToTopic('promotions');
      }
      return true;
    } catch (error) {
      console.warn('[NotificationService] Error setting notification preference:', error);
      return false;
    }
  },
};

export default notificationService;
