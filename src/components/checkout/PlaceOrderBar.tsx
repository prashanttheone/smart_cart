import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface PlaceOrderBarProps {
  totalAmount: number;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function PlaceOrderBar({
  totalAmount,
  onPress,
  isLoading = false,
  disabled = false,
}: PlaceOrderBarProps) {
  const formattedTotal = totalAmount.toFixed(2);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[styles.button, (disabled || isLoading) && styles.disabledButton]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.textInverse} size="small" />
        ) : (
          <Text style={styles.buttonText}>
            Place Order · ${formattedTotal}
          </Text>
        )}
      </TouchableOpacity>

      {/* Secure checkout info */}
      <View style={styles.secureRow}>
        <ShieldCheck size={14} color={colors.textSecondary} />
        <Text style={styles.secureText}>Secure checkout</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  secureText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default PlaceOrderBar;
