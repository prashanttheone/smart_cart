import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Text } from '../components/ui/Text';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// contentCard has paddingHorizontal: 22 on each side (total 44)
const FORM_WIDTH = SCREEN_WIDTH - 44;

export interface AuthScreenProps {
  initialMode?: 'login' | 'register';
}

export function AuthScreen({ initialMode: propInitialMode }: AuthScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Auth'>>();

  const defaultMode = propInitialMode || route.params?.initialMode || 'login';
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // 0 = login, 1 = register
  const slideAnim = useRef(new Animated.Value(defaultMode === 'login' ? 0 : 1)).current;

  const switchMode = React.useCallback(
    (newMode: 'login' | 'register') => {
      setMode((current) => {
        if (current === newMode) return current;
        Animated.spring(slideAnim, {
          toValue: newMode === 'login' ? 0 : 1,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }).start();
        return newMode;
      });
    },
    [slideAnim]
  );

  const initialModeTarget = propInitialMode || route.params?.initialMode;
  const prevInitialModeTargetRef = useRef(initialModeTarget);

  useEffect(() => {
    if (initialModeTarget && initialModeTarget !== prevInitialModeTargetRef.current) {
      prevInitialModeTargetRef.current = initialModeTarget;
      switchMode(initialModeTarget);
    }
  }, [initialModeTarget, switchMode]);

  const handleSuccess = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('DrawerRoot', { screen: 'MainTabs' } as any);
    }
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -FORM_WIDTH],
  });

  const loginOpacity = slideAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.25, 0],
  });

  const registerOpacity = slideAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.25, 1],
  });

  return (
    <AuthLayout
      title={mode === 'login' ? 'Welcome back!' : 'Create account'}
      subtitle={
        mode === 'login'
          ? 'Sign in to continue to SmartCart.'
          : 'Sign up to start shopping on SmartCart.'
      }
      showBack={true}
      onBack={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('DrawerRoot', { screen: 'MainTabs' } as any);
        }
      }}
      showFeatures={true}
    >
      {/* Segmented Switcher Tab Bar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
          onPress={() => switchMode('login')}
          activeOpacity={0.8}
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'login' }}
        >
          <Text
            weight={mode === 'login' ? 'bold' : 'medium'}
            size="sm"
            style={[styles.tabText, mode === 'login' && styles.tabTextActive]}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, mode === 'register' && styles.tabButtonActive]}
          onPress={() => switchMode('register')}
          activeOpacity={0.8}
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'register' }}
        >
          <Text
            weight={mode === 'register' ? 'bold' : 'medium'}
            size="sm"
            style={[styles.tabText, mode === 'register' && styles.tabTextActive]}
          >
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Push/Slide Viewport */}
      <View style={[styles.sliderViewport, { width: FORM_WIDTH }]}>
        <Animated.View
          style={[
            styles.sliderTrack,
            {
              width: FORM_WIDTH * 2,
              transform: [{ translateX }],
            },
          ]}
        >
          {/* Slide 1: Login Form */}
          <Animated.View
            style={[
              styles.slideItem,
              {
                width: FORM_WIDTH,
                opacity: loginOpacity,
              },
            ]}
            pointerEvents={mode === 'login' ? 'auto' : 'none'}
            accessibilityElementsHidden={mode !== 'login'}
          >
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={() => switchMode('register')}
            />
          </Animated.View>

          {/* Slide 2: Register Form */}
          <Animated.View
            style={[
              styles.slideItem,
              {
                width: FORM_WIDTH,
                opacity: registerOpacity,
              },
            ]}
            pointerEvents={mode === 'register' ? 'auto' : 'none'}
            accessibilityElementsHidden={mode !== 'register'}
          >
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => switchMode('login')}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  sliderViewport: {
    overflow: 'hidden',
  },
  sliderTrack: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  slideItem: {
    paddingHorizontal: 1,
  },
});

export default AuthScreen;
