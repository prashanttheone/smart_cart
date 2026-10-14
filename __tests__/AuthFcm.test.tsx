import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { AuthProvider, useAuth } from '../src/services/auth/AuthProvider';
import { getDeviceInfo } from '../src/utils/deviceInfo';
import { notificationService } from '../src/services/firebase/notificationService';
import { api } from '../src/services/api/apiClient';

describe('Auth FCM and Device Info Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates structured device info with platform metadata', () => {
    const info = getDeviceInfo();
    expect(info).toBeDefined();
    expect(info.platform).toBeDefined();
    expect(typeof info.platform).toBe('string');
    expect(info.osVersion).toBeDefined();
    expect(info.appName).toBe('SmartCart');
  });

  it('retrieves FCM token through notificationService', async () => {
    const token = await notificationService.getStoredOrFreshToken();
    expect(token).toBe('mock-fcm-token');
  });

  it('sends fcm_token, fcmToken, platform, and device_info during login and register', async () => {
    const postSpy = jest.spyOn(api, 'post').mockResolvedValue({
      token: 'jwt-mock-token-xyz',
      userId: 'user_123',
      email: 'test@example.com',
      full_name: 'Test Customer',
      message: 'Success',
    });

    let authContext: any;
    function ConsumerComponent() {
      authContext = useAuth();
      return null;
    }

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <Provider store={store}>
          <AuthProvider>
            <ConsumerComponent />
          </AuthProvider>
        </Provider>
      );
    });

    expect(authContext).toBeDefined();

    // 1. Test Login sends FCM and device fields
    await ReactTestRenderer.act(async () => {
      await authContext.login('test@example.com', 'secret123');
    });

    expect(postSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      expect.objectContaining({
        email: 'test@example.com',
        password: 'secret123',
        fcm_token: 'mock-fcm-token',
        fcmToken: 'mock-fcm-token',
        platform: expect.any(String),
        device_info: expect.objectContaining({ appName: 'SmartCart' }),
        deviceInfo: expect.objectContaining({ appName: 'SmartCart' }),
      })
    );

    // 2. Test Register sends FCM and device fields
    await ReactTestRenderer.act(async () => {
      await authContext.register({
        fullName: 'Test User',
        email: 'testuser@example.com',
        phone: '9876543210',
        password: 'password123',
      });
    });

    expect(postSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/register'),
      expect.objectContaining({
        full_name: 'Test User',
        email: 'testuser@example.com',
        phone: '9876543210',
        password: 'password123',
        fcm_token: 'mock-fcm-token',
        fcmToken: 'mock-fcm-token',
        platform: expect.any(String),
        device_info: expect.objectContaining({ appName: 'SmartCart' }),
        deviceInfo: expect.objectContaining({ appName: 'SmartCart' }),
      })
    );

    postSpy.mockRestore();
  });

  it('displays native system push notifications with channel setup', async () => {
    await notificationService.setupNotificationChannels();

    const notificationId = await notificationService.displayPushNotification({
      notification: {
        title: 'Special Offer',
        body: 'Flat 50% discount on groceries!',
      },
      data: {
        screen: 'Deals',
      },
    });

    expect(notificationId).toBe('mock-notification-id');
  });

  it('does not trigger HTTP DELETE on /api/auth/fcm-token when logging out or deleting token', async () => {
    const deleteSpy = jest.spyOn(api, 'delete');

    // 1. Calling deleteToken directly should clear local state without hitting DELETE endpoint
    await notificationService.deleteToken();
    expect(deleteSpy).not.toHaveBeenCalled();

    // 2. Calling logout should also not trigger DELETE endpoint
    let authContext: any;
    function ConsumerComponent() {
      authContext = useAuth();
      return null;
    }

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <Provider store={store}>
          <AuthProvider>
            <ConsumerComponent />
          </AuthProvider>
        </Provider>
      );
    });

    await ReactTestRenderer.act(async () => {
      await authContext.logout();
    });

    expect(deleteSpy).not.toHaveBeenCalled();
    deleteSpy.mockRestore();
  });
});
