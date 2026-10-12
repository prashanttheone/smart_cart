import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Address } from '../../store/slices/addressSlice';
import { AddressBottomSheet } from './AddressBottomSheet';

export interface AddressSectionProps {
  addresses?: Address[];
  selectedAddressId?: string;
  onSelectAddress?: (item: Address) => void;
  onAddNewAddress?: () => void;
  recipientName?: string;
  tag?: string;
  addressText?: string;
  onChangePress?: () => void;
}

export function AddressSection({
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  recipientName = 'Prashant Kumar',
  tag = 'Home',
  addressText = 'Your saved delivery address goes here',
  onChangePress,
}: AddressSectionProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) ||
    addresses[0] || {
      id: 'default',
      fullName: recipientName,
      type: tag as any,
      streetAddress: addressText,
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      isDefault: true,
    };

  const handleOpenSheet = () => {
    if (onChangePress) {
      onChangePress();
    } else {
      setIsSheetOpen(true);
    }
  };

  const handleSelectFromSheet = (selected: Address) => {
    onSelectAddress?.(selected);
    setIsSheetOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={handleOpenSheet}
        style={styles.cardRow}
      >
        {/* Soft blue rounded icon container */}
        <View style={styles.iconBox}>
          <MapPin size={22} color={colors.primary} />
        </View>

        {/* Address Info */}
        <View style={styles.infoCol}>
          <Text style={styles.heading}>Delivery Address</Text>
          <Text style={styles.nameTagText}>
            {activeAddress.fullName} · {activeAddress.type}
          </Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {activeAddress.streetAddress}
          </Text>
        </View>

        {/* Change button */}
        <View style={styles.changeActionWrapper}>
          <Text style={styles.changeText}>Change</Text>
          <ChevronRight size={15} color={colors.primary} strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Custom Drawer / Bottom Sheet for Address Selection */}
      <AddressBottomSheet
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        addresses={addresses}
        selectedAddressId={activeAddress.id}
        onSelectAddress={handleSelectFromSheet}
        onAddNewAddress={onAddNewAddress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  infoCol: {
    flex: 1,
    marginRight: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  nameTagText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  changeActionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 2,
    alignSelf: 'center',
  },
  changeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 18,
  },
});

export default AddressSection;
