import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { Text } from './Text';

export type BadgeVariant = 'danger' | 'primary' | 'secondary' | 'accent' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /**
   * Numeric or string count to display
   */
  count?: number | string;

  /**
   * Optional text label
   */
  label?: string;

  /**
   * If true, displays as a minimal dot without content
   */
  dot?: boolean;

  /**
   * Maximum count before showing "X+"
   * @default 99
   */
  maxCount?: number;

  /**
   * Color theme variant
   * @default 'danger'
   */
  variant?: BadgeVariant;

  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  label,
  dot = false,
  maxCount = 99,
  variant = 'danger',
  size = 'md',
  style,
  textStyle,
}) => {
  // If count is 0 and no label/dot, don't display
  if (count === 0 && !label && !dot) {
    return null;
  }

  const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
    danger: { bg: colors.danger, text: colors.textInverse },
    primary: { bg: colors.primary, text: colors.textInverse },
    secondary: { bg: colors.secondary, text: colors.textInverse },
    accent: { bg: colors.accent, text: colors.textPrimary },
    neutral: { bg: colors.surfaceVariant, text: colors.textSecondary },
  };

  const selectedTheme = variantStyles[variant] || variantStyles.danger;

  if (dot) {
    const dotSize = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
    return (
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: selectedTheme.bg,
          },
          style,
        ]}
      />
    );
  }

  let displayContent = label;
  if (count !== undefined && count !== null) {
    if (typeof count === 'number' && count > maxCount) {
      displayContent = `${maxCount}+`;
    } else {
      displayContent = String(count);
    }
  }

  if (!displayContent) {
    return null;
  }

  const isNumericSingle =
    typeof count === 'number' && count >= 0 && count < 10 && !label;

  const sizeStyles = {
    sm: {
      paddingHorizontal: isNumericSingle ? 0 : 4,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      fontSize: 10,
    },
    md: {
      paddingHorizontal: isNumericSingle ? 0 : 6,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      fontSize: 11,
    },
    lg: {
      paddingHorizontal: isNumericSingle ? 0 : 8,
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      fontSize: 12,
    },
  }[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: selectedTheme.bg,
          minWidth: sizeStyles.minWidth,
          height: sizeStyles.height,
          borderRadius: sizeStyles.borderRadius,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style,
      ]}
    >
      <Text
        weight="bold"
        style={[
          styles.text,
          {
            color: selectedTheme.text,
            fontSize: sizeStyles.fontSize,
            lineHeight: sizeStyles.fontSize + 2,
          },
          textStyle,
        ]}
      >
        {displayContent}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    alignSelf: 'flex-start',
  },
  text: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default Badge;
