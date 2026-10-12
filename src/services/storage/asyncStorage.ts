import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@smartcart/auth_token',
  USER_DATA: '@smartcart/user_data',
  CART: '@smartcart/cart_items',
  THEME_MODE: '@smartcart/theme_mode',
  RECENT_SEARCHES: '@smartcart/recent_searches',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const appStorage = {
  async getItem<T>(key: StorageKey | string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`[AsyncStorage] Error reading key "${key}":`, error);
      return null;
    }
  },

  async setItem<T>(key: StorageKey | string, value: T): Promise<boolean> {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`[AsyncStorage] Error writing key "${key}":`, error);
      return false;
    }
  },

  async removeItem(key: StorageKey | string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[AsyncStorage] Error removing key "${key}":`, error);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('[AsyncStorage] Error clearing storage:', error);
      return false;
    }
  },
};

export default appStorage;
