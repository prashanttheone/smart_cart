import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Star, MessageSquare } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';
import { ProductReview } from '../../services/query/productQueries';

export interface ProductReviewsSectionProps {
  reviews?: ProductReview[];
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  reviews,
}) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <View style={styles.container}>
      {/* Header with Average Rating */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MessageSquare size={18} color={colors.primary} />
          <Text weight="bold" size="base" color="textPrimary">
            Customer Reviews ({reviews.length})
          </Text>
        </View>

        <View style={styles.avgBadge}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={1} />
          <Text weight="semiBold" size="xs" style={styles.avgText}>
            {averageRating} / 5
          </Text>
        </View>
      </View>

      {/* Reviews List */}
      {reviews.map((rev, idx) => {
        const isLast = idx === reviews.length - 1;
        const formattedDate = rev.date
          ? new Date(rev.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '';

        return (
          <View
            key={`review-${idx}-${rev.reviewerName}`}
            style={[styles.reviewItem, isLast && styles.reviewItemLast]}
          >
            <View style={styles.reviewHeader}>
              <View>
                <Text weight="semiBold" size="sm" color="textPrimary">
                  {rev.reviewerName}
                </Text>
                <View style={styles.verifiedRow}>
                  <Text variant="caption" weight="medium" style={styles.verifiedText}>
                    ✓ Verified Buyer
                  </Text>
                  {formattedDate ? (
                    <Text variant="caption" color="textMuted" size="xs">
                      • {formattedDate}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.ratingBadge}>
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <Star
                    key={`star-${starIdx}`}
                    size={11}
                    color="#F59E0B"
                    fill={starIdx < rev.rating ? '#F59E0B' : 'transparent'}
                    strokeWidth={1}
                  />
                ))}
              </View>
            </View>

            <Text variant="body" color="textSecondary" style={styles.comment}>
              "{rev.comment}"
            </Text>
          </View>
        );
      })}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  avgText: {
    color: '#92400E',
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reviewItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    gap: 2,
    paddingTop: 2,
  },
  comment: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 11,
  },
});

export default ProductReviewsSection;
