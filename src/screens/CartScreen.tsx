import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store';
import {
  CartItem,
  clearCart,
  removeFromCart,
  updateQuantity,
} from '../store/slices/cartSlice';
import { RootStackParamList } from '../navigation/types';

export function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalCount } = useAppSelector((state) => state.cart);

  const handleProductPress = (item: CartItem) => {
    navigation.navigate('ProductDetails', {
      productId: item.id,
      product: {
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        description: '',
        category: '',
      },
    });
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemRow}>
      {/* Tappable Product Area to open Product Details */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleProductPress(item)}
        style={styles.itemTouchable}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${item.title}`}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.qtyContainer}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() =>
            dispatch(
              updateQuantity({ id: item.id, quantity: item.quantity - 1 })
            )
          }
          accessibilityLabel="Decrease quantity"
        >
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() =>
            dispatch(
              updateQuantity({ id: item.id, quantity: item.quantity + 1 })
            )
          }
          accessibilityLabel="Increase quantity"
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => dispatch(removeFromCart(item.id))}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${item.title} from cart`}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Safe Area Notch Header with Pale Shadow Grey */}
      <View style={[styles.header, { paddingTop: insets.top + 30 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity
            onPress={() => dispatch(clearCart())}
            style={styles.clearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our top products on Home and add items to your cart!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items ({totalCount}):</Text>
              <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout')}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#f1f5f9', // Pale shadow grey for notch, battery & network readability
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  clearText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.surfaceVariant,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 2,
    marginBottom: 6,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CartScreen;
