import React from 'react';
import { StyleSheet } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  House,
  LayoutGrid,
  Heart,
  ClipboardList,
  User,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { BottomTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export interface TabIconProps {
  color: string;
  size: number;
  focused: boolean;
}

const renderHomeIcon = ({ color, size, focused }: TabIconProps) => (
  <House size={size} color={color} strokeWidth={focused ? 2.4 : 1.8} />
);

const renderCategoriesIcon = ({ color, size, focused }: TabIconProps) => (
  <LayoutGrid size={size} color={color} strokeWidth={focused ? 2.4 : 1.8} />
);

const renderWishlistIcon = ({ color, size, focused }: TabIconProps) => (
  <Heart
    size={size}
    color={color}
    fill={focused ? color : 'none'}
    strokeWidth={focused ? 2.4 : 1.8}
  />
);

const renderOrdersIcon = ({ color, size, focused }: TabIconProps) => (
  <ClipboardList size={size} color={color} strokeWidth={focused ? 2.4 : 1.8} />
);

const renderProfileIcon = ({ color, size, focused }: TabIconProps) => (
  <User size={size} color={color} strokeWidth={focused ? 2.4 : 1.8} />
);

/**
 * Route configuration contract for Bottom Tab Navigator
 */
export interface TabRouteConfig<T extends keyof BottomTabParamList = keyof BottomTabParamList> {
  name: T;
  component: React.ComponentType<any>;
  label: string;
  icon: (props: TabIconProps) => React.ReactNode;
  options?: BottomTabNavigationOptions;
}

/**
 * Declarative array list of bottom tab screens
 */
export const TAB_ROUTES: ReadonlyArray<TabRouteConfig> = [
  {
    name: 'Home',
    component: HomeScreen,
    label: 'Home',
    icon: renderHomeIcon,
  },
  {
    name: 'Categories',
    component: CategoriesScreen,
    label: 'Categories',
    icon: renderCategoriesIcon,
  },
  {
    name: 'Wishlist',
    component: WishlistScreen,
    label: 'Wishlist',
    icon: renderWishlistIcon,
  },
  {
    name: 'Orders',
    component: OrdersScreen,
    label: 'Orders',
    icon: renderOrdersIcon,
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    label: 'Profile',
    icon: renderProfileIcon,
  },
] as const;

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {TAB_ROUTES.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            tabBarLabel: route.label,
            tabBarIcon: route.icon,
            ...route.options,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 64,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default TabNavigator;
