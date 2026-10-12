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
  MapPin,
  House,
  Briefcase,
  Check,
  Plus,
  X,
  Phone,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Address } from '../../store/slices/addressSlice';

export interface AddressBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress?: () => void;
}

export function AddressBottomSheet({
  visible,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}: AddressBottomSheetProps) {
  const [tempSelectedId, setTempSelectedId] = useState<string>(selectedAddressId);

  // Sync temp selection whenever modal opens or selectedAddressId changes
  React.useEffect(() => {
    if (visible) {
      setTempSelectedId(selectedAddressId);
    }
  }, [visible, selectedAddressId]);

  const handleConfirm = () => {
    const selected = addresses.find((a) => a.id === tempSelectedId);
    if (selected) {
      onSelectAddress(selected);
    }
    onClose();
  };

  const renderTypeIcon = (type: string, isSelected: boolean) => {
    const iconColor = isSelected ? colors.primary : colors.textSecondary;
    const lower = type.toLowerCase();
    if (lower.includes('home')) {
      return <House size={18} color={iconColor} strokeWidth={2.2} />;
    }
    if (lower.includes('work') || lower.includes('office')) {
      return <Briefcase size={18} color={iconColor} strokeWidth={2.2} />;
    }
    return <MapPin size={18} color={iconColor} strokeWidth={2.2} />;
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
              <Text style={styles.sheetTitle}>Select Delivery Address</Text>
              <Text style={styles.sheetSubtitle}>
                Choose where you want your order delivered
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

          {/* Address List */}
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {addresses.map((item) => {
              const isSelected = item.id === tempSelectedId;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => setTempSelectedId(item.id)}
                  style={[
                    styles.addressCard,
                    isSelected && styles.addressCardSelected,
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

                  {/* Address Content */}
                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.iconTagRow}>
                        <View
                          style={[
                            styles.typeIconBox,
                            isSelected && styles.typeIconBoxSelected,
                          ]}
                        >
                          {renderTypeIcon(item.type, isSelected)}
                        </View>
                        <Text style={styles.recipientName}>
                          {item.fullName}
                        </Text>
                      </View>

                      <View style={styles.badgeRow}>
                        <View style={styles.tagBadge}>
                          <Text style={styles.tagBadgeText}>{item.type}</Text>
                        </View>
                        {item.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>Default</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={styles.addressLine} numberOfLines={2}>
                      {item.streetAddress}
                      {item.city ? `, ${item.city}` : ''}
                      {item.state ? `, ${item.state}` : ''}
                      {item.postalCode ? ` - ${item.postalCode}` : ''}
                    </Text>

                    {item.phone ? (
                      <View style={styles.phoneRow}>
                        <Phone size={13} color={colors.textMuted} />
                        <Text style={styles.phoneText}>{item.phone}</Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Add New Address Action */}
            {onAddNewAddress && (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onAddNewAddress}
                style={styles.addNewBtn}
              >
                <Plus size={18} color={colors.primary} />
                <Text style={styles.addNewText}>Add New Address</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Sticky Confirm Action Bar */}
          <View style={styles.footerBar}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleConfirm}
              style={styles.confirmBtn}
            >
              <Text style={styles.confirmBtnText}>
                Deliver to this Address
              </Text>
            </TouchableOpacity>
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
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
  },
  addressCardSelected: {
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
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  radioInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  iconTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIconBoxSelected: {
    backgroundColor: colors.primarySoft,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagBadge: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  defaultBadge: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  addressLine: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: colors.primarySoft,
    gap: 6,
    marginTop: 4,
  },
  addNewText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
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
});

export default AddressBottomSheet;
