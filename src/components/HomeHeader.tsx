import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, ChevronDown, MapPin, ShoppingCart } from 'lucide-react-native';

import { colors } from '../theme/colors';
import { Text } from './ui/Text';
import { IconButton } from './ui/IconButton';
import { useAppSelector } from '../store';
import { RootStackParamList } from '../navigation/types';

export interface HomeHeaderProps {
  /**
   * Title of delivery location (e.g. "Home", "Work", "Office")
   * @default 'Home'
   */
  locationType?: string;

  /**
   * Full address or locality string
   * @default 'Bangalore, 560001'
   */
  addressText?: string;

  /**
   * Custom notification count. If not provided or 0, shows dot indicator if hasUnreadNotifications is true.
   */
  notificationCount?: number;

  /**
   * Whether to show unread indicator on bell icon
   * @default false
   */
  hasUnreadNotifications?: boolean;

  /**
   * Override cart count. If omitted, pulls dynamically from Redux cart state.
   */
  cartCount?: number;

  /**
   * Callback when delivery address row is pressed
   */
  onPressAddress?: () => void;

  /**
   * Callback when notifications bell is pressed
   */
  onPressNotifications?: () => void;

  /**
   * Callback when cart icon is pressed. Defaults to navigating to 'Cart' screen.
   */
  onPressCart?: () => void;

  /**
   * Subtitle text tag under logo (e.g. 'Grocery', 'Instant')
   */
  tagline?: string;

  /**
   * Whether to apply safe area top padding
   * @default true
   */
  useSafeArea?: boolean;

  /**
   * Container style override
   */
  style?: StyleProp<ViewStyle>;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  locationType = 'Home',
  addressText = 'Bangalore, 560001',
  notificationCount,
  hasUnreadNotifications = false,
  cartCount,
  onPressAddress,
  onPressNotifications,
  onPressCart,
  tagline,
  useSafeArea = true,
  style,
}) => {
  const insetsContext = React.useContext(SafeAreaInsetsContext);
  const insets = insetsContext ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Redux cart count fallback
  const reduxCartCount = useAppSelector((state) => state.cart.totalCount);
  const activeCartCount = cartCount !== undefined ? cartCount : reduxCartCount;

  const handleCartPress = () => {
    if (onPressCart) {
      onPressCart();
    } else {
      try {
        navigation.navigate('Cart');
      } catch {
        // Fallback if navigation context is not available
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        useSafeArea && { paddingTop: Math.max(insets.top, 8) + 4 },
        style,
      ]}
    >
      {/* Top Row: Logo + Action Buttons */}
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <View style={styles.logoTextWrapper}>
            <Text weight="bold" size="3xl" style={styles.logoPrimary}>
              Smart
              <Text weight="bold" size="3xl" style={styles.logoSecondary}>
                Cart
              </Text>
            </Text>
          </View>
          {tagline ? (
            <View style={styles.taglineBadge}>
              <Text weight="medium" size="xs" color="primaryLight">
                {tagline}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actionsContainer}>
          <IconButton
            icon={<Bell size={20} color={colors.textPrimary} strokeWidth={2.2} />}
            badgeCount={notificationCount}
            badgeDot={hasUnreadNotifications && !notificationCount}
            badgeVariant="danger"
            onPress={onPressNotifications}
            accessibilityLabel="Notifications"
            style={styles.actionButton}
          />

          <IconButton
            icon={<ShoppingCart size={20} color={colors.textPrimary} strokeWidth={2.2} />}
            badgeCount={activeCartCount}
            badgeVariant="danger"
            onPress={handleCartPress}
            accessibilityLabel="Shopping Cart"
            style={styles.actionButton}
          />
        </View>
      </View>

      {/* Second Row: Delivery Address */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPressAddress}
        style={styles.addressContainer}
        accessibilityRole="button"
        accessibilityLabel={`Deliver to ${locationType}, ${addressText}`}
      >
        <View style={styles.mapPinContainer}>
          <MapPin size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </View>

        <View style={styles.addressTextContainer}>
          <Text variant="caption" color="textSecondary" style={styles.deliverToText}>
            Deliver to{' '}
            <Text weight="bold" size="xs" color="textPrimary">
              {locationType}
            </Text>
          </Text>

          <View style={styles.addressLine}>
            <Text
              weight="semiBold"
              size="sm"
              color="textPrimary"
              numberOfLines={1}
              style={styles.addressTitle}
            >
              {addressText}
            </Text>
            <ChevronDown size={16} color={colors.textPrimary} strokeWidth={2.4} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPrimary: {
    color: '#0A66FF',
    letterSpacing: -0.5,
  },
  logoSecondary: {
    color: '#10B981',
    letterSpacing: -0.5,
  },
  taglineBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    backgroundColor: colors.surfaceVariant,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 10,
    marginTop: 2,
  },
  mapPinContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTextContainer: {
    justifyContent: 'center',
  },
  deliverToText: {
    marginBottom: 1,
  },
  addressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressTitle: {
    maxWidth: 240,
  },
});

export default HomeHeader;
