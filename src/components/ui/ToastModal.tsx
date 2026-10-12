import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Modal,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from './Text';

export type ToastModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';
export type ToastModalMode = 'modal' | 'toast';
export type ToastPosition = 'top' | 'bottom';
export type ButtonVariant = 'primary' | 'danger' | 'success' | 'secondary' | 'outline';

export interface ToastModalProps {
  isVisible: boolean;
  onClose: () => void;
  type?: ToastModalType;
  mode?: ToastModalMode;
  position?: ToastPosition;
  title?: string;
  message?: string;
  children?: React.ReactNode;

  // Actions for modal mode
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  cancelVariant?: ButtonVariant;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;

  // Configuration
  autoHideDuration?: number; // milliseconds for toast mode (0 to disable)
  showCloseButton?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ToastModal: React.FC<ToastModalProps> = ({
  isVisible,
  onClose,
  type = 'info',
  mode = 'modal',
  position = 'top',
  title,
  message,
  children,
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  cancelVariant = 'secondary',
  showCancel = false,
  onConfirm,
  onCancel,
  autoHideDuration = 3500,
  showCloseButton = true,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const [isRendered, setIsRendered] = useState(isVisible);

  // Animated values
  const animValue = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto hide timer for toast mode
  useEffect(() => {
    if (mode === 'toast' && isVisible && autoHideDuration > 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onClose();
      }, autoHideDuration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [mode, isVisible, autoHideDuration, onClose]);

  // Handle visibility transitions
  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      Animated.spring(animValue, {
        toValue: 1,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsRendered(false);
        }
      });
    }
  }, [isVisible, animValue]);

  // Swipe gesture for toast mode
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => mode === 'toast',
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (mode !== 'toast') return false;
          const { dy } = gestureState;
          if (position === 'top' && dy < -10) return true;
          if (position === 'bottom' && dy > 10) return true;
          return false;
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dy } = gestureState;
          if (position === 'top' && dy < -15) {
            onClose();
          } else if (position === 'bottom' && dy > 15) {
            onClose();
          }
        },
      }),
    [mode, position, onClose]
  );

  // Theme definition
  const theme = useMemo(() => {
    switch (type) {
      case 'success':
        return {
          iconColor: '#059669',
          bgBadge: '#ECFDF5',
          borderBadge: '#A7F3D0',
          borderColor: '#10B981',
          IconComponent: CheckCircle2,
          defaultTitle: 'Success',
        };
      case 'error':
        return {
          iconColor: '#E11D48',
          bgBadge: '#FFF1F2',
          borderBadge: '#FECDD3',
          borderColor: '#F43F5E',
          IconComponent: AlertCircle,
          defaultTitle: 'Error',
        };
      case 'warning':
        return {
          iconColor: '#D97706',
          bgBadge: '#FFFBEB',
          borderBadge: '#FDE68A',
          borderColor: '#F59E0B',
          IconComponent: AlertTriangle,
          defaultTitle: 'Warning',
        };
      case 'confirm':
        return {
          iconColor: '#4F46E5',
          bgBadge: '#EEF2FF',
          borderBadge: '#C7D2FE',
          borderColor: '#6366F1',
          IconComponent: HelpCircle,
          defaultTitle: 'Confirm Action',
        };
      case 'info':
      default:
        return {
          iconColor: '#2563EB',
          bgBadge: '#EFF6FF',
          borderBadge: '#BFDBFE',
          borderColor: '#3B82F6',
          IconComponent: Info,
          defaultTitle: 'Information',
        };
    }
  }, [type]);

  const IconComponent = theme.IconComponent;
  const isConfirmMode = mode === 'modal' && (type === 'confirm' || showCancel);

  const getButtonStyle = (variant: ButtonVariant, isCancel = false) => {
    switch (variant) {
      case 'danger':
        return styles.dangerBtn;
      case 'success':
        return styles.successBtn;
      case 'secondary':
        return styles.secondaryBtn;
      case 'outline':
        return isCancel ? styles.cancelOutlineBtn : styles.outlineBtn;
      case 'primary':
      default:
        return styles.primaryBtn;
    }
  };

  const getButtonTextStyle = (variant: ButtonVariant) => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondaryColor;
      case 'outline':
        return styles.textPrimaryOutline;
      default:
        return styles.textWhite;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // Memoized dynamic styles
  const toastInsetTop = useMemo(() => ({ paddingTop: insets.top + 10 }), [insets.top]);
  const toastInsetBottom = useMemo(
    () => ({ paddingBottom: insets.bottom + 16 }),
    [insets.bottom]
  );
  const toastBorder = useMemo(
    () => ({ borderColor: theme.borderBadge }),
    [theme.borderBadge]
  );
  const toastAccentBarBg = useMemo(
    () => ({ backgroundColor: theme.borderColor }),
    [theme.borderColor]
  );
  const toastBadgeBg = useMemo(
    () => ({ backgroundColor: theme.bgBadge }),
    [theme.bgBadge]
  );
  const modalBadgeStyle = useMemo(
    () => ({
      backgroundColor: theme.bgBadge,
      borderColor: theme.borderBadge,
    }),
    [theme.bgBadge, theme.borderBadge]
  );

  // Animated transforms
  const modalAnimStyle = useMemo(
    () => ({
      opacity: animValue,
      transform: [
        {
          scale: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.88, 1],
          }),
        },
      ],
    }),
    [animValue]
  );

  const toastTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [position === 'top' ? -80 : 80, 0],
  });

  const toastAnimStyle = useMemo(
    () => ({
      opacity: animValue,
      transform: [{ translateY: toastTranslateY }],
    }),
    [animValue, toastTranslateY]
  );

  const backdropAnimStyle = useMemo(
    () => ({
      opacity: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.58],
      }),
    }),
    [animValue]
  );

  if (!isRendered) {
    return null;
  }

  // ----------------------------------------------------
  // TOAST MODE
  // ----------------------------------------------------
  if (mode === 'toast') {
    const isTop = position === 'top';

    return (
      <Modal
        transparent
        visible={isRendered}
        animationType="none"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <View
          pointerEvents="box-none"
          style={[
            styles.toastRoot,
            isTop ? styles.toastTop : styles.toastBottom,
            isTop ? toastInsetTop : toastInsetBottom,
          ]}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.toastContainer, toastBorder, toastAnimStyle, style]}
          >
            {/* Left Accent Bar */}
            <View style={[styles.toastAccentBar, toastAccentBarBg]} />

            {/* Left Icon Badge */}
            <View style={[styles.toastIconWrapper, toastBadgeBg]}>
              <IconComponent size={20} color={theme.iconColor} strokeWidth={2.2} />
            </View>

            {/* Text Content */}
            <View style={styles.toastTextContent}>
              <Text weight="bold" size="sm" color="textPrimary" numberOfLines={1}>
                {title || theme.defaultTitle}
              </Text>
              {message ? (
                <Text
                  variant="caption"
                  color="textSecondary"
                  numberOfLines={2}
                  style={styles.toastMessage}
                >
                  {message}
                </Text>
              ) : null}
              {children}
            </View>

            {/* Dismiss Button */}
            {showCloseButton && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={styles.toastCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Dismiss notification"
              >
                <X size={16} color={colors.textMuted} strokeWidth={2.2} />
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Modal>
    );
  }

  // ----------------------------------------------------
  // MODAL / ALERT / CONFIRM MODE
  // ----------------------------------------------------
  return (
    <Modal
      transparent
      visible={isRendered}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Animated Dark Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdropAnimStyle]} />
        </TouchableWithoutFeedback>

        {/* Animated Dialog Card */}
        <Animated.View style={[styles.modalCard, modalAnimStyle, style]}>
          {/* Top-Right Close Button */}
          {showCloseButton && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.modalCloseBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <X size={18} color={colors.textSecondary} strokeWidth={2.2} />
            </TouchableOpacity>
          )}

          {/* Glowing Icon Badge */}
          <View style={[styles.modalIconBadge, modalBadgeStyle]}>
            <IconComponent size={34} color={theme.iconColor} strokeWidth={2.2} />
          </View>

          {/* Title */}
          <Text
            weight="bold"
            size="lg"
            color="textPrimary"
            align="center"
            style={styles.modalTitle}
          >
            {title || theme.defaultTitle}
          </Text>

          {/* Message */}
          {message ? (
            <Text
              variant="body"
              color="textSecondary"
              align="center"
              style={styles.modalMessage}
            >
              {message}
            </Text>
          ) : null}

          {/* Custom Children */}
          {children && <View style={styles.modalCustomContent}>{children}</View>}

          {/* Action Buttons */}
          <View style={styles.modalButtonsRow}>
            {isConfirmMode && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCancel}
                style={[
                  styles.actionBtn,
                  styles.cancelBtn,
                  getButtonStyle(cancelVariant, true),
                ]}
                accessibilityRole="button"
                accessibilityLabel={cancelText}
              >
                <Text
                  weight="semiBold"
                  size="md"
                  style={getButtonTextStyle(cancelVariant)}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleConfirm}
              style={[
                styles.actionBtn,
                isConfirmMode ? styles.confirmFlexBtn : styles.singleBtn,
                getButtonStyle(confirmVariant, false),
              ]}
              accessibilityRole="button"
              accessibilityLabel={confirmText}
            >
              <Text
                weight="bold"
                size="md"
                style={getButtonTextStyle(confirmVariant)}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal Root & Backdrop
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F172A',
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 22,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 14,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 18,
  },
  modalTitle: {
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  modalMessage: {
    lineHeight: 21,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  modalCustomContent: {
    width: '100%',
    marginBottom: 16,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelBtn: {
    flex: 1,
  },
  confirmFlexBtn: {
    flex: 1,
  },
  singleBtn: {
    width: '100%',
  },

  // Button Variant Styles
  primaryBtn: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
  dangerBtn: {
    backgroundColor: '#EF4444',
    borderColor: 'transparent',
  },
  successBtn: {
    backgroundColor: '#10B981',
    borderColor: 'transparent',
  },
  secondaryBtn: {
    backgroundColor: '#F1F5F9',
    borderColor: colors.border,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  cancelOutlineBtn: {
    backgroundColor: 'transparent',
    borderColor: colors.borderStrong,
  },

  // Button Text Styles
  textWhite: {
    color: '#FFFFFF',
  },
  textSecondaryColor: {
    color: '#475569',
  },
  textPrimaryOutline: {
    color: colors.primary,
  },

  // Toast Styles
  toastRoot: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  toastTop: {
    justifyContent: 'flex-start',
  },
  toastBottom: {
    justifyContent: 'flex-end',
  },
  toastContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  toastAccentBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 5,
  },
  toastIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 4,
  },
  toastTextContent: {
    flex: 1,
    justifyContent: 'center',
  },
  toastMessage: {
    marginTop: 2,
    lineHeight: 16,
  },
  toastCloseBtn: {
    padding: 6,
    marginLeft: 8,
  },
});

export default ToastModal;
