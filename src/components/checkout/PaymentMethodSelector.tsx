import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface PaymentMethodSelectorProps {
  title?: string;
  subtitle?: string;
  actionText?: string;
  onSelectPress?: () => void;
}

export function PaymentMethodSelector({
  title = 'Payment Method',
  subtitle = 'UPI, cards, or Cash on Delivery',
  actionText = 'Select',
  onSelectPress,
}: PaymentMethodSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Left Card Icon */}
        <View style={styles.iconContainer}>
          <CreditCard size={22} color={colors.primary} />
        </View>

        {/* Text Info */}
        <View style={styles.infoCol}>
          <Text style={styles.heading}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Select Action Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSelectPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.actionBtn}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  infoCol: {
    flex: 1,
    marginRight: 12,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionBtn: {
    paddingVertical: 4,
  },
  actionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 18,
  },
});

export default PaymentMethodSelector;
