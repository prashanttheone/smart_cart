import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';

export interface ProductPriceSectionProps {
  price: number;
  discountPercentage?: number;
  availabilityStatus?: string;
  stock?: number;
  minimumOrderQuantity?: number;
  currencySymbol?: string;
}

export const ProductPriceSection: React.FC<ProductPriceSectionProps> = ({
  price,
  discountPercentage,
  availabilityStatus,
  stock,
  minimumOrderQuantity,
  currencySymbol = '$',
}) => {
  const discount = discountPercentage ? Number(discountPercentage.toFixed(1)) : 0;
  const originalPriceNum =
    discount > 0 ? (price * 100) / (100 - discount) : null;

  const formattedPrice =
    typeof price === 'number'
      ? price % 1 === 0
        ? price.toString()
        : price.toFixed(2)
      : price;

  const formattedOriginalPrice =
    originalPriceNum !== null ? originalPriceNum.toFixed(2) : null;

  const savingsNum =
    originalPriceNum !== null
      ? (originalPriceNum - price).toFixed(2)
      : null;

  const isLowStock = stock !== undefined && stock > 0 && stock <= 10;
  const isOutOfStock = stock !== undefined && stock === 0;

  return (
    <View style={styles.container}>
      {/* Price & Savings Row */}
      <View style={styles.row}>
        <View style={styles.priceLeft}>
          <Text weight="bold" size="2xl" color="textPrimary">
            {currencySymbol}{formattedPrice}
          </Text>
          {formattedOriginalPrice !== null && (
            <Text variant="caption" color="textMuted" style={styles.originalPrice}>
              {currencySymbol}{formattedOriginalPrice}
            </Text>
          )}
          {discount > 0 && (
            <View style={styles.saveBadge}>
              <Text weight="semiBold" size="xs" style={styles.saveBadgeText}>
                {discount}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Availability Badge */}
        <View
          style={[
            styles.stockPill,
            isOutOfStock && styles.stockPillOut,
            isLowStock && styles.stockPillLow,
          ]}
        >
          <View
            style={[
              styles.stockDot,
              isOutOfStock && styles.stockDotOut,
              isLowStock && styles.stockDotLow,
            ]}
          />
          <Text
            weight="medium"
            size="xs"
            color={isOutOfStock ? 'danger' : isLowStock ? 'accent' : 'secondary'}
          >
            {availabilityStatus ||
              (isOutOfStock
                ? 'Out of Stock'
                : isLowStock
                ? `Only ${stock} left!`
                : 'In Stock')}
          </Text>
        </View>
      </View>

      {/* Stock count and minimum order info */}
      <View style={styles.subInfoRow}>
        {stock !== undefined && stock > 0 && (
          <Text variant="caption" color="textSecondary">
            {stock} units in stock
          </Text>
        )}
        {minimumOrderQuantity !== undefined && minimumOrderQuantity > 1 && (
          <View style={styles.moqBadge}>
            <Text variant="caption" weight="semiBold" color="primary">
              Min. Order: {minimumOrderQuantity} units
            </Text>
          </View>
        )}
      </View>

      {/* Taxes & Savings Note */}
      <View style={styles.footerNote}>
        <Text variant="caption" color="textMuted">
          Inclusive of all taxes
        </Text>
        {savingsNum !== null && (
          <Text variant="caption" weight="semiBold" color="secondary">
            You save {currencySymbol}{savingsNum}
          </Text>
        )}
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexWrap: 'wrap',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 14,
  },
  saveBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: {
    color: '#15803D',
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockPillLow: {
    backgroundColor: '#FFFBEB',
  },
  stockPillOut: {
    backgroundColor: '#FEF2F2',
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  stockDotLow: {
    backgroundColor: '#F59E0B',
  },
  stockDotOut: {
    backgroundColor: '#EF4444',
  },
  subInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moqBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  footerNote: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});

export default ProductPriceSection;
