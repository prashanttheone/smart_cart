import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';

import { store } from './src/store';
import { queryClient } from './src/services/query/queryClient';
import { ToastModalProvider } from './src/components/ui';
import { AuthProvider } from './src/services/auth';
import RootStackNavigator from './src/navigation/RootStackNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ToastModalProvider>
              <AuthProvider>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <NavigationContainer>
                  <RootStackNavigator />
                </NavigationContainer>
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
