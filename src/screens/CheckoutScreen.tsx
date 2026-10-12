import React, { useMemo, useState } from 'react';
import {
  Alert,
  AlertButton,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart, CartItem } from '../store/slices/cartSlice';
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

// Fallback sample product matching DummyJSON mascara item in screenshot if cart is empty
const SAMPLE_CHECKOUT_ITEM: CartItem = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  price: 8.94,
  quantity: 1,
  thumbnail: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
};

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

  // Items to display (falls back to sample mascara item if cart is empty)
  const displayItems = useMemo(() => {
    return cartItems.length > 0 ? cartItems : [SAMPLE_CHECKOUT_ITEM];
  }, [cartItems]);

  // Totals
  const subtotal = useMemo(() => {
    if (cartItems.length > 0) {
      return cartTotalAmount;
    }
    return SAMPLE_CHECKOUT_ITEM.price * SAMPLE_CHECKOUT_ITEM.quantity;
  }, [cartItems, cartTotalAmount]);

  const deliveryFee = activeDeliveryMethod?.price ?? 0;
  const totalPayable = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee);
  }, [subtotal, deliveryFee]);

  // Handle address change selection
  const handleChangeAddress = () => {
    const buttons: AlertButton[] = [
      ...addresses.map((addr): AlertButton => ({
        text: `${addr.fullName} (${addr.type})`,
        onPress: () => {
          dispatch(selectAddress(addr.id));
        },
      })),
      { text: 'Cancel', style: 'cancel' },
    ];

    Alert.alert(
      'Select Delivery Address',
      'Choose an address for this order:',
      buttons
    );
  };

  // Handle payment method change
  const handleSelectPaymentMethod = () => {
    const buttons: AlertButton[] = [
      ...availablePaymentMethods.map((pm): AlertButton => ({
        text: pm.title === 'Payment Method' ? 'All (UPI, Cards, COD)' : pm.title,
        onPress: () => {
          dispatch(selectPaymentMethod(pm.id));
        },
      })),
      { text: 'Cancel', style: 'cancel' },
    ];

    Alert.alert(
      'Payment Method',
      'Choose your preferred payment method:',
      buttons
    );
  };

  // Handle placing order
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);

    setTimeout(() => {
      dispatch(
        placeOrder({
          items: displayItems,
          total: totalPayable,
          shippingAddress: `${activeAddress.fullName}, ${activeAddress.streetAddress}`,
          deliveryMethod: activeDeliveryMethod?.title || 'Standard delivery',
          paymentMethod: activePaymentMethod?.subtitle || 'UPI, cards, or Cash on Delivery',
        })
      );

      if (cartItems.length > 0) {
        dispatch(clearCart());
      }

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Blue Banner Header */}
        <CheckoutHeader message="Review your order before payment" />

        {/* Scrollable Order Details */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1: Delivery Address */}
          <AddressSection
            recipientName={activeAddress.fullName}
            tag={activeAddress.type}
            addressText={activeAddress.streetAddress}
            onChangePress={handleChangeAddress}
          />

          {/* Section 2: Order Items */}
          <OrderItemsList items={displayItems} />

          {/* Section 3: Delivery Method */}
          <DeliveryMethodSelector
            title="Delivery Method"
            methodName={activeDeliveryMethod?.title || 'Standard delivery'}
            estimate={activeDeliveryMethod?.estimate || 'Ships in 3–5 business days'}
            isSelected={true}
          />

          {/* Section 4: Payment Method */}
          <PaymentMethodSelector
            title={activePaymentMethod?.title || 'Payment Method'}
            subtitle={activePaymentMethod?.subtitle || 'UPI, cards, or Cash on Delivery'}
            actionText="Select"
            onSelectPress={handleSelectPaymentMethod}
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
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
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
});

export default CheckoutScreen;
