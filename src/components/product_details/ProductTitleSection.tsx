import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';

export interface ProductTitleSectionProps {
  title: string;
  brand?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

export const ProductTitleSection: React.FC<ProductTitleSectionProps> = ({
  title,
  brand,
  category,
  rating,
  reviewCount = 0,
}) => {
  return (
    <View style={styles.container}>
      {/* Category Pill & Rating Badge */}
      <View style={styles.metaRow}>
        <View style={styles.categoryPill}>
          <Text weight="semiBold" size="xs" style={styles.categoryPillText}>
            {category.toUpperCase()}
          </Text>
        </View>

        {rating !== undefined && (
          <View style={styles.ratingBadge}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" strokeWidth={1} />
            <Text weight="semiBold" size="xs" style={styles.ratingScore}>
              {rating.toFixed(1)}
            </Text>
            <Text variant="caption" color="textMuted" size="xs">
              ({reviewCount} reviews)
            </Text>
          </View>
        )}
      </View>

      {/* Product Title */}
      <Text weight="bold" size="xl" color="textPrimary" style={styles.title}>
        {title}
      </Text>

      {/* Brand */}
      {brand ? (
        <Text variant="caption" color="textSecondary" style={styles.brand}>
          Brand: <Text weight="semiBold" color="primary">{brand}</Text>
        </Text>
      ) : null}
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryPillText: {
    color: colors.primary,
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingScore: {
    color: '#92400E',
  },
  title: {
    marginBottom: 6,
    lineHeight: 28,
  },
  brand: {
    marginTop: 2,
  },
});

export default ProductTitleSection;
