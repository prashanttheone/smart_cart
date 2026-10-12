import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { useAppSelector } from '../store';
import { BottomTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const renderHomeIcon = ({ color }: { color: string }) => (
  <Text style={[styles.tabIcon, { color }]}>🏠</Text>
);
const renderCategoriesIcon = ({ color }: { color: string }) => (
  <Text style={[styles.tabIcon, { color }]}>🗂️</Text>
);
const renderCartIcon = ({ color }: { color: string }) => (
  <Text style={[styles.tabIcon, { color }]}>🛒</Text>
);
const renderProfileIcon = ({ color }: { color: string }) => (
  <Text style={[styles.tabIcon, { color }]}>👤</Text>
);

export function TabNavigator() {
  const cartCount = useAppSelector((state) => state.cart.totalCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: renderCategoriesIcon,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: renderCartIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 4,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  tabIcon: {
    fontSize: 20,
  },
  badge: {
    backgroundColor: colors.secondary,
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default TabNavigator;
