import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Login } from '../components/auth';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Login
      showBack={true}
      onBack={() => navigation.goBack()}
      onSuccess={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('DrawerRoot', { screen: 'MainTabs' } as any);
        }
      }}
      onNavigateToRegister={() => navigation.navigate('Register')}
    />
  );
}

export default LoginScreen;
