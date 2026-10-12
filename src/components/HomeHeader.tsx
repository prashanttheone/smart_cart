import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  StatusBar,
} from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Bell,
  ChevronDown,
  MapPin,
  ShoppingCart,
  House,
  Briefcase,
  Check,
} from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { colors } from '../theme/colors';
import { Text } from './ui/Text';
import { IconButton } from './ui/IconButton';
import { useAppSelector } from '../store';
import { RootStackParamList } from '../navigation/types';

export interface AddressItem {
  id: string;
  type: string;
  address: string;
  isDefault?: boolean;
}

export const DEFAULT_ADDRESSES: AddressItem[] = [
  { id: '1', type: 'Home', address: 'Bangalore, 560001', isDefault: true },
  { id: '2', type: 'Office', address: 'Indiranagar, 560038' },
  { id: '3', type: 'Other', address: 'Koramangala, 560034' },
];

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
   * List of addresses for the dropdown selection
   */
  addresses?: AddressItem[];

  /**
   * Controlled selected address ID
   */
  selectedAddressId?: string;

  /**
   * Callback fired when an address is picked from the dropdown
   */
  onSelectAddress?: (item: AddressItem) => void;

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
  addresses,
  selectedAddressId,
  onSelectAddress,
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

  const addressList = addresses && addresses.length > 0 ? addresses : DEFAULT_ADDRESSES;

  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    selectedAddressId || addressList[0]?.id || '1'
  );

  useEffect(() => {
    if (selectedAddressId) {
      setInternalSelectedId(selectedAddressId);
    }
  }, [selectedAddressId]);

  const activeAddress =
    addressList.find((a) => a.id === (selectedAddressId || internalSelectedId)) ||
    addressList[0] || {
      id: '1',
      type: locationType,
      address: addressText,
    };

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

  const handleAddressChange = (item: AddressItem) => {
    setInternalSelectedId(item.id);
    onSelectAddress?.(item);
    onPressAddress?.();
  };

  return (
    <View
      style={[
        styles.container,
        useSafeArea && { paddingTop: insets.top },
        style,
      ]}
    >
      <StatusBar barStyle="dark-content" />
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

      {/* Second Row: Delivery Address Dropdown */}
      <View style={styles.addressSection}>
        <Dropdown
          data={addressList}
          labelField="address"
          valueField="id"
          value={activeAddress.id}
          onChange={handleAddressChange}
          style={styles.dropdownTrigger}
          containerStyle={styles.dropdownMenu}
          activeColor="#EFF6FF"
          selectedTextStyle={styles.hiddenSelectedText}
          renderLeftIcon={() => (
            <View style={styles.addressLeftWrapper}>
              <View style={styles.mapPinContainer}>
                <MapPin size={20} color={colors.textPrimary} strokeWidth={2.2} />
              </View>

              <View style={styles.addressTextContainer}>
                <Text variant="caption" color="textSecondary" style={styles.deliverToText}>
                  Deliver to{' '}
                  <Text weight="bold" size="xs" color="textPrimary">
                    {activeAddress.type}
                  </Text>
                </Text>

                <Text
                  weight="semiBold"
                  size="sm"
                  color="textPrimary"
                  numberOfLines={1}
                  style={styles.addressTitle}
                >
                  {activeAddress.address}
                </Text>
              </View>
            </View>
          )}
          renderRightIcon={(visible) => (
            <View style={styles.chevronWrapper}>
              <ChevronDown
                size={16}
                color={colors.textPrimary}
                strokeWidth={2.4}
                style={visible ? styles.chevronOpen : undefined}
              />
            </View>
          )}
          renderItem={(item: AddressItem, selected?: boolean) => {
            const isHome = item.type.toLowerCase().includes('home');
            const isOffice =
              item.type.toLowerCase().includes('office') ||
              item.type.toLowerCase().includes('work');

            return (
              <View
                style={[
                  styles.dropdownItem,
                  selected && styles.dropdownItemSelected,
                ]}
              >
                <View
                  style={[
                    styles.dropdownItemIcon,
                    selected && styles.dropdownItemIconSelected,
                  ]}
                >
                  {isHome ? (
                    <House
                      size={17}
                      color={selected ? colors.primary : colors.textSecondary}
                      strokeWidth={2.2}
                    />
                  ) : isOffice ? (
                    <Briefcase
                      size={17}
                      color={selected ? colors.primary : colors.textSecondary}
                      strokeWidth={2.2}
                    />
                  ) : (
                    <MapPin
                      size={17}
                      color={selected ? colors.primary : colors.textSecondary}
                      strokeWidth={2.2}
                    />
                  )}
                </View>

                <View style={styles.dropdownItemContent}>
                  <Text
                    weight="semiBold"
                    size="sm"
                    color={selected ? 'primary' : 'textPrimary'}
                  >
                    {item.type}
                  </Text>
                  <Text variant="caption" color="textSecondary" numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>

                {selected && (
                  <View style={styles.dropdownItemCheck}>
                    <Check size={16} color={colors.primary} strokeWidth={2.5} />
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f5f9', // Pale shadow grey for notch, battery & network readability
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressSection: {
    marginTop: 2,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 2,
  },
  hiddenSelectedText: {
    display: 'none',
  },
  addressLeftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
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
  addressTitle: {
    maxWidth: 240,
  },
  chevronWrapper: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownMenu: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dropdownItemIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  dropdownItemContent: {
    flex: 1,
  },
  dropdownItemCheck: {
    marginLeft: 8,
  },
});

export default HomeHeader;
