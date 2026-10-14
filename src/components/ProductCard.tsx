import React, { useCallback, useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Star, Plus, Heart } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Text } from './ui/Text';
import { Product } from '../services/query/productQueries';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { analyticsService } from '../services/firebase';

export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  currencySymbol?: string;
  cardWidth?: number;
  flex?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  currencySymbol = '₹',
  cardWidth = 168,
  flex = false,
  style,
}) => {
  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id)
  );

  // Fast scalar computations without per-card hook allocation overhead
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
  const originalPrice = discount > 0 ? (product.price * 100) / (100 - discount) : null;
  const formattedPrice =
    typeof product.price === 'number'
      ? product.price % 1 === 0
        ? product.price.toString()
        : product.price.toFixed(2)
      : product.price;
  const formattedOriginalPrice =
    originalPrice !== null
      ? originalPrice % 1 === 0
        ? Math.round(originalPrice).toString()
        : originalPrice.toFixed(2)
      : null;

  const handleAddToCart = useCallback(() => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        })
      );
    }
    analyticsService.logAddToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      category: product.category,
    });
  }, [onAddToCart, product, dispatch]);

  const handleToggleWishlist = useCallback(() => {
    dispatch(
      toggleWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
        brand: product.brand,
        rating: product.rating,
        discountPercentage: product.discountPercentage,
      })
    );
    if (!isInWishlist) {
      analyticsService.logAddToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
      });
    }
  }, [dispatch, product, isInWishlist]);

  const handlePress = useCallback(() => {
    onPress?.(product);
  }, [onPress, product]);

  const formattedSubtitle =
    product.weight && product.weight > 0
      ? `${product.weight} kg`
      : product.brand || product.category;
  const formattedRating = product.rating ? product.rating.toFixed(1) : '4.5';
  const reviewsCount = product.reviews?.length ? `${product.reviews.length * 400}+` : '1.2k';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[styles.card, flex ? styles.flexCard : { width: cardWidth }, style]}
      accessibilityRole="button"
      accessibilityLabel={`Product ${product.title}`}
    >
      {/* Product Image Area with Discount Badge */}
      <View style={styles.imageWrapper}>
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text weight="bold" size="xs" style={styles.discountText}>
              {discount}% OFF
            </Text>
          </View>
        )}

        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Wishlist Toggle Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleWishlist}
          style={styles.wishlistBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={
            isInWishlist
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
        >
          <Heart
            size={16}
            color={isInWishlist ? '#EF4444' : colors.textMuted}
            fill={isInWishlist ? '#EF4444' : 'transparent'}
            strokeWidth={1.8}
          />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <View style={styles.details}>
        {/* Title */}
        <Text weight="semiBold" size="sm" color="textPrimary" numberOfLines={1} style={styles.title}>
          {product.title}
        </Text>

        {/* Subtitle / Unit */}
        <Text variant="caption" color="textMuted" numberOfLines={1} style={styles.subtitle}>
          {formattedSubtitle}
        </Text>

        {/* Price & Add to Cart Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text weight="bold" size="base" color="textPrimary">
              {currencySymbol}{formattedPrice}
            </Text>
            {formattedOriginalPrice !== null && (
              <Text variant="caption" color="textMuted" style={styles.originalPrice}>
                {currencySymbol}{formattedOriginalPrice}
              </Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleAddToCart}
            style={styles.addButton}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.title} to cart`}
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.6} />
          </TouchableOpacity>
        </View>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <Star size={13} color="#F59E0B" fill="#F59E0B" strokeWidth={1} />
          <Text weight="semiBold" size="xs" color="textPrimary" style={styles.ratingText}>
            {formattedRating}
          </Text>
          <Text variant="caption" color="textMuted" size="xs">
            ({reviewsCount})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ProductCard = React.memo(
  ProductCardComponent,
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.product.price === next.product.price &&
    prev.product.title === next.product.title &&
    prev.product.thumbnail === next.product.thumbnail &&
    prev.product.discountPercentage === next.product.discountPercentage &&
    prev.product.rating === next.product.rating &&
    prev.flex === next.flex &&
    prev.cardWidth === next.cardWidth &&
    prev.currencySymbol === next.currencySymbol &&
    prev.onPress === next.onPress &&
    prev.onAddToCart === next.onAddToCart
);

const styles = StyleSheet.create({
  card: {
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
  flexCard: {
    flex: 1,
  },
  imageWrapper: {
    height: 125,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    padding: 10,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 11,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#0A66FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A66FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
  },
});

export default ProductCard;
