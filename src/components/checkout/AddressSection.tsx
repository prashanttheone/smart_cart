import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapPin, House, Briefcase, MapPinned, Check, ChevronDown } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../theme/colors';
import { Address } from '../../store/slices/addressSlice';

export interface AddressSectionProps {
  addresses?: Address[];
  selectedAddressId?: string;
  onSelectAddress?: (item: Address) => void;
  recipientName?: string;
  tag?: string;
  addressText?: string;
  onChangePress?: () => void;
}

export function AddressSection({
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  recipientName = 'Prashant Kumar',
  tag = 'Home',
  addressText = 'Your saved delivery address goes here',
}: AddressSectionProps) {
  const dropdownRef = useRef<any>(null);

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

  const handleSelect = (item: Address) => {
    onSelectAddress?.(item);
  };

  const renderDropdownItem = (item: Address, selected?: boolean) => {
    const isHome = item.type?.toLowerCase().includes('home');
    const isWork =
      item.type?.toLowerCase().includes('work') ||
      item.type?.toLowerCase().includes('office');

    return (
      <View
        style={[
          styles.dropdownItem,
          selected && styles.dropdownItemSelected,
        ]}
      >
        <View
          style={[
            styles.itemIconBox,
            selected && styles.itemIconBoxSelected,
          ]}
        >
          {isHome ? (
            <House
              size={18}
              color={selected ? colors.primary : colors.textSecondary}
            />
          ) : isWork ? (
            <Briefcase
              size={18}
              color={selected ? colors.primary : colors.textSecondary}
            />
          ) : (
            <MapPinned
              size={18}
              color={selected ? colors.primary : colors.textSecondary}
            />
          )}
        </View>

        <View style={styles.itemTextCol}>
          <View style={styles.itemTagRow}>
            <Text style={styles.itemNameText}>{item.fullName}</Text>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>{item.type}</Text>
            </View>
          </View>
          <Text style={styles.itemAddressText} numberOfLines={2}>
            {item.streetAddress}
            {item.city ? `, ${item.city}` : ''}
          </Text>
        </View>

        {selected && (
          <View style={styles.checkCircle}>
            <Check size={14} color="#ffffff" strokeWidth={2.8} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {addresses.length > 0 ? (
        <Dropdown
          ref={dropdownRef}
          data={addresses}
          labelField="streetAddress"
          valueField="id"
          value={activeAddress.id}
          onChange={handleSelect}
          style={styles.dropdown}
          containerStyle={styles.dropdownMenu}
          activeColor={colors.primarySoft}
          showsVerticalScrollIndicator={false}
          renderLeftIcon={() => (
            <View style={styles.leftRow}>
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
            </View>
          )}
          renderRightIcon={() => (
            <View style={styles.changeActionWrapper}>
              <Text style={styles.changeText}>Change</Text>
              <ChevronDown size={15} color={colors.primary} strokeWidth={2.5} />
            </View>
          )}
          renderItem={renderDropdownItem}
        />
      ) : (
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <MapPin size={22} color={colors.primary} />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.heading}>Delivery Address</Text>
            <Text style={styles.nameTagText}>
              {recipientName} · {tag}
            </Text>
            <Text style={styles.addressText} numberOfLines={2}>
              {addressText}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  dropdown: {
    paddingVertical: 2,
  },
  leftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  row: {
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    gap: 4,
  },
  changeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 18,
  },
  dropdownMenu: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
    paddingVertical: 6,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: colors.primarySoft,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIconBoxSelected: {
    backgroundColor: '#ffffff',
  },
  itemTextCol: {
    flex: 1,
  },
  itemTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 8,
  },
  itemNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tagBadge: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  itemAddressText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default AddressSection;
