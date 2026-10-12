import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingCart, Plus, Minus } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';

export interface ProductBottomBarProps {
  price: number;
  stock?: number;
  minimumOrderQuantity?: number;
  currentCartQty: number;
  onAddToCart: (initialQty: number) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  currencySymbol?: string;
}

export const ProductBottomBar: React.FC<ProductBottomBarProps> = ({
  price,
  stock,
  minimumOrderQuantity = 1,
  currentCartQty,
  onAddToCart,
  onIncrement,
  onDecrement,
  currencySymbol = '₹',
}) => {
  const insets = useSafeAreaInsets();
  const isOutOfStock = stock !== undefined && stock === 0;
  const isMaxStockReached = stock !== undefined && currentCartQty >= stock;

  const effectiveQty = currentCartQty > 0 ? currentCartQty : minimumOrderQuantity;
  const totalPrice = price * effectiveQty;

  return (
    <View
      style={[
        styles.bottomBar,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      {/* Price summary */}
      <View style={styles.priceContainer}>
        <Text variant="caption" color="textMuted">
          Total Price ({effectiveQty} {effectiveQty === 1 ? 'item' : 'items'})
        </Text>
        <Text weight="bold" size="xl" color="textPrimary">
          {currencySymbol}{totalPrice}
        </Text>
      </View>

      {/* Action: Out of Stock / Quantity Stepper / Add to Cart */}
      {isOutOfStock ? (
        <View style={styles.outOfStockButton}>
          <Text weight="semiBold" size="sm" color="textMuted">
            Out of Stock
          </Text>
        </View>
      ) : currentCartQty > 0 ? (
        /* Quantity Stepper */
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDecrement}
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
            onPress={onIncrement}
            disabled={isMaxStockReached}
            style={[
              styles.stepperBtn,
              isMaxStockReached && styles.stepperBtnDisabled,
            ]}
            accessibilityLabel="Increase quantity"
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      ) : (
        /* Add to Cart Button */
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => onAddToCart(minimumOrderQuantity)}
          style={styles.addToCartButton}
          accessibilityRole="button"
          accessibilityLabel="Add product to Cart"
        >
          <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2.2} />
          <Text weight="bold" size="base" color="textInverse" style={styles.addToCartButtonText}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  priceContainer: {
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
  stepperBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  stepperQtyBox: {
    minWidth: 28,
    alignItems: 'center',
  },
  outOfStockButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
});

export default ProductBottomBar;
