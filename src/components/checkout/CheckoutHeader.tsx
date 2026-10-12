import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

interface CheckoutHeaderProps {
  message?: string;
}

export function CheckoutHeader({
  message = 'Review your order before payment',
}: CheckoutHeaderProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  bannerText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default CheckoutHeader;
