import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Heart, ShoppingBag, ShoppingCart, Star, Trash2 } from 'lucide-react-native';

import { colors } from '../theme/colors';
import { Text, useToastModal } from '../components/ui';
import { useAppDispatch, useAppSelector } from '../store';
import {
  removeFromWishlist,
  clearWishlist,
  WishlistItem,
} from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { RootStackParamList } from '../navigation/types';

const WishlistScreenComponent: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { showConfirm, showToast } = useToastModal();

  const { items, totalCount } = useAppSelector((state) => state.wishlist);

  const handleProductPress = useCallback(
    (item: WishlistItem) => {
      navigation.navigate('ProductDetails', {
        productId: item.id,
        product: {
          id: item.id,
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
          description: '',
          category: item.category || '',
          brand: item.brand,
          rating: item.rating,
          discountPercentage: item.discountPercentage,
        },
      });
    },
    [navigation]
  );

  const handleRemove = useCallback(
    (item: WishlistItem) => {
      dispatch(removeFromWishlist(item.id));
      showToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: `${item.title} removed from saved items.`,
      });
    },
    [dispatch, showToast]
  );

  const handleAddToCart = useCallback(
    (item: WishlistItem) => {
      dispatch(
        addToCart({
          id: item.id,
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
          quantity: 1,
        })
      );
      showToast({
        type: 'success',
        title: 'Added to Cart',
        message: `${item.title} moved to your cart.`,
      });
    },
    [dispatch, showToast]
  );

  const handleClearAll = useCallback(() => {
    showConfirm({
      type: 'confirm',
      title: 'Clear Wishlist',
      message: 'Are you sure you want to remove all saved items from your wishlist?',
      confirmText: 'Clear All',
      confirmVariant: 'danger',
      cancelText: 'Cancel',
      onConfirm: () => {
        dispatch(clearWishlist());
        showToast({
          type: 'info',
          title: 'Wishlist Cleared',
          message: 'All items have been removed.',
        });
      },
    });
  }, [showConfirm, dispatch, showToast]);

  const keyExtractor = useCallback((item: WishlistItem) => item.id.toString(), []);

  const renderWishlistItem = useCallback(
    ({ item }: { item: WishlistItem }) => {
      const discount = item.discountPercentage ? Math.round(item.discountPercentage) : 0;
      const originalPrice =
        discount > 0 ? (item.price * 100) / (100 - discount) : null;

      return (
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => handleProductPress(item)}
          style={styles.card}
          accessibilityRole="button"
          accessibilityLabel={`View ${item.title}`}
        >
          {/* Product Image Area with Heart & Discount */}
          <View style={styles.imageContainer}>
            {discount > 0 && (
              <View style={styles.discountBadge}>
                <Text weight="bold" size="xs" style={styles.discountText}>
                  {discount}% OFF
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.removeHeartBtn}
              onPress={() => handleRemove(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={`Remove ${item.title} from wishlist`}
            >
              <Heart size={18} color="#EF4444" fill="#EF4444" strokeWidth={1.5} />
            </TouchableOpacity>

            <Image
              source={{ uri: item.thumbnail }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>

          {/* Product Details */}
          <View style={styles.cardDetails}>
            <Text weight="semiBold" size="sm" color="textPrimary" numberOfLines={1} style={styles.productTitle}>
              {item.title}
            </Text>

            {item.category ? (
              <Text variant="caption" color="textMuted" numberOfLines={1} style={styles.categoryText}>
                {item.category.toUpperCase()}
              </Text>
            ) : null}

            {/* Price & Rating */}
            <View style={styles.priceRow}>
              <View style={styles.priceContainer}>
                <Text weight="bold" size="base" color="textPrimary">
                  ${item.price.toFixed(2)}
                </Text>
                {originalPrice !== null && (
                  <Text variant="caption" color="textMuted" style={styles.originalPrice}>
                    ${originalPrice.toFixed(2)}
                  </Text>
                )}
              </View>

              {item.rating !== undefined && (
                <View style={styles.ratingBadge}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={1} />
                  <Text weight="semiBold" size="xs" color="textPrimary">
                    {item.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleAddToCart(item)}
              style={styles.addToCartBtn}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.title} to cart`}
            >
              <ShoppingCart size={15} color="#FFFFFF" strokeWidth={2.2} />
              <Text weight="bold" size="xs" color="textInverse">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }, [handleProductPress, handleRemove, handleAddToCart]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Safe Area Notch Bar with Pale Shadow Grey Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleCol}>
            <View style={styles.titleWithBadge}>
              <Text style={styles.headerTitle}>My Wishlist</Text>
              {totalCount > 0 && (
                <View style={styles.countBadge}>
                  <Text weight="bold" size="xs" color="primary">
                    {totalCount}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.headerSubtitle}>Items you have saved for later</Text>
          </View>

          {totalCount > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.clearBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Clear all wishlist items"
            >
              <Trash2 size={15} color={colors.danger} strokeWidth={2} />
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Heart size={40} color="#EF4444" fill="#FEE2E2" strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore our vast catalog and tap the heart icon on any product to save it here!
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('DrawerRoot' as any)}
          >
            <ShoppingBag size={18} color="#FFFFFF" strokeWidth={2} style={styles.exploreIcon} />
            <Text style={styles.exploreBtnText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={renderWishlistItem}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          updateCellsBatchingPeriod={50}
        />
      )}
    </View>
  );
};

export const WishlistScreen = React.memo(WishlistScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: '#f1f5f9', // Pale shadow grey for notch, battery & network readability
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
    justifyContent: 'space-between',
  },
  headerTitleCol: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  clearText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
    paddingBottom: 28,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    height: 125,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: {
    width: '85%',
    height: '85%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 2,
  },
  discountText: {
    color: '#FFFFFF',
  },
  removeHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardDetails: {
    padding: 10,
  },
  productTitle: {
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 11,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0A66FF',
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#0A66FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  exploreIcon: {
    marginRight: 8,
  },
  exploreBtnText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default WishlistScreen;
