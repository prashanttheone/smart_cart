import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, ShoppingCart, X } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';

export interface ProductHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onClearSearch: () => void;
  onPressBack: () => void;
  onPressCart: () => void;
  cartCount: number;
  onSubmitSearch?: (query: string) => void;
  onPressSearch?: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onPressBack,
  onPressCart,
  cartCount,
  onSubmitSearch,
  onPressSearch,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.row}>
        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressBack}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>

        {/* Search Bar matching SearchScreen */}
        <TouchableOpacity
          activeOpacity={onPressSearch ? 0.8 : 1}
          onPress={onPressSearch}
          disabled={!onPressSearch}
          style={styles.searchWrapper}
        >
          <Search
            size={18}
            color={colors.textSecondary}
            strokeWidth={2}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={onSearchChange}
            onSubmitEditing={() => onSubmitSearch?.(searchQuery)}
            placeholder="Search in SmartCart..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={onClearSearch}
              style={styles.clearBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
            >
              <X size={15} color={colors.textSecondary} strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Cart Button with Count Badge */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressCart}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={`Cart with ${cartCount} items`}
        >
          <ShoppingCart size={22} color={colors.textPrimary} strokeWidth={2} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text weight="bold" style={styles.cartBadgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Safe area top bar with shadow grey color matching SearchScreen
  container: {
    backgroundColor: '#f1f5f9', // Shadow grey color for top notch, battery & network readability
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchWrapper: {
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
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
});

export default ProductHeader;
