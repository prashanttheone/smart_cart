import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';

export interface ProductDeliveryWarrantyProps {
  shippingInformation?: string;
  warrantyInformation?: string;
  returnPolicy?: string;
}

export const ProductDeliveryWarranty: React.FC<ProductDeliveryWarrantyProps> = ({
  shippingInformation,
  warrantyInformation,
  returnPolicy,
}) => {
  return (
    <View style={styles.container}>
      {/* Shipping / Delivery */}
      <View style={styles.row}>
        <View style={[styles.iconWrapper, styles.truckIconWrapper]}>
          <Truck size={20} color={colors.primary} strokeWidth={2} />
        </View>
        <View style={styles.textContainer}>
          <Text weight="semiBold" size="sm" color="textPrimary">
            Shipping & Delivery
          </Text>
          <Text variant="caption" color="textSecondary">
            {shippingInformation || 'Standard delivery in 2-4 business days'}
          </Text>
        </View>
      </View>

      {/* Warranty */}
      <View style={styles.row}>
        <View style={[styles.iconWrapper, styles.warrantyIconWrapper]}>
          <ShieldCheck size={20} color="#10B981" strokeWidth={2} />
        </View>
        <View style={styles.textContainer}>
          <Text weight="semiBold" size="sm" color="textPrimary">
            Warranty Protection
          </Text>
          <Text variant="caption" color="textSecondary">
            {warrantyInformation || '1 Year Brand Warranty included'}
          </Text>
        </View>
      </View>

      {/* Return Policy */}
      <View style={[styles.row, styles.rowLast]}>
        <View style={[styles.iconWrapper, styles.returnIconWrapper]}>
          <RotateCcw size={20} color="#F59E0B" strokeWidth={2} />
        </View>
        <View style={styles.textContainer}>
          <Text weight="semiBold" size="sm" color="textPrimary">
            Return & Refund Policy
          </Text>
          <Text variant="caption" color="textSecondary">
            {returnPolicy || '7 Days Replacement Policy'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLast: {
    marginBottom: 0,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckIconWrapper: {
    backgroundColor: '#EFF6FF',
  },
  warrantyIconWrapper: {
    backgroundColor: '#ECFDF5',
  },
  returnIconWrapper: {
    backgroundColor: '#FFFBEB',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
});

export default ProductDeliveryWarranty;
