/* eslint-env jest */
require('react-native-gesture-handler/jestSetup');

try {
  const { createJSReanimatedModule } = require('react-native-reanimated/src/ReanimatedModule/js-reanimated/JSReanimated');
  const instance = createJSReanimatedModule();
  const proto = Object.getPrototypeOf(instance);
  if (proto) {
    proto.setCSSEventHandler = () => {};
  }
} catch {}

jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    setItem: jest.fn(async (key, value) => {
      store[key] = value;
      return null;
    }),
    getItem: jest.fn(async (key) => store[key] || null),
    removeItem: jest.fn(async (key) => {
      delete store[key];
      return null;
    }),
    clear: jest.fn(async () => {
      store = {};
      return null;
    }),
    getAllKeys: jest.fn(async () => Object.keys(store)),
  };
});

jest.mock('@react-native-firebase/messaging', () => {
  const messagingMock = () => ({
    requestPermission: jest.fn().mockResolvedValue(1),
    hasPermission: jest.fn().mockResolvedValue(1),
    getToken: jest.fn().mockResolvedValue('mock-fcm-token'),
    deleteToken: jest.fn().mockResolvedValue(undefined),
    onTokenRefresh: jest.fn().mockReturnValue(jest.fn()),
    onMessage: jest.fn().mockReturnValue(jest.fn()),
    onNotificationOpenedApp: jest.fn().mockReturnValue(jest.fn()),
    getInitialNotification: jest.fn().mockResolvedValue(null),
    subscribeToTopic: jest.fn().mockResolvedValue(undefined),
    unsubscribeFromTopic: jest.fn().mockResolvedValue(undefined),
    setBackgroundMessageHandler: jest.fn(),
  });
  messagingMock.AuthorizationStatus = {
    NOT_DETERMINED: -1,
    DENIED: 0,
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  };
  return {
    __esModule: true,
    default: messagingMock,
    getMessaging: jest.fn(() => ({})),
    requestPermission: jest.fn().mockResolvedValue(1),
    hasPermission: jest.fn().mockResolvedValue(1),
    getToken: jest.fn().mockResolvedValue('mock-fcm-token'),
    deleteToken: jest.fn().mockResolvedValue(undefined),
    onTokenRefresh: jest.fn().mockReturnValue(jest.fn()),
    onMessage: jest.fn().mockReturnValue(jest.fn()),
    onNotificationOpenedApp: jest.fn().mockReturnValue(jest.fn()),
    getInitialNotification: jest.fn().mockResolvedValue(null),
    subscribeToTopic: jest.fn().mockResolvedValue(undefined),
    unsubscribeFromTopic: jest.fn().mockResolvedValue(undefined),
    AuthorizationStatus: {
      NOT_DETERMINED: -1,
      DENIED: 0,
      AUTHORIZED: 1,
      PROVISIONAL: 2,
    },
  };
});

jest.mock('@react-native-firebase/analytics', () => {
  const analyticsMock = () => ({
    logEvent: jest.fn().mockResolvedValue(undefined),
    setUserId: jest.fn().mockResolvedValue(undefined),
    setUserProperty: jest.fn().mockResolvedValue(undefined),
    logScreenView: jest.fn().mockResolvedValue(undefined),
    logLogin: jest.fn().mockResolvedValue(undefined),
    logSignUp: jest.fn().mockResolvedValue(undefined),
  });
  return {
    __esModule: true,
    default: analyticsMock,
    getAnalytics: jest.fn(() => ({})),
    logEvent: jest.fn().mockResolvedValue(undefined),
    setUserId: jest.fn().mockResolvedValue(undefined),
    setUserProperty: jest.fn().mockResolvedValue(undefined),
    logScreenView: jest.fn().mockResolvedValue(undefined),
    logLogin: jest.fn().mockResolvedValue(undefined),
    logSignUp: jest.fn().mockResolvedValue(undefined),
  };
});

jest.mock('@notifee/react-native', () => {
  return {
    __esModule: true,
    default: {
      createChannel: jest.fn().mockResolvedValue('smartcart_default_channel'),
      displayNotification: jest.fn().mockResolvedValue('mock-notification-id'),
      cancelNotification: jest.fn().mockResolvedValue(undefined),
      cancelAllNotifications: jest.fn().mockResolvedValue(undefined),
      getInitialNotification: jest.fn().mockResolvedValue(null),
      onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
      onBackgroundEvent: jest.fn(),
      requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
    },
    createChannel: jest.fn().mockResolvedValue('smartcart_default_channel'),
    displayNotification: jest.fn().mockResolvedValue('mock-notification-id'),
    cancelNotification: jest.fn().mockResolvedValue(undefined),
    cancelAllNotifications: jest.fn().mockResolvedValue(undefined),
    getInitialNotification: jest.fn().mockResolvedValue(null),
    onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
    onBackgroundEvent: jest.fn(),
    requestPermission: jest.fn().mockResolvedValue({ authorizationStatus: 1 }),
    AndroidImportance: {
      NONE: 0,
      MIN: 1,
      LOW: 2,
      DEFAULT: 3,
      HIGH: 4,
    },
    EventType: {
      DISMISSED: 0,
      PRESS: 1,
      ACTION_PRESS: 2,
      DELIVERED: 3,
      APP_BLOCKED: 4,
      CHANNEL_BLOCKED: 5,
      CHANNEL_GROUP_BLOCKED: 6,
    },
  };
});

