import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingBag, Zap, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showFeatures?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  showBack = false,
  onBack,
  showFeatures = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 40, 60) },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          bounces={false}
        >
          {/* Top Hero Banner with logo1.png */}
          <View style={[styles.heroBanner, { paddingTop: insets.top }]}>
            <Image
              source={require('../../../assets/logo1.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Back Button Overlay */}
            {showBack && onBack && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onBack}
                style={[styles.backButton, { top: insets.top + 10 }]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>

          {/* Form Content Card */}
          <View style={styles.contentCard}>
            {/* Title & Subtitle */}
            <Text weight="bold" size="2xl" color="textPrimary" align="center" style={styles.title}>
              {title}
            </Text>

            {subtitle ? (
              <Text variant="body" color="textSecondary" align="center" style={styles.subtitle}>
                {subtitle}
              </Text>
            ) : null}

            {/* Form Slot */}
            <View style={styles.formSlot}>{children}</View>

            {/* Features Row */}
            {showFeatures && (
              <>
                {/* OR Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text variant="caption" color="textMuted" style={styles.dividerText}>
                    OR
                  </Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* 3 Value Badges matching the design */}
                <View style={styles.featuresRow}>
                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconBadge, styles.featureBag]}>
                      <ShoppingBag size={20} color="#2563EB" strokeWidth={2.2} />
                    </View>
                    <Text variant="caption" weight="medium" color="textSecondary" align="center" style={styles.featureLabel}>
                      Wide range{'\n'}of products
                    </Text>
                  </View>

                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconBadge, styles.featureZap]}>
                      <Zap size={20} color="#059669" strokeWidth={2.2} />
                    </View>
                    <Text variant="caption" weight="medium" color="textSecondary" align="center" style={styles.featureLabel}>
                      Easy{'\n'}shopping
                    </Text>
                  </View>

                  <View style={styles.featureItem}>
                    <View style={[styles.featureIconBadge, styles.featureShield]}>
                      <ShieldCheck size={20} color="#7C3AED" strokeWidth={2.2} />
                    </View>
                    <Text variant="caption" weight="medium" color="textSecondary" align="center" style={styles.featureLabel}>
                      Secure{'\n'}& trusted
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* Legal Footer */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
              <Text variant="caption" color="textMuted" align="center" style={styles.footerTerms}>
                By continuing, you agree to our{' '}
                <Text variant="caption" weight="semiBold" style={styles.footerLink}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text variant="caption" weight="semiBold" style={styles.footerLink}>
                  Privacy Policy
                </Text>
                .
              </Text>
              <Text variant="caption" color="textMuted" align="center" style={styles.footerBrand}>
                SmartCart by icspl
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  heroBanner: {
    width: SCREEN_WIDTH,
    height: 290,
    backgroundColor: colors.primary,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -26,
    paddingHorizontal: 22,
    paddingTop: 28,
  },
  title: {
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginBottom: 24,
    lineHeight: 20,
  },
  formSlot: {
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 11,
    letterSpacing: 1,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureBag: {
    backgroundColor: '#EFF6FF',
  },
  featureZap: {
    backgroundColor: '#ECFDF5',
  },
  featureShield: {
    backgroundColor: '#F5F3FF',
  },
  featureLabel: {
    fontSize: 11,
    lineHeight: 15,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 8,
  },
  footerTerms: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 6,
    maxWidth: 290,
  },
  footerLink: {
    color: colors.primary,
  },
  footerBrand: {
    fontSize: 11,
    color: '#94A3B8',
  },
});

export default AuthLayout;
