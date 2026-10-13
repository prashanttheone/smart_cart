import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useToastModal } from '../components/ui';
import { notificationService } from '../services/firebase';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { showToast } = useToastModal();
  const [notifications, setNotifications] = useState(true);
  const [isLoadingPermission, setIsLoadingPermission] = useState(false);

  useEffect(() => {
    let isMounted = true;
    notificationService.isNotificationPreferenceEnabled().then((enabled) => {
      if (isMounted) setNotifications(enabled);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    if (value) {
      setIsLoadingPermission(true);
      const result = await notificationService.requestPermission();
      setIsLoadingPermission(false);

      if (result.granted) {
        setNotifications(true);
        await notificationService.setNotificationPreference(true);
        showToast({
          type: 'success',
          title: 'Push Notifications Enabled 🔔',
          message: 'You will receive real-time updates for order dispatches, discounts, and deliveries.',
        });
      } else {
        setNotifications(false);
        await notificationService.setNotificationPreference(false);
        showToast({
          type: 'warning',
          title: 'Notification Permission Denied',
          message: 'Please grant notification permission in your device system settings to receive updates.',
        });
      }
    } else {
      setNotifications(false);
      await notificationService.setNotificationPreference(false);
      showToast({
        type: 'info',
        title: 'Notifications Paused',
        message: 'Promotional push notifications are temporarily muted.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header with Back Navigation */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Preferences</Text>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.label}>Push Notifications</Text>
            <Text style={styles.sublabel}>Receive order updates and exclusive deals</Text>
          </View>
          {isLoadingPermission ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Stack & Architecture</Text>
        <View style={styles.row}>
          <Text style={styles.label}>State Management</Text>
          <Text style={styles.value}>Redux Toolkit (RTK)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Server Cache</Text>
          <Text style={styles.value}>TanStack React Query</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>HTTP Client</Text>
          <Text style={styles.value}>Axios</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Local Storage</Text>
          <Text style={styles.value}>AsyncStorage</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Navigation</Text>
          <Text style={styles.value}>Stack + Tabs</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerPlaceholder: {
    width: 36,
  },
  section: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sublabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default SettingsScreen;
