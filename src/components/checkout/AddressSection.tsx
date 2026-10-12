import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface AddressSectionProps {
  recipientName?: string;
  tag?: string;
  addressText?: string;
  onChangePress?: () => void;
}

export function AddressSection({
  recipientName = 'Prashant Kumar',
  tag = 'Home',
  addressText = 'Your saved delivery address goes here',
  onChangePress,
}: AddressSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Soft blue rounded icon container */}
        <View style={styles.iconBox}>
          <MapPin size={22} color={colors.primary} />
        </View>

        {/* Address Info */}
        <View style={styles.infoCol}>
          <Text style={styles.heading}>Delivery Address</Text>
          <Text style={styles.nameTagText}>
            {recipientName} · {tag}
          </Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {addressText}
          </Text>
        </View>

        {/* Change button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onChangePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.changeBtn}
        >
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
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
  },
  infoCol: {
    flex: 1,
    marginRight: 12,
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
  changeBtn: {
    paddingVertical: 4,
  },
  changeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 18,
  },
});

export default AddressSection;
