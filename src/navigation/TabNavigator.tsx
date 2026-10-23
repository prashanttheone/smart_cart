import React, { useMemo } from 'react';
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

interface IconRendererProps {
  color: string;
  focused: boolean;
}

/**
 * Single source of truth for every bottom tab.
 * Adding/removing/reordering one entry here updates:
 *   1) the <Tab.Screen> list
 *   2) the tabBar label
 *   3) the tabBar icon
 *   4) the badge wiring (when `dynamicBadge: true`)
 */
export interface TabConfig {
  name: keyof BottomTabParamList;
  component: React.ComponentType<any>;
  label: string;
  Icon: LucideIcon;
  /** Fill the icon with color when focused (e.g. Wishlist heart) */
  focusedFill?: boolean;
  /** Pull a live tabBarBadge from Redux (see useAppSelector below) */
  dynamicBadge?: boolean;
}

export const TAB_CONFIG: ReadonlyArray<TabConfig> = [
  { name: 'Home',       component: HomeScreen,       label: 'Home',       Icon: House },
  { name: 'Categories', component: CategoriesScreen, label: 'Categories', Icon: LayoutGrid },
  { name: 'Wishlist',   component: WishlistScreen,   label: 'Wishlist',   Icon: Heart,        focusedFill: true, dynamicBadge: true },
  { name: 'Orders',     component: OrdersScreen,     label: 'Orders',     Icon: ClipboardList },
  { name: 'Profile',    component: ProfileScreen,    label: 'Profile',    Icon: User },
] as const;

/**
 * Module-level factory → stable icon references across renders.
 * (Inline arrow in tabBarIcon would create a new function every render
 *  and cause the whole tab bar to re-render.)
 */
const createTabIcon = (IconComponent: LucideIcon, focusedFill: boolean) => {
  return function TabBarIcon({ color, focused }: IconRendererProps) {
    return (
      <IconComponent
        size={22}
        color={color}
        strokeWidth={focused ? 2.4 : 1.8}
        fill={focusedFill && focused ? color : 'none'}
      />
    );
  };
};

// ---- Derived once at module load — no duplication with TAB_CONFIG ----
const TAB_ICONS: Record<string, (props: IconRendererProps) => React.ReactNode> = {};
const STATIC_TAB_OPTIONS: Record<string, BottomTabNavigationOptions> = {};

TAB_CONFIG.forEach((tab) => {
  const icon = createTabIcon(tab.Icon, !!tab.focusedFill);
  TAB_ICONS[tab.name] = icon;
  STATIC_TAB_OPTIONS[tab.name] = {
    tabBarLabel: tab.label,
    tabBarIcon: icon,
  };
});

export function TabNavigator() {
  const insets = useSafeAreaInsets();
  const wishlistCount = useAppSelector((state) => state.wishlist.totalCount);
  const bottomPadding = Math.max(insets.bottom, 12);
  const tabHeight = 56 + bottomPadding;

  const screenOptions = useMemo<BottomTabNavigationOptions>(
    () => ({
      headerShown: false,
      freezeOnBlur: true,
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
    }),
    [tabHeight, bottomPadding]
  );

  const wishlistBadge = useMemo(() => {
    if (wishlistCount <= 0) return undefined;
    return wishlistCount > 99 ? '99+' : wishlistCount;
  }, [wishlistCount]);

  const wishlistOptions = useMemo<BottomTabNavigationOptions>(
    () => ({
      tabBarLabel: 'Wishlist',
      tabBarIcon: TAB_ICONS['Wishlist'],
      tabBarBadge: wishlistBadge,
    }),
    [wishlistBadge]
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={screenOptions}
    >
      {TAB_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={tab.dynamicBadge ? wishlistOptions : STATIC_TAB_OPTIONS[tab.name]}
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
