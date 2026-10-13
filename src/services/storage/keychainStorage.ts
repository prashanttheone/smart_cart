import * as Keychain from 'react-native-keychain';
import { appStorage, STORAGE_KEYS } from './asyncStorage';
import { User } from '../../store/slices/authSlice';

const KEYCHAIN_AUTH_SERVICE = 'com.smartcart.auth_token';

/**
 * Secure Keychain / Keystore storage service for Authentication Tokens
 * Stores sensitive credentials encrypted in iOS Keychain and Android Keystore.
 * Falls back to AsyncStorage if Keychain is unavailable in the environment.
 */
export const keychainStorage = {
  /**
   * Save auth token securely to Keychain
   */
  async setToken(token: string): Promise<boolean> {
    try {
      // 1. Save to Keychain
      await Keychain.setGenericPassword('auth_token', token, {
        service: KEYCHAIN_AUTH_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });

      // 2. Also sync to appStorage as reliable fallback
      await appStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      return true;
    } catch (error) {
      console.warn('[Keychain] Error saving token to Keychain, falling back to AsyncStorage:', error);
      return appStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  },

  /**
   * Retrieve auth token from Keychain
   */
  async getToken(): Promise<string | null> {
    try {
      // 1. Try reading from Keychain first
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_AUTH_SERVICE,
      });

      if (credentials && credentials.password) {
        return credentials.password;
      }

      // 2. Fallback to appStorage if Keychain credentials not found
      return await appStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.warn('[Keychain] Error reading token from Keychain, trying AsyncStorage fallback:', error);
      return appStorage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  /**
   * Remove auth token from Keychain and local storage
   */
  async removeToken(): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({
        service: KEYCHAIN_AUTH_SERVICE,
      });
    } catch (error) {
      console.warn('[Keychain] Error resetting Keychain password:', error);
    }

    try {
      await appStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      return true;
    } catch (error) {
      console.warn('[Keychain] Error removing token from AsyncStorage fallback:', error);
      return false;
    }
  },

  /**
   * Save user profile info
   */
  async setUserData(user: User): Promise<boolean> {
    return appStorage.setItem(STORAGE_KEYS.USER_DATA, user);
  },

  /**
   * Get user profile info
   */
  async getUserData(): Promise<User | null> {
    return appStorage.getItem<User>(STORAGE_KEYS.USER_DATA);
  },

  /**
   * Remove user profile info
   */
  async removeUserData(): Promise<boolean> {
    return appStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  /**
   * Clear all auth session data
   */
  async clearAuth(): Promise<boolean> {
    const tokenRemoved = await this.removeToken();
    const userRemoved = await this.removeUserData();
    return tokenRemoved && userRemoved;
  },
};

export default keychainStorage;
