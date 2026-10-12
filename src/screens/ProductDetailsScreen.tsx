import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { Text } from '../components/ui/Text';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart, updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { useProductByIdQuery } from '../services/query/productQueries';

import {
  ProductHeader,
  ProductGallery,
  ProductTitleSection,
  ProductPriceSection,
  ProductDeliveryWarranty,
  ProductDescriptionSection,
  ProductSpecifications,
  ProductReviewsSection,
  ProductBarcodeSection,
  ProductBottomBar,
} from '../components/product_details';

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

  const { product: initialProduct, productId: routeProductId } =
    route.params || {};
  const targetId = routeProductId ?? initialProduct?.id;

  // Search input inside header
  const [searchQuery, setSearchQuery] = useState('');

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

  // Cart quantity for this item
  const currentCartItem = product
    ? cartItems.find((item) => item.id === product.id)
    : undefined;
  const currentCartQty = currentCartItem?.quantity ?? 0;

  const handleAddToCart = (initialQty: number = 1) => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: initialQty,
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
    const minQty = product.minimumOrderQuantity ?? 1;
    if (currentCartQty <= minQty) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(
        updateQuantity({
          id: product.id,
          quantity: currentCartQty - 1,
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header with Back Button, Search Bar, and Cart Badge */}
      <ProductHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        onSubmitSearch={(query) => {
          if (query.trim()) {
            navigation.navigate('Search', { initialQuery: query.trim() });
          }
        }}
        onPressBack={() => navigation.goBack()}
        onPressCart={() => navigation.navigate('Cart')}
        cartCount={cartTotalCount}
      />

      {/* 2. Body: Loading, Error, or Product Sections */}
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
              { paddingBottom: insets.bottom + 90 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Product Gallery: images, thumbnail, discount */}
            <ProductGallery
              images={product.images}
              thumbnail={product.thumbnail}
              discountPercentage={product.discountPercentage}
            />

            {/* Product Title & Rating: title, brand, category, rating, reviews.length */}
            <ProductTitleSection
              title={product.title}
              brand={product.brand}
              category={product.category}
              rating={product.rating}
              reviewCount={product.reviews?.length}
            />

            {/* Price & Savings & Availability: price, discountPercentage, availabilityStatus, stock */}
            <ProductPriceSection
              price={product.price}
              discountPercentage={product.discountPercentage}
              availabilityStatus={product.availabilityStatus}
              stock={product.stock}
              minimumOrderQuantity={product.minimumOrderQuantity}
            />

            {/* Delivery & Warranty: shippingInformation, warrantyInformation, returnPolicy */}
            <ProductDeliveryWarranty
              shippingInformation={product.shippingInformation}
              warrantyInformation={product.warrantyInformation}
              returnPolicy={product.returnPolicy}
            />

            {/* Description: description, tags */}
            <ProductDescriptionSection
              description={product.description}
              tags={product.tags}
            />

            {/* Specifications: sku, weight, dimensions, minimumOrderQuantity */}
            <ProductSpecifications
              sku={product.sku}
              weight={product.weight}
              dimensions={product.dimensions}
              category={product.category}
              minimumOrderQuantity={product.minimumOrderQuantity}
            />

            {/* Customer Reviews: reviews */}
            <ProductReviewsSection reviews={product.reviews} />

            {/* Barcode / QR Code: meta.barcode, meta.qrCode */}
            <ProductBarcodeSection meta={product.meta} />
          </ScrollView>

          {/* 3. Sticky Bottom Action Bar with Quantity Selector and Cart Action */}
          <ProductBottomBar
            price={product.price}
            stock={product.stock}
            minimumOrderQuantity={product.minimumOrderQuantity}
            currentCartQty={currentCartQty}
            onAddToCart={handleAddToCart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
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
    paddingTop: 14,
  },
});

export default ProductDetailsScreen;
