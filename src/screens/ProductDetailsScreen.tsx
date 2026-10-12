import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  X,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
} from 'lucide-react-native';

import { colors } from '../theme/colors';
import { Text } from '../components/ui/Text';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart, updateQuantity } from '../store/slices/cartSlice';
import { useProductByIdQuery } from '../services/query/productQueries';

type ProductDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetails'
>;
type ProductDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductDetails'
>;

export function ProductDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProductDetailsNavigationProp>();
  const route = useRoute<ProductDetailsScreenRouteProp>();
  const dispatch = useAppDispatch();

  const { product: initialProduct, productId: routeProductId } = route.params || {};
  const targetId = routeProductId ?? initialProduct?.id;

  // Search input inside header
  const [searchQuery, setSearchQuery] = useState('');

  // Active gallery image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Redux cart state
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartTotalCount = useAppSelector((state) => state.cart.totalCount);

  // Fetch product by ID with TanStack Query
  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useProductByIdQuery(targetId, initialProduct);

  const product = productData || initialProduct;

  // Check if current product is already in cart
  const currentCartItem = product
    ? cartItems.find((item) => item.id === product.id)
    : undefined;
  const currentCartQty = currentCartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      })
    );
  };

  const handleIncrement = () => {
    if (!product) return;
    dispatch(
      updateQuantity({
        id: product.id,
        quantity: currentCartQty + 1,
      })
    );
  };

  const handleDecrement = () => {
    if (!product) return;
    dispatch(
      updateQuantity({
        id: product.id,
        quantity: currentCartQty - 1,
      })
    );
  };

  // Pricing calculations
  const discount = product?.discountPercentage
    ? Math.round(product.discountPercentage)
    : 0;

  const originalPrice =
    product && discount > 0
      ? Math.round((product.price * 100) / (100 - discount))
      : null;

  const galleryImages =
    product?.images && product.images.length > 0
      ? product.images
      : product?.thumbnail
      ? [product.thumbnail]
      : [];

  const activeImageUri =
    galleryImages[selectedImageIndex] || product?.thumbnail || '';

  return (
    <View style={styles.container}>
      {/* Custom Sticky Header with Back button, Search bar, and Cart button */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}>
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

          {/* Search Bar in Header */}
          <View style={styles.headerSearchWrapper}>
            <Search size={18} color={colors.textMuted} strokeWidth={2} style={styles.searchIcon} />
            <TextInput
              style={styles.headerSearchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search in SmartCart..."
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

      {/* Screen Body */}
      {isLoading && !product ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="caption" color="textSecondary" style={styles.loadingText}>
            Loading product details...
          </Text>
        </View>
      ) : isError && !product ? (
        <View style={styles.centerContainer}>
          <Text variant="title" color="danger" align="center">
            Product Not Found
          </Text>
          <Text variant="body" color="textSecondary" align="center" style={styles.errorSub}>
            Unable to load product information. Please try again.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            <Text weight="semiBold" color="textInverse">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : product ? (
        <>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 84 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Image Gallery Area */}
            <View style={styles.imageGalleryContainer}>
              {discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text weight="bold" size="xs" style={styles.discountText}>
                    {discount}% OFF
                  </Text>
                </View>
              )}

              <Image
                source={{ uri: activeImageUri }}
                style={styles.mainImage}
                resizeMode="contain"
              />

              {/* Horizontal Thumbnails if multiple images */}
              {galleryImages.length > 1 && (
                <FlatList
                  horizontal
                  data={galleryImages}
                  keyExtractor={(_, index) => `img-${index}`}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbnailList}
                  renderItem={({ item: imgUri, index }) => {
                    const isSelected = selectedImageIndex === index;
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setSelectedImageIndex(index)}
                        style={[
                          styles.thumbnailWrapper,
                          isSelected && styles.thumbnailActive,
                        ]}
                      >
                        <Image
                          source={{ uri: imgUri }}
                          style={styles.thumbnailImage}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>

            {/* Product Core Details Card */}
            <View style={styles.detailsCard}>
              {/* Category & Rating Row */}
              <View style={styles.metaRow}>
                <View style={styles.categoryPill}>
                  <Text weight="semiBold" size="xs" style={styles.categoryPillText}>
                    {product.category?.toUpperCase()}
                  </Text>
                </View>

                {product.rating && (
                  <View style={styles.ratingBadge}>
                    <Star size={13} color="#F59E0B" fill="#F59E0B" strokeWidth={1} />
                    <Text weight="semiBold" size="xs" style={styles.ratingScore}>
                      {product.rating.toFixed(1)}
                    </Text>
                    <Text variant="caption" color="textMuted" size="xs">
                      ({product.reviews?.length || 12} reviews)
                    </Text>
                  </View>
                )}
              </View>

              {/* Product Title & Brand */}
              <Text weight="bold" size="xl" color="textPrimary" style={styles.productTitle}>
                {product.title}
              </Text>

              {product.brand && (
                <Text variant="caption" color="textSecondary" style={styles.brandText}>
                  Brand: <Text weight="semiBold" color="primary">{product.brand}</Text>
                </Text>
              )}

              {/* Price Row */}
              <View style={styles.priceRow}>
                <View style={styles.priceLeft}>
                  <Text weight="bold" size="2xl" color="textPrimary">
                    ₹{product.price}
                  </Text>
                  {originalPrice !== null && (
                    <Text variant="caption" color="textMuted" style={styles.originalPriceText}>
                      ₹{originalPrice}
                    </Text>
                  )}
                  {discount > 0 && (
                    <View style={styles.saveBadge}>
                      <Text weight="semiBold" size="xs" style={styles.saveBadgeText}>
                        Save {discount}%
                      </Text>
                    </View>
                  )}
                </View>

                {/* Stock Status */}
                <View style={styles.stockPill}>
                  <View style={styles.stockDot} />
                  <Text weight="medium" size="xs" color="secondary">
                    {product.availabilityStatus ||
                      (product.stock && product.stock > 0 ? 'In Stock' : 'Available')}
                  </Text>
                </View>
              </View>

              <Text variant="caption" color="textMuted" style={styles.taxNote}>
                Inclusive of all taxes • Fast delivery
              </Text>
            </View>

            {/* Highlights & Features Grid */}
            <View style={styles.highlightsGrid}>
              <View style={styles.highlightItem}>
                <Truck size={18} color={colors.primary} strokeWidth={2} />
                <View style={styles.highlightTextContainer}>
                  <Text weight="semiBold" size="xs" color="textPrimary">
                    Fast Delivery
                  </Text>
                  <Text variant="caption" color="textMuted" size="xs">
                    {product.shippingInformation || 'Ships in 1-2 business days'}
                  </Text>
                </View>
              </View>

              <View style={styles.highlightItem}>
                <ShieldCheck size={18} color="#10B981" strokeWidth={2} />
                <View style={styles.highlightTextContainer}>
                  <Text weight="semiBold" size="xs" color="textPrimary">
                    Warranty
                  </Text>
                  <Text variant="caption" color="textMuted" size="xs">
                    {product.warrantyInformation || '1 Year Brand Warranty'}
                  </Text>
                </View>
              </View>

              <View style={styles.highlightItem}>
                <RotateCcw size={18} color="#F59E0B" strokeWidth={2} />
                <View style={styles.highlightTextContainer}>
                  <Text weight="semiBold" size="xs" color="textPrimary">
                    Easy Return
                  </Text>
                  <Text variant="caption" color="textMuted" size="xs">
                    {product.returnPolicy || '7 Days Replacement'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description Section */}
            <View style={styles.sectionCard}>
              <Text weight="bold" size="base" color="textPrimary" style={styles.sectionTitle}>
                Description
              </Text>
              <Text variant="body" color="textSecondary" style={styles.descriptionText}>
                {product.description}
              </Text>
            </View>

            {/* Product Specifications */}
            <View style={styles.sectionCard}>
              <Text weight="bold" size="base" color="textPrimary" style={styles.sectionTitle}>
                Specifications
              </Text>
              <View style={styles.specRow}>
                <Text variant="caption" color="textMuted" style={styles.specLabel}>
                  SKU
                </Text>
                <Text variant="caption" weight="medium" color="textPrimary">
                  {product.sku || `SM-${product.id}092`}
                </Text>
              </View>
              {product.weight && (
                <View style={styles.specRow}>
                  <Text variant="caption" color="textMuted" style={styles.specLabel}>
                    Weight
                  </Text>
                  <Text variant="caption" weight="medium" color="textPrimary">
                    {product.weight} kg
                  </Text>
                </View>
              )}
              {product.dimensions && (
                <View style={styles.specRow}>
                  <Text variant="caption" color="textMuted" style={styles.specLabel}>
                    Dimensions
                  </Text>
                  <Text variant="caption" weight="medium" color="textPrimary">
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                  </Text>
                </View>
              )}
              <View style={[styles.specRow, styles.specRowLast]}>
                <Text variant="caption" color="textMuted" style={styles.specLabel}>
                  Category
                </Text>
                <Text variant="caption" weight="medium" color="textPrimary">
                  {product.category}
                </Text>
              </View>
            </View>

            {/* Customer Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <View style={styles.sectionCard}>
                <Text weight="bold" size="base" color="textPrimary" style={styles.sectionTitle}>
                  Customer Reviews ({product.reviews.length})
                </Text>
                {product.reviews.map((rev, idx) => (
                  <View
                    key={`review-${idx}`}
                    style={[
                      styles.reviewItem,
                      idx === product.reviews!.length - 1 && styles.reviewItemLast,
                    ]}
                  >
                    <View style={styles.reviewHeader}>
                      <Text weight="semiBold" size="sm" color="textPrimary">
                        {rev.reviewerName}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text weight="semiBold" size="xs" style={styles.ratingScore}>
                          {rev.rating}
                        </Text>
                      </View>
                    </View>
                    <Text variant="caption" color="textSecondary" style={styles.reviewComment}>
                      "{rev.comment}"
                    </Text>
                    <Text variant="caption" color="textMuted" size="xs">
                      {new Date(rev.date).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Sticky Bottom Action Bar with Total Price & Add to Cart button */}
          <View
            style={[
              styles.bottomBar,
              { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
            <View style={styles.bottomPriceContainer}>
              <Text variant="caption" color="textMuted">
                Total Price
              </Text>
              <Text weight="bold" size="xl" color="textPrimary">
                ₹{product.price * (currentCartQty > 0 ? currentCartQty : 1)}
              </Text>
            </View>

            {currentCartQty > 0 ? (
              /* If item already in cart, show quantity stepper */
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleDecrement}
                  style={styles.stepperBtn}
                  accessibilityLabel="Decrease quantity"
                >
                  <Minus size={18} color="#FFFFFF" strokeWidth={2.4} />
                </TouchableOpacity>

                <View style={styles.stepperQtyBox}>
                  <Text weight="bold" size="base" color="textPrimary">
                    {currentCartQty}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleIncrement}
                  style={styles.stepperBtn}
                  accessibilityLabel="Increase quantity"
                >
                  <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
                </TouchableOpacity>
              </View>
            ) : (
              /* Add to Cart Button */
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleAddToCart}
                style={styles.addToCartButton}
                accessibilityRole="button"
                accessibilityLabel="Add to Cart"
              >
                <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2.2} />
                <Text weight="bold" size="base" color="textInverse" style={styles.addToCartButtonText}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerSearchWrapper: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
  },
  errorSub: {
    marginTop: 8,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  imageGalleryContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  discountBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 2,
  },
  discountText: {
    color: '#FFFFFF',
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  thumbnailList: {
    gap: 8,
    marginTop: 14,
  },
  thumbnailWrapper: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  thumbnailImage: {
    width: 44,
    height: 44,
  },
  detailsCard: {
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
  productTitle: {
    marginBottom: 4,
  },
  brandText: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  originalPriceText: {
    textDecorationLine: 'line-through',
    fontSize: 14,
  },
  saveBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: {
    color: '#15803D',
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  taxNote: {
    marginTop: 6,
  },
  highlightsGrid: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    marginBottom: 14,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightTextContainer: {
    flex: 1,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  descriptionText: {
    lineHeight: 22,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  specLabel: {
    fontSize: 13,
  },
  reviewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reviewItemLast: {
    borderBottomWidth: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewComment: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomPriceContainer: {
    justifyContent: 'center',
  },
  addToCartButton: {
    backgroundColor: '#0A66FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#0A66FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addToCartButtonText: {
    letterSpacing: 0.3,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    gap: 8,
  },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0A66FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQtyBox: {
    minWidth: 28,
    alignItems: 'center',
  },
});

export default ProductDetailsScreen;
