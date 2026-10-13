import React, { useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { Text } from './ui/Text';
import { ProductCard } from './ProductCard';
import { useDealsOfTheDayQuery, Product } from '../services/query/productQueries';

export interface DealsOfTheDayProps {
  /**
   * Title of the section
   * @default 'Deals of the Day'
   */
  title?: string;

  /**
   * Limit number of products to fetch
   * @default 10
   */
  limit?: number;

  /**
   * Whether to show "See All" button
   * @default false
   */
  showSeeAll?: boolean;

  /**
   * Callback fired when "See All" is pressed
   */
  onPressSeeAll?: () => void;

  /**
   * Callback fired when a product card is pressed
   */
  onPressProduct?: (product: Product) => void;

  /**
   * Currency symbol (e.g. '₹', '$')
   * @default '₹'
   */
  currencySymbol?: string;

  /**
   * Outer container style override
   */
  style?: StyleProp<ViewStyle>;
}

const DealsOfTheDayComponent: React.FC<DealsOfTheDayProps> = ({
  title = 'Deals of the Day',
  limit = 10,
  showSeeAll = false,
  onPressSeeAll,
  onPressProduct,
  currencySymbol = '₹',
  style,
}) => {
  const { data, isLoading, isError, refetch } = useDealsOfTheDayQuery(limit);

  const products = useMemo(() => data?.products || [], [data?.products]);

  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={onPressProduct}
        currencySymbol={currencySymbol}
      />
    ),
    [onPressProduct, currencySymbol]
  );

  return (
    <View style={[styles.container, style]}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text weight="bold" size="xl" color="textPrimary">
          {title}
        </Text>

        {showSeeAll && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressSeeAll}
            accessibilityRole="button"
            accessibilityLabel={`See all ${title}`}
          >
            <Text weight="semiBold" size="sm" style={styles.seeAllText}>
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text variant="caption" color="danger" align="center">
            Failed to load deals
          </Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <Text weight="semiBold" size="xs" color="primary">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Horizontal Deals List */
        <FlatList
          horizontal
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={3}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      )}
    </View>
  );
};

export const DealsOfTheDay = React.memo(DealsOfTheDayComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAllText: {
    color: '#0A66FF',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  loadingContainer: {
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
});

export default DealsOfTheDay;
