import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../../theme/colors';
import { Badge } from './Badge';

export interface IconButtonProps extends TouchableOpacityProps {
  /**
   * The icon element to render inside the button
   */
  icon: React.ReactNode;

  /**
   * Optional badge count to overlay at top-right
   */
  badgeCount?: number | string;

  /**
   * Optional dot badge overlay (e.g. unread status)
   */
  badgeDot?: boolean;

  /**
   * Badge color variant
   * @default 'danger'
   */
  badgeVariant?: 'danger' | 'primary' | 'secondary' | 'accent';

  /**
   * Button dimension (width and height)
   * @default 42
   */
  size?: number;

  /**
   * Custom background color
   * @default colors.surfaceVariant
   */
  backgroundColor?: string;

  /**
   * Border color
   */
  borderColor?: string;

  /**
   * Border width
   */
  borderWidth?: number;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  badgeCount,
  badgeDot = false,
  badgeVariant = 'danger',
  size = 42,
  backgroundColor = colors.surfaceVariant,
  borderColor = colors.border,
  borderWidth = 0,
  style,
  activeOpacity = 0.7,
  ...rest
}) => {
  const hasBadge = (badgeCount !== undefined && badgeCount !== 0) || badgeDot;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor,
          borderWidth,
        },
        style,
      ]}
      {...rest}
    >
      {icon}
      {hasBadge && (
        <View style={styles.badgeWrapper}>
          <Badge
            count={badgeCount}
            dot={badgeDot}
            variant={badgeVariant}
            size="sm"
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeWrapper: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 10,
  },
});

export default IconButton;
