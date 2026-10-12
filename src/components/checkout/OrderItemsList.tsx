import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem } from '../../store/slices/cartSlice';
import { colors } from '../../theme/colors';

interface OrderItemsListProps {
  items: CartItem[];
  onItemPress?: (item: CartItem) => void;
}

export function OrderItemsList({ items, onItemPress }: OrderItemsListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        return (
          <View key={`${item.id}-${index}`}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onItemPress?.(item)}
              disabled={!onItemPress}
              style={styles.itemRow}
            >
              {/* Product Thumbnail Container */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              {/* Product Info */}
              <View style={styles.detailsContainer}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemMeta}>
                  Qty: {item.quantity} · In stock
                </Text>
                <Text style={styles.itemPrice}>${itemTotal}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    marginRight: 14,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 18,
  },
});

export default OrderItemsList;
