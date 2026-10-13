import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShieldCheck, Lock, ArrowRight, Package, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Text } from '../components/ui/Text';
import { useAuth } from '../services/auth';
import { RootStackParamList } from '../navigation/types';

const SAMPLE_ORDERS = [
  { id: 'ORD-9821', date: 'Oct 11, 2026', total: 149.99, status: 'Delivered', items: 3 },
  { id: 'ORD-9740', date: 'Oct 04, 2026', total: 42.5, status: 'Delivered', items: 1 },
  { id: 'ORD-9512', date: 'Sep 28, 2026', total: 219.0, status: 'Delivered', items: 4 },
];

export function OrdersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated, user } = useAuth();

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

          {/* Value Props */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitRow}>
              <CheckCircle2 size={16} color="#059669" />
              <Text variant="caption" color="textPrimary" style={styles.benefitText}>
                Live GPS delivery & shipment updates
              </Text>
            </View>
            <View style={styles.benefitRow}>
              <CheckCircle2 size={16} color="#059669" />
              <Text variant="caption" color="textPrimary" style={styles.benefitText}>
                Official invoice and receipt downloads
              </Text>
            </View>
            <View style={styles.benefitRow}>
              <CheckCircle2 size={16} color="#059669" />
              <Text variant="caption" color="textPrimary" style={styles.benefitText}>
                Easy 1-tap returns and exchange requests
              </Text>
            </View>
          </View>

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
        data={SAMPLE_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.orderIdRow}>
                <Package size={18} color={colors.primary} />
                <Text weight="bold" size="md" color="textPrimary" style={styles.orderId}>
                  {item.id}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text weight="bold" size="xs" color="secondary">
                  {item.status}
                </Text>
              </View>
            </View>
            <Text variant="caption" color="textMuted" style={styles.date}>
              {item.date} • {item.items} items
            </Text>
            <View style={styles.bottomRow}>
              <Text variant="body" color="textSecondary">
                Total Amount:
              </Text>
              <Text weight="bold" size="md" color="textPrimary">
                ${item.total.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
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
    paddingVertical: 14,
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
  benefitsCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 28,
    gap: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 13,
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
});

export default OrdersScreen;
