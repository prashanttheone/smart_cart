import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { selectAddress } from '../store/slices/addressSlice';
import { selectPaymentMethod } from '../store/slices/checkoutSlice';
import { placeOrder } from '../store/slices/orderSlice';
import { RootStackParamList } from '../navigation/types';
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

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
        fullName: 'Prashant Kumar',
        type: 'Home' as const,
        streetAddress: 'Your saved delivery address goes here',
      }
    );
  }, [addresses, selectedAddressId]);

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
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }

    setIsPlacingOrder(true);

    setTimeout(() => {
      dispatch(
        placeOrder({
          items: cartItems,
          total: totalPayable,
          shippingAddress: `${activeAddress.fullName}, ${activeAddress.streetAddress}`,
          deliveryMethod: activeDeliveryMethod?.title || 'Standard delivery',
          paymentMethod: activePaymentMethod?.subtitle || 'UPI, cards, or Cash on Delivery',
        })
      );

      dispatch(clearCart());
      setIsPlacingOrder(false);

      Alert.alert(
        'Order Placed! 🎉',
        `Your order of $${totalPayable.toFixed(2)} has been confirmed successfully.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              navigation.goBack();
              navigation.navigate('DrawerRoot', {
                screen: 'MainTabs',
                params: { screen: 'Orders' },
              } as any);
            },
          },
          {
            text: 'Continue Shopping',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 900);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Blue Banner Header */}
      <CheckoutHeader message="Review your order before payment" />

      {cartItems.length === 0 ? (
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
});

export default CheckoutScreen;
