import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Register } from '../components/auth';

export function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Register
      showBack={true}
      onBack={() => navigation.goBack()}
      onSuccess={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('DrawerRoot', { screen: 'MainTabs' } as any);
        }
      }}
      onNavigateToLogin={() => navigation.navigate('Login')}
    />
  );
}

export default RegisterScreen;
