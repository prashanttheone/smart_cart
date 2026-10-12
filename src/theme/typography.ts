import { Platform, TextStyle } from 'react-native';

export const fontFamilies = {
  light: 'Poppins-Light',
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
} as const;

export type FontWeightKey = keyof typeof fontFamilies;

export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
} as const;

export type FontSizeKey = keyof typeof fontSizes;

export const lineHeights = {
  xs: 15,
  sm: 18,
  md: 20,
  base: 20,
  lg: 22,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 36,
  '5xl': 40,
} as const;

/**
 * Returns platform-optimized font styling for Poppins
 */
export function getFontFamily(weight: FontWeightKey = 'regular'): Pick<TextStyle, 'fontFamily' | 'fontWeight'> {
  const family = fontFamilies[weight] || fontFamilies.regular;

  // On Android, the font family file name already contains the weight.
  // Supplying an additional fontWeight can cause font lookup misses.
  if (Platform.OS === 'android') {
    return {
      fontFamily: family,
    };
  }

  return {
    fontFamily: family,
  };
}

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'button';

export const textVariants: Record<TextVariant, TextStyle> = {
  h1: {
    ...getFontFamily('bold'),
    fontSize: fontSizes['4xl'],
    lineHeight: lineHeights['4xl'],
    letterSpacing: -0.5,
  },
  h2: {
    ...getFontFamily('bold'),
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights['3xl'],
    letterSpacing: -0.3,
  },
  h3: {
    ...getFontFamily('semiBold'),
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
    letterSpacing: -0.2,
  },
  h4: {
    ...getFontFamily('semiBold'),
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
  },
  title: {
    ...getFontFamily('semiBold'),
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
  },
  subtitle: {
    ...getFontFamily('medium'),
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
  },
  body: {
    ...getFontFamily('regular'),
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
  },
  bodySmall: {
    ...getFontFamily('regular'),
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
  },
  caption: {
    ...getFontFamily('regular'),
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
  },
  label: {
    ...getFontFamily('medium'),
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
  },
  button: {
    ...getFontFamily('semiBold'),
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
  },
};
