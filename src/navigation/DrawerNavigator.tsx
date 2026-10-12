import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { colors } from '../theme/colors';
import { useAppSelector } from '../store';
import { DrawerParamList } from './types';
import TabNavigator from './TabNavigator';
import OrdersScreen from '../screens/OrdersScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

const renderShopIcon = ({ color }: { color: string }) => (
  <Text style={[styles.drawerIcon, { color }]}>🛍️</Text>
);
const renderOrdersIcon = ({ color }: { color: string }) => (
  <Text style={[styles.drawerIcon, { color }]}>📦</Text>
);
const renderSettingsIcon = ({ color }: { color: string }) => (
  <Text style={[styles.drawerIcon, { color }]}>⚙️</Text>
);

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector((state) => state.cart.totalCount);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🛒</Text>
        </View>
        <Text style={styles.headerTitle}>
          Smart<Text style={styles.headerAccent}>Cart</Text>
        </Text>
        <Text style={styles.userSubtitle}>{user?.email ?? 'Guest User'}</Text>
        {cartCount > 0 && (
          <View style={styles.cartInfoBadge}>
            <Text style={styles.cartInfoText}>{cartCount} items in cart</Text>
          </View>
        )}
      </View>

      {/* Nav List */}
      <View style={styles.itemsWrapper}>
        <DrawerItemList {...props} />
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SmartCart App v0.0.1</Text>
        <Text style={styles.footerSub}>React Navigation 7 • RTK • TanStack</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const headerStyle = { backgroundColor: colors.surface };

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textPrimary,
        drawerActiveBackgroundColor: colors.primaryLight,
        drawerLabelStyle: styles.drawerLabel,
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Home & Shop',
          drawerIcon: renderShopIcon,
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          headerShown: true,
          headerTintColor: colors.primary,
          headerStyle,
          drawerLabel: 'Order History',
          drawerIcon: renderOrdersIcon,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTintColor: colors.primary,
          headerStyle,
          drawerLabel: 'App Settings',
          drawerIcon: renderSettingsIcon,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: colors.surfaceVariant,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  headerAccent: {
    color: colors.secondary,
  },
  userSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cartInfoBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cartInfoText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  itemsWrapper: {
    flex: 1,
    paddingTop: 10,
  },
  drawerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: -10,
  },
  drawerIcon: {
    fontSize: 18,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  footerSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default DrawerNavigator;
