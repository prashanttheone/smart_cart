import React, { useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';

import { store } from './src/store';
import { queryClient } from './src/services/query/queryClient';
import { ToastModalProvider, useToastModal } from './src/components/ui';
import { AuthProvider } from './src/services/auth';
import { notificationService, analyticsService } from './src/services/firebase';
import RootStackNavigator from './src/navigation/RootStackNavigator';

function NotificationListener({ children }: { children: React.ReactNode }) {
  const { showToast } = useToastModal();

  useEffect(() => {
    // 1. Initial permission check & token acquisition
    notificationService.checkPermission().then((isGranted) => {
      if (isGranted) {
        notificationService.getFCMToken();
      }
    });

    // 2. Foreground push message listener
    const unsubscribeForeground = notificationService.onForegroundMessage((remoteMessage) => {
      const title = remoteMessage.notification?.title || 'SmartCart Notification';
      const body = remoteMessage.notification?.body || 'You have a new update.';
      showToast({
        type: 'info',
        title,
        message: body,
      });
    });

    // 3. Notification opened from background listener
    const unsubscribeOpened = notificationService.onNotificationOpenedApp((remoteMessage) => {
      console.log('[App] Notification opened from background:', remoteMessage);
    });

    // 4. Initial notification check (launched from quit state)
    notificationService.getInitialNotification().then((initialMessage) => {
      if (initialMessage) {
        console.log('[App] Launched from quit state via notification:', initialMessage);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [showToast]);

  return <>{children}</>;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigationRef = useRef<any>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ToastModalProvider>
              <AuthProvider>
                <NotificationListener>
                  <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                  <NavigationContainer
                    ref={navigationRef}
                    onReady={() => {
                      routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
                      if (routeNameRef.current) {
                        analyticsService.logScreenView(routeNameRef.current);
                      }
                    }}
                    onStateChange={async () => {
                      const previousRouteName = routeNameRef.current;
                      const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

                      if (previousRouteName !== currentRouteName && currentRouteName) {
                        routeNameRef.current = currentRouteName;
                        await analyticsService.logScreenView(currentRouteName);
                      }
                    }}
                  >
                    <RootStackNavigator />
                  </NavigationContainer>
                </NotificationListener>
              </AuthProvider>
            </ToastModalProvider>
          </QueryClientProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
