import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
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

export const ProductGrid: React.FC<ProductGridProps> = ({
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

  // Flatten paginated pages into a single products array
  const products = data?.pages.flatMap((page) => page.products) ?? [];
  const totalCount = data?.pages[0]?.total;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderSectionHeader = () => (
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
  );

  const renderFooter = () => {
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

    return null;
  };

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
      keyExtractor={(item, index) => `${item.id}-${index}`}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          flex={true}
          currencySymbol={currencySymbol}
          onPress={onPressProduct}
        />
      )}
      ListHeaderComponent={renderSectionHeader}
      ListFooterComponent={renderFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
};

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
