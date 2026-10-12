import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';
import { ProductDimensions } from '../../services/query/productQueries';

export interface ProductSpecificationsProps {
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  category?: string;
  minimumOrderQuantity?: number;
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  sku,
  weight,
  dimensions,
  category,
  minimumOrderQuantity,
}) => {
  return (
    <View style={styles.container}>
      <Text weight="bold" size="base" color="textPrimary" style={styles.title}>
        Product Specifications
      </Text>

      {sku && (
        <View style={styles.specRow}>
          <Text variant="caption" color="textMuted" style={styles.specLabel}>
            SKU Code
          </Text>
          <Text variant="caption" weight="medium" color="textPrimary">
            {sku}
          </Text>
        </View>
      )}

      {weight !== undefined && weight > 0 && (
        <View style={styles.specRow}>
          <Text variant="caption" color="textMuted" style={styles.specLabel}>
            Item Weight
          </Text>
          <Text variant="caption" weight="medium" color="textPrimary">
            {weight >= 1000 ? `${(weight / 1000).toFixed(1)} kg` : `${weight} g`}
          </Text>
        </View>
      )}

      {dimensions && (
        <View style={styles.specRow}>
          <Text variant="caption" color="textMuted" style={styles.specLabel}>
            Dimensions (W × H × D)
          </Text>
          <Text variant="caption" weight="medium" color="textPrimary">
            {dimensions.width} × {dimensions.height} × {dimensions.depth} cm
          </Text>
        </View>
      )}

      {category && (
        <View style={styles.specRow}>
          <Text variant="caption" color="textMuted" style={styles.specLabel}>
            Category
          </Text>
          <Text variant="caption" weight="medium" color="textPrimary">
            {category}
          </Text>
        </View>
      )}

      {minimumOrderQuantity !== undefined && minimumOrderQuantity > 1 && (
        <View style={[styles.specRow, styles.specRowLast]}>
          <Text variant="caption" color="textMuted" style={styles.specLabel}>
            Min. Order Qty
          </Text>
          <Text variant="caption" weight="medium" color="primary">
            {minimumOrderQuantity} units
          </Text>
        </View>
      )}
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
  title: {
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  specLabel: {
    fontSize: 13,
  },
});

export default ProductSpecifications;
