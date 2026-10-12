import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

interface PriceSummaryProps {
  subtotal: number;
  deliveryFee?: number;
  discountApplied?: boolean;
  discountText?: string;
  totalPayable: number;
}

export function PriceSummary({
  subtotal,
  deliveryFee = 0,
  discountApplied = true,
  discountText = 'Applied',
  totalPayable,
}: PriceSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Price Details</Text>

      {/* Subtotal Row */}
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
      </View>

      {/* Delivery Row */}
      <View style={styles.row}>
        <Text style={styles.label}>Delivery</Text>
        <Text style={styles.value}>${deliveryFee.toFixed(2)}</Text>
      </View>

      {/* Discount Row */}
      <View style={styles.row}>
        <Text style={styles.label}>Discount</Text>
        <Text style={styles.discountValue}>
          {discountApplied ? discountText : '$0.00'}
        </Text>
      </View>

      {/* Inner Divider */}
      <View style={styles.innerDivider} />

      {/* Total Payable Row */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total payable</Text>
        <Text style={styles.totalValue}>${totalPayable.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
  discountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  innerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
});

export default PriceSummary;
