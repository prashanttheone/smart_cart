import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tag } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';

export interface ProductDescriptionSectionProps {
  description: string;
  tags?: string[];
  onPressTag?: (tag: string) => void;
}

export const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({
  description,
  tags,
  onPressTag,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = description.length > 200;

  const displayText =
    shouldTruncate && !isExpanded
      ? `${description.slice(0, 200)}...`
      : description;

  return (
    <View style={styles.container}>
      <Text weight="bold" size="base" color="textPrimary" style={styles.title}>
        Description
      </Text>

      <Text variant="body" color="textSecondary" style={styles.description}>
        {displayText}
      </Text>

      {shouldTruncate && (
        <TouchableOpacity
          onPress={() => setIsExpanded((prev) => !prev)}
          style={styles.expandButton}
          activeOpacity={0.7}
        >
          <Text weight="semiBold" size="xs" color="primary">
            {isExpanded ? 'Show Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Tags Chips */}
      {tags && tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <View style={styles.tagsHeader}>
            <Tag size={14} color={colors.textMuted} />
            <Text variant="caption" weight="semiBold" color="textMuted">
              TAGS
            </Text>
          </View>
          <View style={styles.tagChipsWrapper}>
            {tags.map((tag, idx) => (
              <TouchableOpacity
                key={`tag-${idx}`}
                activeOpacity={0.7}
                onPress={() => onPressTag?.(tag)}
                style={styles.tagChip}
              >
                <Text variant="caption" weight="medium" color="primary">
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
  },
  expandButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 4,
  },
  tagsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tagChipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
});

export default ProductDescriptionSection;
