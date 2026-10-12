import React from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { Text } from './ui/Text';
import {
  useCategoryListQuery,
  useCategoryThumbnailsQuery,
  formatCategoryName,
  getCategoryBgColor,
} from '../services/query/categoryQueries';

export interface CategoryListProps {
  /**
   * Currently selected category slug
   */
  selectedCategory?: string;

  /**
   * Callback fired when a category item is pressed
   */
  onSelectCategory?: (categorySlug: string) => void;

  /**
   * Container style override
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Scroll content container style override
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onSelectCategory,
  style,
  contentContainerStyle,
}) => {
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategoryListQuery();
  const { data: thumbnailMap = {} } = useCategoryThumbnailsQuery();

  const renderCategoryItem = ({ item: slug, index }: { item: string; index: number }) => {
    const isSelected = selectedCategory === slug;
    const displayName = formatCategoryName(slug);
    const bgColor = getCategoryBgColor(index);
    const imageUrl = thumbnailMap[slug];

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectCategory?.(slug)}
        style={styles.categoryItem}
        accessibilityRole="button"
        accessibilityLabel={`Category ${displayName}`}
      >
        {/* Circle Card with Dynamic Pastel Background */}
        <View
          style={[
            styles.circleContainer,
            { backgroundColor: bgColor },
            isSelected && styles.circleSelected,
          ]}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.fallbackPlaceholder} />
          )}
        </View>

        {/* Category Label */}
        <Text
          weight={isSelected ? 'bold' : 'medium'}
          size="xs"
          color={isSelected ? 'primary' : 'textPrimary'}
          align="center"
          style={styles.categoryLabel}
          numberOfLines={2}
        >
          {displayName}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isCategoriesLoading && categories.length === 0) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={renderCategoryItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, contentContainerStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  loadingContainer: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 68,
  },
  circleContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  circleSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  categoryImage: {
    width: 44,
    height: 44,
  },
  fallbackPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  categoryLabel: {
    lineHeight: 14,
    includeFontPadding: false,
  },
});

export default CategoryList;
