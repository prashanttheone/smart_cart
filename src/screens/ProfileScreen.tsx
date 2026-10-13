import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { useToastModal } from '../components/ui';
import { useAuth } from '../services/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {
  Package,
  Heart,
  Settings as SettingsIcon,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react-native';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showToast, showConfirm } = useToastModal();
  const { user, isAuthenticated, logout: authLogout } = useAuth();

  const handleLogout = () => {
    showConfirm({
      type: 'confirm',
      title: 'Log Out',
      message: 'Are you sure you want to log out of your SmartCart account?',
      confirmText: 'Log Out',
      confirmVariant: 'danger',
      onConfirm: async () => {
        await authLogout();
        showToast({
          type: 'info',
          title: 'Logged Out',
          message: 'You have been logged out of SmartCart.',
        });
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Profile</Text>
      </View>

      {/* User Information Card */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name || user?.name
              ? (user.full_name || user.name).trim()[0].toUpperCase()
              : '👤'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {(user?.full_name || user?.name) ?? 'Guest User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email ?? 'Not logged in'}</Text>

          {user?.userId && (
            <View style={styles.userIdRow}>
              <Text style={styles.userIdLabel}>User ID: </Text>
              <Text style={styles.userIdValue} numberOfLines={1} ellipsizeMode="middle">
                {user.userId}
              </Text>
            </View>
          )}

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isAuthenticated ? colors.secondaryLight : colors.dangerLight },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isAuthenticated ? colors.secondary : colors.danger },
                ]}
              >
                {isAuthenticated ? '● Authenticated' : '○ Logged Out'}
              </Text>
            </View>

            {isAuthenticated && user?.is_recruiter && (
              <View style={styles.recruiterBadge}>
                <Text style={styles.recruiterBadgeText}>👔 Recruiter</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Account Navigation Menu */}
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('DrawerRoot', {
              screen: 'MainTabs',
              params: { screen: 'Orders' },
            } as any)
          }
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#EFF6FF' }]}>
            <Package size={20} color={colors.primary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuItemTitle}>My Orders</Text>
            <Text style={styles.menuItemSubtitle}>Track shipments and view past purchases</Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('DrawerRoot', {
              screen: 'MainTabs',
              params: { screen: 'Wishlist' },
            } as any)
          }
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#FDF2F8' }]}>
            <Heart size={20} color="#DB2777" />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuItemTitle}>Saved Wishlist</Text>
            <Text style={styles.menuItemSubtitle}>View products you bookmarked</Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('DrawerRoot', {
              screen: 'Settings',
            } as any)
          }
        >
          <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
            <SettingsIcon size={20} color={colors.textPrimary} />
          </View>
          <View style={styles.menuTextCol}>
            <Text style={styles.menuItemTitle}>Settings</Text>
            <Text style={styles.menuItemSubtitle}>App preferences and account security</Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Auth Actions */}
      <View style={styles.actionSection}>
        {isAuthenticated ? (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut size={18} color={colors.danger} style={styles.logoutIcon} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.authButtonsStack}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Auth', { initialMode: 'login' })}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Auth', { initialMode: 'register' })}
              activeOpacity={0.8}
            >
              <Text style={styles.registerBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 30,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
  },
  userInfo: {},
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  userIdLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  userIdValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.textPrimary,
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  recruiterBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginLeft: 6,
  },
  recruiterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  menuCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64,
  },
  actionSection: {
    margin: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.dangerLight,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutBtnText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 15,
  },
  authButtonsStack: {
    gap: 10,
  },
  loginBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  loginBtnText: {
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 15,
  },
  registerBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  registerBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ProfileScreen;
