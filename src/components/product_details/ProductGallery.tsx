import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';

export interface ProductGalleryProps {
  images?: string[];
  thumbnail: string;
  discountPercentage?: number;
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  thumbnail,
  discountPercentage,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const galleryImages =
    images && images.length > 0 ? images : thumbnail ? [thumbnail] : [];

  const activeImageUri = galleryImages[selectedIndex] || thumbnail;
  const discount = discountPercentage ? Math.round(discountPercentage) : 0;

  return (
    <View style={styles.container}>
      {/* Discount Badge */}
      {discount > 0 && (
        <View style={styles.discountBadge}>
          <Text weight="bold" size="xs" style={styles.discountText}>
            {discount}% OFF
          </Text>
        </View>
      )}

      {/* Wishlist Toggle Button (Top Right) */}
      {onToggleWishlist && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleWishlist}
          style={styles.wishlistBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={
            isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
          }
        >
          <Heart
            size={20}
            color={isInWishlist ? '#EF4444' : colors.textSecondary}
            fill={isInWishlist ? '#EF4444' : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      )}

      {/* Main Active Image */}
      <Image
        source={{ uri: activeImageUri }}
        style={styles.mainImage}
        resizeMode="contain"
      />

      {/* Thumbnails if multiple images exist */}
      {galleryImages.length > 1 && (
        <FlatList
          horizontal
          data={galleryImages}
          keyExtractor={(_, index) => `gallery-img-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
          renderItem={({ item: imgUri, index }) => {
            const isSelected = selectedIndex === index;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedIndex(index)}
                style={[
                  styles.thumbnailWrapper,
                  isSelected && styles.thumbnailActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`View image ${index + 1}`}
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
  );
};

const styles = StyleSheet.create({
  container: {
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
  wishlistBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default ProductGallery;
