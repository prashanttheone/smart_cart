import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  LucideIcon,
  House,
  LayoutGrid,
  Heart,
  ClipboardList,
  User,
} from 'lucide-react-native';

import { useAppSelector } from '../store';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { BottomTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

/**
 * Strongly-typed icon map connecting route keys to Lucide icons
 */
export const TAB_ICON_MAP: Record<keyof BottomTabParamList, LucideIcon> = {
  Home: House,
  Categories: LayoutGrid,
  Wishlist: Heart,
  Orders: ClipboardList,
  Profile: User,
};

interface IconRendererProps {
  color: string;
  focused: boolean;
}

/**
 * Factory function defined at module-level to ensure stable component references
 * avoiding unstable nested component re-creation on render.
 */
const createTabIcon = (routeName: keyof BottomTabParamList) => {
  const IconComponent = TAB_ICON_MAP[routeName];
  return function TabBarIcon({ color, focused }: IconRendererProps) {
    return (
      <IconComponent
        size={22}
        color={color}
        strokeWidth={focused ? 2.4 : 1.8}
        fill={routeName === 'Wishlist' && focused ? color : 'none'}
      />
    );
  };
};

/**
 * Route configuration contract for Bottom Tab Navigator
 */
export interface TabRouteConfig<T extends keyof BottomTabParamList = keyof BottomTabParamList> {
  name: T;
  component: React.ComponentType<any>;
  label: string;
  icon: (props: IconRendererProps) => React.ReactNode;
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
    icon: createTabIcon('Home'),
  },
  {
    name: 'Categories',
    component: CategoriesScreen,
    label: 'Categories',
    icon: createTabIcon('Categories'),
  },
  {
    name: 'Wishlist',
    component: WishlistScreen,
    label: 'Wishlist',
    icon: createTabIcon('Wishlist'),
  },
  {
    name: 'Orders',
    component: OrdersScreen,
    label: 'Orders',
    icon: createTabIcon('Orders'),
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    label: 'Profile',
    icon: createTabIcon('Profile'),
  },
] as const;

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  const wishlistCount = useAppSelector((state) => state.wishlist.totalCount);
  const bottomPadding = Math.max(insets.bottom, 12);
  const tabHeight = 56 + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            paddingBottom: bottomPadding,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
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
            tabBarBadge:
              route.name === 'Wishlist' && wishlistCount > 0
                ? wishlistCount > 99
                  ? '99+'
                  : wishlistCount
                : undefined,
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
    paddingTop: 0,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 4,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  tabBarLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.medium,
    marginTop: 2,
  },
});

export default TabNavigator;
