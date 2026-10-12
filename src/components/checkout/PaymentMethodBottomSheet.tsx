import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { PaymentMethod } from '../../store/slices/checkoutSlice';

export interface PaymentMethodBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
}

export function PaymentMethodBottomSheet({
  visible,
  onClose,
  paymentMethods,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
}: PaymentMethodBottomSheetProps) {
  const [tempSelectedId, setTempSelectedId] = useState<string>(selectedPaymentMethodId);

  // Sync temp selection when modal opens or selected ID changes
  React.useEffect(() => {
    if (visible) {
      setTempSelectedId(selectedPaymentMethodId);
    }
  }, [visible, selectedPaymentMethodId]);

  const handleConfirm = () => {
    const selected = paymentMethods.find((p) => p.id === tempSelectedId);
    if (selected) {
      onSelectPaymentMethod(selected);
    }
    onClose();
  };

  const renderPaymentIcon = (type: string, isSelected: boolean) => {
    const iconColor = isSelected ? colors.primary : colors.textSecondary;
    switch (type) {
      case 'upi':
        return <Smartphone size={20} color={iconColor} strokeWidth={2.2} />;
      case 'card':
        return <CreditCard size={20} color={iconColor} strokeWidth={2.2} />;
      case 'cod':
        return <Banknote size={20} color={iconColor} strokeWidth={2.2} />;
      default:
        return <Wallet size={20} color={iconColor} strokeWidth={2.2} />;
    }
  };

  const getMethodBadge = (type: string) => {
    switch (type) {
      case 'upi':
        return 'Instant & Free';
      case 'card':
        return 'All Cards Supported';
      case 'cod':
        return 'Pay at Delivery';
      default:
        return 'Recommended';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* Backdrop tap to dismiss */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet Card */}
        <View style={styles.sheetContainer}>
          {/* Grabber Handle */}
          <View style={styles.grabber} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextCol}>
              <Text style={styles.sheetTitle}>Select Payment Method</Text>
              <Text style={styles.sheetSubtitle}>
                Choose how you would like to pay
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Payment Methods List */}
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {paymentMethods.map((item) => {
              const isSelected = item.id === tempSelectedId;
              const badgeText = getMethodBadge(item.type);

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => setTempSelectedId(item.id)}
                  style={[
                    styles.methodCard,
                    isSelected && styles.methodCardSelected,
                  ]}
                >
                  {/* Left Radio Selector */}
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.radioInner}>
                        <Check size={11} color="#ffffff" strokeWidth={3} />
                      </View>
                    )}
                  </View>

                  {/* Method Icon Box */}
                  <View
                    style={[
                      styles.methodIconBox,
                      isSelected && styles.methodIconBoxSelected,
                    ]}
                  >
                    {renderPaymentIcon(item.type, isSelected)}
                  </View>

                  {/* Method Content */}
                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.methodTitle}>{item.title}</Text>
                      {badgeText && (
                        <View
                          style={[
                            styles.methodBadge,
                            item.type === 'all' && styles.recommendedBadge,
                          ]}
                        >
                          <Text
                            style={[
                              styles.methodBadgeText,
                              item.type === 'all' && styles.recommendedBadgeText,
                            ]}
                          >
                            {badgeText}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.methodSubtitle} numberOfLines={2}>
                      {item.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Sticky Confirm Action Bar */}
          <View style={styles.footerBar}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleConfirm}
              style={styles.confirmBtn}
            >
              <Text style={styles.confirmBtnText}>
                Confirm Payment Method
              </Text>
            </TouchableOpacity>

            <View style={styles.secureRow}>
              <ShieldCheck size={13} color={colors.textSecondary} />
              <Text style={styles.secureText}>
                256-bit Encrypted · 100% Safe & Secure
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '82%',
    paddingBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTextCol: {
    flex: 1,
    marginRight: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listScroll: {
    maxHeight: 380,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#f6faff',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  radioInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodIconBoxSelected: {
    backgroundColor: colors.primarySoft,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  methodBadge: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendedBadge: {
    backgroundColor: colors.primarySoft,
  },
  methodBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  recommendedBadgeText: {
    color: colors.primary,
  },
  methodSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  footerBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 6,
  },
  secureText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default PaymentMethodBottomSheet;
