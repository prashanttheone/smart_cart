import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Star, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';
import { ProductReview } from '../../services/query/productQueries';

// Enable LayoutAnimation for Android native collapsible transitions
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface ProductReviewsSectionProps {
  reviews?: ProductReview[];
  defaultExpanded?: boolean;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  reviews,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  };

  // Star ratings distribution (5 to 1)
  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = Math.round((count / reviews.length) * 100);
    return { stars, count, percentage };
  });

  return (
    <View style={styles.container}>
      {/* Accordion Header - Bold & Highlighted with Left Accent Bar */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpand}
        style={[
          styles.accordionHeader,
          isExpanded && styles.accordionHeaderExpanded,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Customer Reviews accordion, ${
          isExpanded ? 'expanded' : 'collapsed'
        }`}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.headerLeft}>
          <View style={styles.highlightBar} />
          <View style={styles.iconCircle}>
            <MessageSquare size={16} color={colors.primary} />
          </View>
          <View style={styles.titleColumn}>
            <View style={styles.titleRow}>
              <Text
                weight="bold"
                size="base"
                color="textPrimary"
                style={styles.highlightedTitle}
              >
                Customer Reviews
              </Text>
              <View style={styles.countBadge}>
                <Text weight="bold" size="xs" style={styles.countBadgeText}>
                  {reviews.length}
                </Text>
              </View>
            </View>
            <Text variant="caption" color="textMuted" size="xs">
              Ratings & feedback summary
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.avgBadge}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={1} />
            <Text weight="bold" size="xs" style={styles.avgText}>
              {averageRating}
            </Text>
          </View>
          <View style={[styles.chevronWrapper, isExpanded && styles.chevronWrapperActive]}>
            {isExpanded ? (
              <ChevronUp size={18} color={colors.primary} strokeWidth={2.4} />
            ) : (
              <ChevronDown size={18} color={colors.textSecondary} strokeWidth={2.4} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Accordion Collapsible Body */}
      {isExpanded && (
        <View style={styles.contentBody}>
          {/* Summary Breakdown Card */}
          <View style={styles.summaryCard}>
            <View style={styles.bigScoreBox}>
              <Text weight="bold" size="2xl" color="textPrimary">
                {averageRating}
              </Text>
              <View style={styles.starsRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`avg-star-${i}`}
                    size={13}
                    color="#F59E0B"
                    fill={i < Math.round(Number(averageRating)) ? '#F59E0B' : 'transparent'}
                    strokeWidth={1}
                  />
                ))}
              </View>
              <Text variant="caption" color="textMuted" size="xs">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </Text>
            </View>

            {/* Distribution Bars */}
            <View style={styles.barsContainer}>
              {starCounts.map(({ stars, percentage }) => (
                <View key={`dist-${stars}`} style={styles.barRow}>
                  <Text variant="caption" color="textMuted" size="xs" style={styles.starLabel}>
                    {stars}★
                  </Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                  <Text variant="caption" color="textMuted" size="xs" style={styles.percentLabel}>
                    {percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Individual Reviews List */}
          <View style={styles.reviewsList}>
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
                        <Text
                          variant="caption"
                          weight="medium"
                          style={styles.verifiedText}
                        >
                          ✓ Verified Buyer
                        </Text>
                        {formattedDate ? (
                          <Text variant="caption" color="textMuted" size="xs">
                            • {formattedDate}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.ratingStarsBadge}>
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  accordionHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FAFDFE',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  highlightBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightedTitle: {
    letterSpacing: -0.2,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  countBadgeText: {
    color: colors.primary,
  },
  headerRight: {
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
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  avgText: {
    color: '#92400E',
  },
  chevronWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronWrapperActive: {
    backgroundColor: '#EFF6FF',
  },
  contentBody: {
    padding: 16,
    paddingTop: 14,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    gap: 16,
  },
  bigScoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    minWidth: 72,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  barsContainer: {
    flex: 1,
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starLabel: {
    width: 20,
    fontSize: 10,
  },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  percentLabel: {
    width: 28,
    textAlign: 'right',
    fontSize: 10,
  },
  reviewsList: {
    gap: 0,
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
  ratingStarsBadge: {
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
