import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  X,
  ArrowUpDown,
} from 'lucide-react-native';

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

type CategoryProductsScreenRouteProp = RouteProp<
  RootStackParamList,
  'CategoryProducts'
>;
type CategoryProductsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CategoryProducts'
>;

interface SortOption {
  id: string;
  label: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'default', label: 'Popular' },
  { id: 'price_asc', label: 'Price: Low to High', sortBy: 'price', order: 'asc' },
  { id: 'price_desc', label: 'Price: High to Low', sortBy: 'price', order: 'desc' },
  { id: 'discount', label: 'Top Deals', sortBy: 'discountPercentage', order: 'desc' },
  { id: 'rating', label: 'Top Rated', sortBy: 'rating', order: 'desc' },
];

export function CategoryProductsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CategoryProductsNavigationProp>();
  const route = useRoute<CategoryProductsScreenRouteProp>();

  // Redux Cart count
  const cartTotalCount = useAppSelector((state) => state.cart.totalCount);

  // Dynamic Categories from API
  const { data: categorySlugs = [] } = useCategoryListQuery();

  // Selected Category (from route params or first available)
  const initialCategory = route.params?.category || 'beauty';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Sort option state
  const [activeSort, setActiveSort] = useState<SortOption>(SORT_OPTIONS[0]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const renderHeader = () => (
    <View style={styles.headerExtraContent}>
      {/* Category Pills Switcher */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categorySlugs}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsList}
          renderItem={({ item: slug }) => {
            const isSelected = selectedCategory === slug;
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

      {/* Sorting / Filter Bar */}
      <View style={styles.sortBarContainer}>
        <View style={styles.sortLabelRow}>
          <ArrowUpDown size={14} color={colors.primary} />
          <Text variant="caption" weight="semiBold" color="textSecondary">
            SORT BY
          </Text>
        </View>

        <FlatList
          horizontal
          data={SORT_OPTIONS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortOptionsList}
          renderItem={({ item }) => {
            const isSelected = activeSort.id === item.id;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveSort(item)}
                style={[
                  styles.sortPill,
                  isSelected && styles.sortPillActive,
                ]}
              >
                <Text
                  variant="caption"
                  weight={isSelected ? 'bold' : 'regular'}
                  color={isSelected ? 'primary' : 'textSecondary'}
                  size="xs"
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Sticky Top Header with Back Button, Search Bar, and Cart Button */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 30 }]}>
        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.headerIconButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>

          {/* Search Input */}
          <View style={styles.headerSearchWrapper}>
            <Search
              size={18}
              color={colors.textSecondary}
              strokeWidth={2}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.headerSearchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if (searchQuery.trim()) {
                  navigation.navigate('Search', { initialQuery: searchQuery.trim() });
                }
              }}
              placeholder={`Search in ${formatCategoryName(selectedCategory)}...`}
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.searchClearBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={15} color={colors.textSecondary} strokeWidth={2.2} />
              </TouchableOpacity>
            )}
          </View>

          {/* Cart Button with Count Badge */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Cart')}
            style={styles.headerIconButton}
            accessibilityRole="button"
            accessibilityLabel={`Cart with ${cartTotalCount} items`}
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
      </View>

      {/* 2-Column Product Grid with Auto Infinite Pagination */}
      <ProductGrid
        category={selectedCategory}
        limit={10}
        title={formatCategoryName(selectedCategory)}
        onPressProduct={handleProductPress}
        ListHeaderComponent={renderHeader()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: '#f1f5f9', // Faded shadow grey for notch & status bar readability
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  headerSearchWrapper: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 4,
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
  headerExtraContent: {
    backgroundColor: colors.surface,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesContainer: {
    paddingVertical: 10,
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
  sortBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortOptionsList: {
    gap: 6,
    paddingRight: 16,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
});

export default CategoryProductsScreen;
