import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../store/slices/cartSlice';

export function CheckoutScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { totalAmount, totalCount } = useAppSelector((state) => state.cart);

  const handleCompleteOrder = () => {
    dispatch(clearCart());
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>🎉</Text>
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.subtitle}>
          Ready to place your SmartCart order!
        </Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Items Total:</Text>
          <Text style={styles.value}>{totalCount} items</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Shipping Fee:</Text>
          <Text style={styles.freeText}>FREE</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.boldLabel}>Total Payable:</Text>
          <Text style={styles.totalPrice}>${totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleCompleteOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.payBtnText}>Confirm & Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  icon: {
    fontSize: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  freeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  boldLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
  },
  payBtn: {
    backgroundColor: colors.secondary,
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  payBtnText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
