import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Truck, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface DeliveryMethodSelectorProps {
  title?: string;
  methodName?: string;
  estimate?: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export function DeliveryMethodSelector({
  title = 'Delivery Method',
  methodName = 'Standard delivery',
  estimate = 'Ships in 3–5 business days',
  isSelected = true,
  onPress,
}: DeliveryMethodSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={!onPress}
        style={styles.row}
      >
        {/* Left Truck Icon */}
        <View style={styles.iconContainer}>
          <Truck size={22} color={colors.primary} />
        </View>

        {/* Text Details */}
        <View style={styles.infoCol}>
          <Text style={styles.heading}>{title}</Text>
          <Text style={styles.methodText}>{methodName}</Text>
          <Text style={styles.estimateText}>{estimate}</Text>
        </View>

        {/* Right Green Checkmark */}
        {isSelected && (
          <View style={styles.checkContainer}>
            <CheckCircle2 size={20} color={colors.secondary} />
          </View>
        )}
      </TouchableOpacity>
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  infoCol: {
    flex: 1,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  estimateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  checkContainer: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 18,
  },
});

export default DeliveryMethodSelector;
