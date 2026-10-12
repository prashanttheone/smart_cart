import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShoppingCart, LayoutGrid } from 'lucide-react-native';

import { colors } from '../theme/colors';
import { Text } from '../components/ui/Text';
import { ProductGrid } from '../components/ProductGrid';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';
import {
  useCategoryListQuery,
  formatCategoryName,
} from '../services/query/categoryQueries';
import { Product } from '../services/query/productQueries';

type CategoriesScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

export function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CategoriesScreenNavProp>();
  const cartTotalCount = useAppSelector((state) => state.cart.totalCount);

  // Dynamic Categories from API
  const { data: categorySlugs = [], isLoading } = useCategoryListQuery();
  const [selectedCategory, setSelectedCategory] = useState<string>('beauty');

  const activeCategory =
    selectedCategory || (categorySlugs.length > 0 ? categorySlugs[0] : 'beauty');

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Category Pills Slider */}
      <FlatList
        horizontal
        data={categorySlugs}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryPillsList}
        renderItem={({ item: slug }) => {
          const isSelected = activeCategory === slug;
          const displayName = formatCategoryName(slug);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(slug)}
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Category ${displayName}`}
            >
              <Text
                weight={isSelected ? 'bold' : 'medium'}
                size="xs"
                color={isSelected ? 'textInverse' : 'textPrimary'}
              >
                {displayName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.titleRow}>
          <View style={styles.titleIconBox}>
            <LayoutGrid size={20} color={colors.primary} />
          </View>
          <View>
            <Text weight="bold" size="lg" color="textPrimary">
              Categories
            </Text>
            <Text variant="caption" color="textMuted" size="xs">
              Explore by department
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartBtn}
          accessibilityRole="button"
          accessibilityLabel={`Shopping cart with ${cartTotalCount} items`}
        >
          <ShoppingCart size={22} color={colors.textPrimary} strokeWidth={2} />
          {cartTotalCount > 0 && (
            <View style={styles.cartBadge}>
              <Text weight="bold" style={styles.cartBadgeText}>
                {cartTotalCount > 99 ? '99+' : cartTotalCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Loading state for categories */}
      {isLoading && categorySlugs.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="caption" color="textSecondary" style={styles.loadingText}>
            Loading categories...
          </Text>
        </View>
      ) : (
        /* 2-Column Product Grid by Selected Category */
        <ProductGrid
          category={activeCategory}
          limit={10}
          title={formatCategoryName(activeCategory)}
          onPressProduct={handleProductPress}
          ListHeaderComponent={renderHeader()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    lineHeight: 11,
  },
  headerContent: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryPillsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
});

export default CategoriesScreen;
