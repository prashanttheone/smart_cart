import React, { useEffect, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShieldCheck, Lock, ArrowRight, Package } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Text } from '../components/ui/Text';
import { useAuth } from '../services/auth';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchUserOrders } from '../store/slices/orderSlice';
import { RootStackParamList } from '../navigation/types';

export function OrdersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { orders, isLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    const userId = user?.userId || user?.id;
    if (isAuthenticated && userId) {
      dispatch(fetchUserOrders(userId));
    }
  }, [dispatch, isAuthenticated, user?.userId, user?.id]);

  const orderKeyExtractor = useCallback(
    (item: any) => item.id || (item as any).order_id,
    []
  );

  const renderOrderItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.orderIdRow}>
            <Package size={18} color={colors.primary} />
            <Text weight="bold" size="md" color="textPrimary" style={styles.orderId}>
              {item.id || (item as any).order_id}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              item.status?.toLowerCase() === 'completed' || item.status === 'Delivered'
                ? styles.badgeSuccess
                : styles.badgePending,
            ]}
          >
            <Text
              weight="bold"
              size="xs"
              style={
                item.status?.toLowerCase() === 'completed' || item.status === 'Delivered'
                  ? styles.badgeSuccessText
                  : styles.badgePendingText
              }
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Text variant="caption" color="textMuted" style={styles.date}>
          {item.date} • {item.itemsCount ?? 1} items
        </Text>
        {item.shippingAddress ? (
          <Text variant="caption" color="textSecondary" numberOfLines={1} style={styles.addressText}>
            📍 {item.shippingAddress}
          </Text>
        ) : null}
        <View style={styles.bottomRow}>
          <Text variant="body" color="textSecondary">
            Total Amount:
          </Text>
          <Text weight="bold" size="md" color="textPrimary">
            ₹{item.total.toFixed(2)}
          </Text>
        </View>
      </View>
    ),
    []
  );

  // Protected View for Unauthenticated Users
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text weight="bold" size="xl" color="textPrimary">
            My Orders
          </Text>
          <Text variant="caption" color="textSecondary" style={styles.subtitle}>
            Track your recent orders and delivery status
          </Text>
        </View>

        <View style={styles.protectedContainer}>
          <View style={styles.lockIconBadge}>
            <Lock size={36} color={colors.primary} strokeWidth={2.2} />
          </View>

          <Text weight="bold" size="xl" color="textPrimary" align="center" style={styles.protectedTitle}>
            Sign In to View Orders
          </Text>

          <Text variant="body" color="textSecondary" align="center" style={styles.protectedDescription}>
            Your order history, tracking details, and invoices are protected for your security. Please sign in or create an account to view them.
          </Text>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Auth', { initialMode: 'login' })}
            style={styles.signInBtn}
            accessibilityRole="button"
            accessibilityLabel="Sign in or create account"
          >
            <Text weight="bold" size="md" color="textInverse" style={styles.signInBtnText}>
              Sign In or Create Account
            </Text>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Authenticated View
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text weight="bold" size="xl" color="textPrimary">
            My Orders
          </Text>
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={14} color="#059669" />
            <Text weight="semiBold" size="xs" style={styles.verifiedText}>
              Verified
            </Text>
          </View>
        </View>
        <Text variant="caption" color="textSecondary" style={styles.subtitle}>
          Logged in as {user?.full_name ? user.full_name.trim() : user?.name || user?.email}
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={orderKeyExtractor}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={() => {
          const userId = user?.userId || user?.id;
          if (userId) dispatch(fetchUserOrders(userId));
        }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBadge}>
                <Package size={40} color={colors.textSecondary} />
              </View>
              <Text weight="bold" size="lg" color="textPrimary" style={styles.emptyTitle}>
                No Orders Yet
              </Text>
              <Text variant="body" color="textSecondary" align="center" style={styles.emptySubtitle}>
                When you place orders through checkout, they will appear here with live tracking.
              </Text>
              <TouchableOpacity
                style={styles.shopNowBtn}
                onPress={() => navigation.navigate('DrawerRoot', { screen: 'MainTabs' } as any)}
                activeOpacity={0.85}
              >
                <Text weight="bold" size="sm" color="textInverse">
                  Start Shopping
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )
        }
        renderItem={renderOrderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 45,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    color: '#059669',
  },
  subtitle: {
    marginTop: 2,
  },
  protectedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  lockIconBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
  },
  protectedTitle: {
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  protectedDescription: {
    lineHeight: 20,
    marginBottom: 24,
  },
  signInBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  signInBtnText: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 15,
  },
  badge: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  date: {
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  addressText: {
    marginBottom: 8,
  },
  badgeSuccess: {
    backgroundColor: '#ECFDF5',
  },
  badgeSuccessText: {
    color: '#059669',
  },
  badgePending: {
    backgroundColor: colors.secondaryLight,
  },
  badgePendingText: {
    color: colors.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 6,
  },
  emptySubtitle: {
    lineHeight: 20,
    marginBottom: 20,
  },
  shopNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrdersScreen;
