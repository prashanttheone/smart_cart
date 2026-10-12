import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CreditCard, Smartphone, Banknote, Wallet, Check, ChevronDown } from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../theme/colors';
import { PaymentMethod } from '../../store/slices/checkoutSlice';

export interface PaymentMethodSelectorProps {
  paymentMethods?: PaymentMethod[];
  selectedPaymentMethodId?: string;
  onSelectPaymentMethod?: (item: PaymentMethod) => void;
  title?: string;
  subtitle?: string;
  actionText?: string;
  onSelectPress?: () => void;
}

export function PaymentMethodSelector({
  paymentMethods = [],
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  title = 'Payment Method',
  subtitle = 'UPI, cards, or Cash on Delivery',
  actionText = 'Select',
}: PaymentMethodSelectorProps) {
  const dropdownRef = useRef<any>(null);

  const activeMethod =
    paymentMethods.find((p) => p.id === selectedPaymentMethodId) ||
    paymentMethods[0] || {
      id: 'default',
      type: 'all' as const,
      title,
      subtitle,
    };

  const handleSelect = (item: PaymentMethod) => {
    onSelectPaymentMethod?.(item);
  };

  const renderPaymentIcon = (type: string, isSelected?: boolean) => {
    const iconColor = isSelected ? colors.primary : colors.textSecondary;
    switch (type) {
      case 'upi':
        return <Smartphone size={18} color={iconColor} />;
      case 'card':
        return <CreditCard size={18} color={iconColor} />;
      case 'cod':
        return <Banknote size={18} color={iconColor} />;
      default:
        return <Wallet size={18} color={iconColor} />;
    }
  };

  const renderDropdownItem = (item: PaymentMethod, selected?: boolean) => {
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
          {renderPaymentIcon(item.type, selected)}
        </View>

        <View style={styles.itemTextCol}>
          <Text style={styles.itemTitleText}>{item.title}</Text>
          <Text style={styles.itemSubtitleText} numberOfLines={1}>
            {item.subtitle}
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
      {paymentMethods.length > 0 ? (
        <Dropdown
          ref={dropdownRef}
          data={paymentMethods}
          labelField="title"
          valueField="id"
          value={activeMethod.id}
          onChange={handleSelect}
          style={styles.dropdown}
          containerStyle={styles.dropdownMenu}
          activeColor={colors.primarySoft}
          showsVerticalScrollIndicator={false}
          renderLeftIcon={() => (
            <View style={styles.leftRow}>
              {/* Soft blue card icon */}
              <View style={styles.iconBox}>
                <CreditCard size={22} color={colors.primary} />
              </View>

              {/* Text Info */}
              <View style={styles.infoCol}>
                <Text style={styles.heading}>{activeMethod.title}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  {activeMethod.subtitle}
                </Text>
              </View>
            </View>
          )}
          renderRightIcon={() => (
            <View style={styles.selectActionWrapper}>
              <Text style={styles.actionText}>{actionText}</Text>
              <ChevronDown size={15} color={colors.primary} strokeWidth={2.5} />
            </View>
          )}
          renderItem={renderDropdownItem}
        />
      ) : (
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <CreditCard size={22} color={colors.primary} />
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.heading}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
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
    alignItems: 'center',
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  selectActionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    gap: 4,
  },
  actionText: {
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
  itemTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemSubtitleText: {
    fontSize: 12,
    color: colors.textSecondary,
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

export default PaymentMethodSelector;
