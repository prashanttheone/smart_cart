import React, { useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { Text } from './ui/Text';
import { ProductCard } from './ProductCard';
import {
  useInfiniteProductsQuery,
  Product,
} from '../services/query/productQueries';

export interface ProductGridProps {
  /**
   * Optional category slug filter
   */
  category?: string;

  /**
   * Number of items to fetch per page
   * @default 10
   */
  limit?: number;

  /**
   * Section title
   * @default 'All Products'
   */
  title?: string;

  /**
   * Currency symbol
   * @default '₹'
   */
  currencySymbol?: string;

  /**
   * Callback when a product card is clicked (opens ProductDetailsScreen)
   */
  onPressProduct?: (product: Product) => void;

  /**
   * Header component rendered at the top of the grid scroll view
   */
  ListHeaderComponent?: React.ReactElement | null;

  /**
   * Custom style for the FlatList contentContainerStyle
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const ProductGridComponent: React.FC<ProductGridProps> = ({
  category,
  limit = 10,
  title = 'All Products',
  currencySymbol = '₹',
  onPressProduct,
  ListHeaderComponent,
  contentContainerStyle,
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteProductsQuery({ limit, category });

  // Flatten paginated pages into a single products array with stable reference
  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data?.pages]
  );
  const totalCount = data?.pages[0]?.total;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Stable key extractor using unique product IDs, avoiding array indices
  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  // Stable renderItem callback to avoid re-instantiating item callbacks on every render
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        flex={true}
        currencySymbol={currencySymbol}
        onPress={onPressProduct}
      />
    ),
    [currencySymbol, onPressProduct]
  );

  // Memoized header element to prevent remounting/re-rendering list header
  const sectionHeaderElement = useMemo(
    () => (
      <>
        {ListHeaderComponent}
        <View style={styles.sectionHeader}>
          <View style={styles.titleRow}>
            <Text weight="bold" size="xl" color="textPrimary">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : title}
            </Text>
            {totalCount !== undefined && (
              <View style={styles.countBadge}>
                <Text weight="semiBold" size="xs" color="primary">
                  {totalCount} items
                </Text>
              </View>
            )}
          </View>
          <Text variant="caption" color="textMuted">
            Showing {products.length} of {totalCount ?? '...'} products
          </Text>
        </View>
      </>
    ),
    [ListHeaderComponent, category, title, totalCount, products.length]
  );

  // Memoized footer element
  const footerElement = useMemo(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text variant="caption" color="textSecondary" style={styles.footerLoaderText}>
            Loading more products...
          </Text>
        </View>
      );
    }

    if (!hasNextPage && products.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <Text variant="caption" color="textMuted" align="center">
            ✓ You've viewed all {products.length} products
          </Text>
        </View>
      );
    }

    return undefined;
  }, [isFetchingNextPage, hasNextPage, products.length]);

  if (isLoading && products.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeaderComponent}
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="caption" color="textSecondary" style={styles.loadingText}>
            Loading products...
          </Text>
        </View>
      </View>
    );
  }

  if (isError && products.length === 0) {
    return (
      <View style={styles.container}>
        {ListHeaderComponent}
        <View style={styles.centerBox}>
          <Text variant="title" color="danger" align="center">
            Failed to load products
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => refetch()}
            style={styles.retryBtn}
          >
            <Text weight="semiBold" color="textInverse">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={keyExtractor}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={renderItem}
      ListHeaderComponent={sectionHeaderElement}
      ListFooterComponent={footerElement}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      // FlatList Virtualization & Batching Performance Tuning:
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews={Platform.OS === 'android'}
      updateCellsBatchingPeriod={50}
    />
  );
};

export const ProductGrid = React.memo(ProductGridComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  columnWrapper: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 14,
  },
  centerBox: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  retryBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  footerLoader: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerLoaderText: {
    marginLeft: 6,
  },
  footerEnd: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

export default ProductGrid;
