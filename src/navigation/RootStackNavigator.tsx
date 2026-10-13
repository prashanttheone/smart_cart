import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList } from './types';
import DrawerNavigator from './DrawerNavigator';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AuthScreen from '../screens/AuthScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Route configuration contract for Root Stack Navigator
 */
export interface StackRouteConfig<T extends keyof RootStackParamList = keyof RootStackParamList> {
  name: T;
  component: React.ComponentType<any>;
  options?:
    | NativeStackNavigationOptions
    | ((props: {
        route: any;
        navigation: any;
      }) => NativeStackNavigationOptions);
}

/**
 * Declarative array list of root stack screens
 */
export const STACK_ROUTES: ReadonlyArray<StackRouteConfig> = [
  {
    name: 'DrawerRoot',
    component: DrawerNavigator,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'CategoryProducts',
    component: CategoryProductsScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'ProductDetails',
    component: ProductDetailsScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Cart',
    component: CartScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Checkout',
    component: CheckoutScreen,
    options: {
      headerShown: false,
      presentation: 'modal',
    },
  },
  {
    name: 'Search',
    component: SearchScreen,
    options: {
      headerShown: false,
      animation: 'fade',
    },
  },
  {
    name: 'Auth',
    component: AuthScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Login',
    component: LoginScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Register',
    component: RegisterScreen,
    options: {
      headerShown: false,
    },
  },
] as const;

export function RootStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DrawerRoot"
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      {STACK_ROUTES.map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
