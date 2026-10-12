import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { QrCode, ScanBarcode } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';
import { ProductMeta } from '../../services/query/productQueries';

export interface ProductBarcodeSectionProps {
  meta?: ProductMeta;
}

export const ProductBarcodeSection: React.FC<ProductBarcodeSectionProps> = ({
  meta,
}) => {
  if (!meta || (!meta.barcode && !meta.qrCode)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text weight="bold" size="base" color="textPrimary" style={styles.title}>
        Verification & Barcode
      </Text>

      <View style={styles.contentRow}>
        {/* Barcode Info */}
        {meta.barcode && (
          <View style={styles.infoBox}>
            <View style={styles.iconTitleRow}>
              <ScanBarcode size={18} color={colors.primary} />
              <Text weight="semiBold" size="xs" color="textPrimary">
                Barcode / EAN
              </Text>
            </View>
            <Text variant="caption" weight="medium" color="textSecondary" style={styles.codeText}>
              {meta.barcode}
            </Text>
          </View>
        )}

        {/* QR Code */}
        {meta.qrCode && (
          <View style={styles.infoBox}>
            <View style={styles.iconTitleRow}>
              <QrCode size={18} color="#10B981" />
              <Text weight="semiBold" size="xs" color="textPrimary">
                QR Verification
              </Text>
            </View>
            <View style={styles.qrImageWrapper}>
              <Image
                source={{ uri: meta.qrCode }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  title: {
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  infoBox: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  qrImageWrapper: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
});

export default ProductBarcodeSection;
