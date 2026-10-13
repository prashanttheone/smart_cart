import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Lock, ArrowRight } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { selectAddress } from '../store/slices/addressSlice';
import { selectPaymentMethod } from '../store/slices/checkoutSlice';
import { placeOrder, createOrderAsync } from '../store/slices/orderSlice';
import { RootStackParamList } from '../navigation/types';
import { useToastModal } from '../components/ui';
import { useAuth } from '../services/auth';
import {
  CheckoutHeader,
  AddressSection,
  OrderItemsList,
  DeliveryMethodSelector,
  PaymentMethodSelector,
  PriceSummary,
  PlaceOrderBar,
} from '../components/checkout';

import { colors } from '../theme/colors';

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { showAlert, showConfirm } = useToastModal();
  const { isAuthenticated, user } = useAuth();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Redux state
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartTotalAmount = useAppSelector((state) => state.cart.totalAmount);
  const { addresses, selectedAddressId } = useAppSelector((state) => state.addresses);
  const {
    availableDeliveryMethods,
    selectedDeliveryMethodId,
    availablePaymentMethods,
    selectedPaymentMethodId,
    discountApplied,
  } = useAppSelector((state) => state.checkout);

  // Active address
  const activeAddress = useMemo(() => {
    return (
      addresses.find((a) => a.id === selectedAddressId) ||
      addresses[0] || {
        fullName: user?.full_name?.trim() || user?.name || 'Prashant Kumar',
        type: 'Home' as const,
        streetAddress: 'Your saved delivery address goes here',
      }
    );
  }, [addresses, selectedAddressId, user]);

  // Active delivery & payment methods
  const activeDeliveryMethod = useMemo(() => {
    return (
      availableDeliveryMethods.find((d) => d.id === selectedDeliveryMethodId) ||
      availableDeliveryMethods[0]
    );
  }, [availableDeliveryMethods, selectedDeliveryMethodId]);

  const activePaymentMethod = useMemo(() => {
    return (
      availablePaymentMethods.find((p) => p.id === selectedPaymentMethodId) ||
      availablePaymentMethods[0]
    );
  }, [availablePaymentMethods, selectedPaymentMethodId]);

  // Real cart totals
  const subtotal = cartTotalAmount;
  const deliveryFee = activeDeliveryMethod?.price ?? 0;
  const totalPayable = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee);
  }, [subtotal, deliveryFee]);

  // Handle address change selection from dropdown
  const handleSelectAddress = (addr: any) => {
    dispatch(selectAddress(addr.id));
  };

  // Handle payment method change from dropdown
  const handleSelectPaymentMethod = (pm: any) => {
    dispatch(selectPaymentMethod(pm.id));
  };

  // Handle placing order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showAlert({
        type: 'warning',
        title: 'Empty Cart',
        message: 'Please add items to your cart before placing an order.',
      });
      return;
    }

    const currentUserId = user?.userId || user?.id;
    if (!currentUserId) {
      showAlert({
        type: 'warning',
        title: 'Sign In Required',
        message: 'Please sign in or register to place your order.',
      });
      navigation.navigate('Auth', { initialMode: 'login' });
      return;
    }

    const fullAddress = `${activeAddress.fullName}, ${activeAddress.streetAddress}`.trim();

    setIsPlacingOrder(true);

    try {
      const resultAction = await dispatch(
        createOrderAsync({
          userId: currentUserId,
          address: fullAddress,
          items: cartItems,
          totalAmount: totalPayable,
          deliveryMethod: activeDeliveryMethod?.title || 'Standard delivery',
          paymentMethod: activePaymentMethod?.subtitle || 'UPI, cards, or Cash on Delivery',
          status: 'pending',
        })
      );

      if (createOrderAsync.fulfilled.match(resultAction)) {
        const confirmedOrder = resultAction.payload;
        dispatch(clearCart());
        setIsPlacingOrder(false);

        showConfirm({
          type: 'success',
          title: 'Order Placed! 🎉',
          message: `Your order #${confirmedOrder.id} of ₹${totalPayable.toFixed(2)} has been confirmed successfully.`,
          confirmText: 'Track Order',
          confirmVariant: 'success',
          cancelText: 'Continue Shopping',
          onConfirm: () => {
            navigation.goBack();
            navigation.navigate('DrawerRoot', {
              screen: 'MainTabs',
              params: { screen: 'Orders' },
            } as any);
          },
          onCancel: () => {
            navigation.goBack();
          },
        });
      } else {
        const errorMsg =
          (resultAction.payload as string) ||
          'Unable to complete order with backend server. Please try again.';
        setIsPlacingOrder(false);
        showAlert({
          type: 'error',
          title: 'Order Failed',
          message: errorMsg,
        });
      }
    } catch (err: any) {
      setIsPlacingOrder(false);
      showAlert({
        type: 'error',
        title: 'Order Failed',
        message: err?.message || 'An unexpected error occurred while placing your order.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Safe Area Notch Bar with Pale Shadow Grey Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 30 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Order Checkout</Text>
            {cartItems.length > 0 && (
              <Text style={styles.headerSubtitle}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • ${totalPayable.toFixed(2)}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Blue Banner Header */}
      <CheckoutHeader message="Review your order before payment" />

      {!isAuthenticated ? (
        <View style={styles.authBarrierContainer}>
          <View style={styles.lockBadge}>
            <Lock size={36} color={colors.primary} strokeWidth={2.2} />
          </View>
          <Text style={styles.authBarrierTitle}>Sign In to Complete Checkout</Text>
          <Text style={styles.authBarrierSubtitle}>
            To protect your purchase, delivery address, and payment information, please sign in or create an account before checking out.
          </Text>

          <View style={styles.orderPreviewCard}>
            <View style={styles.orderPreviewRow}>
              <Text style={styles.orderPreviewLabel}>Items in Cart:</Text>
              <Text style={styles.orderPreviewValue}>{cartItems.length} items</Text>
            </View>
            <View style={styles.orderPreviewRow}>
              <Text style={styles.orderPreviewLabel}>Total Payable:</Text>
              <Text style={styles.orderPreviewTotal}>${totalPayable.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Auth', { initialMode: 'login' })}
            style={styles.authBtn}
          >
            <Text style={styles.authBtnText}>Sign In or Register</Text>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Please add items from the store to proceed with checkout.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.browseBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Scrollable Order Details */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Section 1: Delivery Address */}
            <AddressSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
              recipientName={activeAddress.fullName}
              tag={activeAddress.type}
              addressText={activeAddress.streetAddress}
            />

            {/* Section 2: Order Items */}
            <OrderItemsList items={cartItems} />

            {/* Section 3: Delivery Method */}
            <DeliveryMethodSelector
              title="Delivery Method"
              methodName={activeDeliveryMethod?.title || 'Standard delivery'}
              estimate={activeDeliveryMethod?.estimate || 'Ships in 3–5 business days'}
              isSelected={true}
            />

            {/* Section 4: Payment Method */}
            <PaymentMethodSelector
              paymentMethods={availablePaymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onSelectPaymentMethod={handleSelectPaymentMethod}
              title={activePaymentMethod?.title || 'Payment Method'}
              subtitle={activePaymentMethod?.subtitle || 'UPI, cards, or Cash on Delivery'}
              actionText="Select"
            />

            {/* Section 5: Price Details */}
            <PriceSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              discountApplied={discountApplied}
              discountText="Applied"
              totalPayable={totalPayable}
            />
          </ScrollView>

          {/* Sticky Bottom Action Bar */}
          <PlaceOrderBar
            totalAmount={totalPayable}
            onPress={handlePlaceOrder}
            isLoading={isPlacingOrder}
            disabled={cartItems.length === 0}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerContainer: {
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.surface,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  authBarrierContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
  },
  lockBadge: {
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
  authBarrierTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  authBarrierSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  orderPreviewCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    gap: 10,
  },
  orderPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderPreviewLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderPreviewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  orderPreviewTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  authBtn: {
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
  authBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});

export default CheckoutScreen;
