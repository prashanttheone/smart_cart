import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../../theme/colors';
import {
  fontSizes,
  FontSizeKey,
  FontWeightKey,
  getFontFamily,
  TextVariant,
  textVariants,
} from '../../theme/typography';

export interface TextProps extends RNTextProps {
  /**
   * Predefined typography variant
   * @default 'body'
   */
  variant?: TextVariant;

  /**
   * Font weight key mapped to Poppins fonts
   */
  weight?: FontWeightKey;

  /**
   * Font size scale key ('xs'...'5xl') or specific number
   */
  size?: FontSizeKey | number;

  /**
   * Color from theme or custom hex/rgb
   * @default colors.textPrimary
   */
  color?: keyof typeof colors | string;

  /**
   * Text alignment
   */
  align?: TextStyle['textAlign'];

  /**
   * Optional custom line height
   */
  lineHeight?: number;

  /**
   * Optional custom letter spacing
   */
  letterSpacing?: number;

  /**
   * Custom style overrides
   */
  style?: StyleProp<TextStyle>;

  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight,
  size,
  color,
  align,
  lineHeight,
  letterSpacing,
  style,
  children,
  ...rest
}) => {
  const baseVariantStyle = textVariants[variant] || textVariants.body;

  // Resolve color from theme colors or raw value
  let resolvedColor = colors.textPrimary;
  if (color) {
    if (color in colors) {
      resolvedColor = colors[color as keyof typeof colors] as string;
    } else {
      resolvedColor = color;
    }
  }

  // Resolve font size
  let resolvedFontSize: number | undefined;
  if (typeof size === 'number') {
    resolvedFontSize = size;
  } else if (size && size in fontSizes) {
    resolvedFontSize = fontSizes[size as FontSizeKey];
  }

  // Weight override
  const weightStyle = weight ? getFontFamily(weight) : undefined;

  const computedStyle: TextStyle = {
    ...baseVariantStyle,
    color: resolvedColor,
    ...(resolvedFontSize ? { fontSize: resolvedFontSize } : {}),
    ...(weightStyle || {}),
    ...(align ? { textAlign: align } : {}),
    ...(lineHeight ? { lineHeight } : {}),
    ...(letterSpacing !== undefined ? { letterSpacing } : {}),
  };

  return (
    <RNText style={[computedStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};

export const AppText = Text;
export const Typography = Text;

export default Text;
