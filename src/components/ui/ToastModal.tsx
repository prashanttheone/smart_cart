import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Modal from 'react-native-modal';
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto hide for toast mode
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

  // Color config according to type
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

  // Button styles helper
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

  // ----------------------------------------------------
  // RENDER TOAST MODE
  // ----------------------------------------------------
  if (mode === 'toast') {
    const isTop = position === 'top';
    const swipeDir = isTop ? 'up' : 'down';

    return (
      <Modal
        isVisible={isVisible}
        hasBackdrop={false}
        coverScreen={true}
        animationIn={isTop ? 'slideInDown' : 'slideInUp'}
        animationOut={isTop ? 'slideOutUp' : 'slideOutDown'}
        animationInTiming={320}
        animationOutTiming={280}
        swipeDirection={swipeDir}
        onSwipeComplete={onClose}
        onBackButtonPress={onClose}
        style={[
          styles.toastModalStyle,
          isTop ? styles.toastTop : styles.toastBottom,
          isTop ? toastInsetTop : toastInsetBottom,
        ]}
      >
        <View style={[styles.toastContainer, toastBorder, style]}>
          {/* Toast Accent Indicator */}
          <View style={[styles.toastAccentBar, toastAccentBarBg]} />

          {/* Left Icon Badge */}
          <View style={[styles.toastIconWrapper, toastBadgeBg]}>
            <IconComponent size={20} color={theme.iconColor} strokeWidth={2.2} />
          </View>

          {/* Toast Text Content */}
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

          {/* Dismiss button */}
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
        </View>
      </Modal>
    );
  }

  // ----------------------------------------------------
  // RENDER MODAL / ALERT / CONFIRM MODE
  // ----------------------------------------------------
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropColor="#0F172A"
      backdropOpacity={0.6}
      animationIn="zoomIn"
      animationOut="fadeOutDown"
      animationInTiming={280}
      animationOutTiming={220}
      backdropTransitionInTiming={280}
      backdropTransitionOutTiming={220}
      useNativeDriver
      hideModalContentWhileAnimating
      style={styles.centerModalStyle}
    >
      <View style={[styles.modalCard, style]}>
        {/* Optional top-right close button */}
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

        {/* Floating Glowing Icon Badge */}
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

        {/* Optional custom children */}
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal (Center Dialog) Styles
  centerModalStyle: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
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
  toastModalStyle: {
    margin: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
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
