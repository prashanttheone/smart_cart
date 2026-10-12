import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CreditCard, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { PaymentMethod } from '../../store/slices/checkoutSlice';
import { PaymentMethodBottomSheet } from './PaymentMethodBottomSheet';

export interface PaymentMethodSelectorProps {
  paymentMethods?: PaymentMethod[];
  selectedPaymentMethodId?: string;
  onSelectPaymentMethod?: (item: PaymentMethod) => void;
  title?: string;
  subtitle?: string;
  actionText?: string;
  onSelectPress?: () => void;
}

export function PaymentMethodSelector({
  paymentMethods = [],
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  title = 'Payment Method',
  subtitle = 'UPI, cards, or Cash on Delivery',
  actionText = 'Select',
  onSelectPress,
}: PaymentMethodSelectorProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const activeMethod =
    paymentMethods.find((p) => p.id === selectedPaymentMethodId) ||
    paymentMethods[0] || {
      id: 'default',
      type: 'all' as const,
      title,
      subtitle,
    };

  const handleOpenSheet = () => {
    if (onSelectPress) {
      onSelectPress();
    } else {
      setIsSheetOpen(true);
    }
  };

  const handleSelectFromSheet = (selected: PaymentMethod) => {
    onSelectPaymentMethod?.(selected);
    setIsSheetOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={handleOpenSheet}
        style={styles.cardRow}
      >
        {/* Soft blue card icon */}
        <View style={styles.iconBox}>
          <CreditCard size={22} color={colors.primary} />
        </View>

        {/* Text Info */}
        <View style={styles.infoCol}>
          <Text style={styles.heading}>{activeMethod.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {activeMethod.subtitle}
          </Text>
        </View>

        {/* Select Action Button */}
        <View style={styles.actionWrapper}>
          <Text style={styles.actionText}>{actionText}</Text>
          <ChevronRight size={15} color={colors.primary} strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Custom Drawer / Bottom Sheet for Payment Selection */}
      <PaymentMethodBottomSheet
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        paymentMethods={paymentMethods}
        selectedPaymentMethodId={activeMethod.id}
        onSelectPaymentMethod={handleSelectFromSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoCol: {
    flex: 1,
    marginRight: 10,
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
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 2,
  },
  actionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 18,
  },
});

export default PaymentMethodSelector;
