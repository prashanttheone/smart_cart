import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { DrawerParamList, RootStackParamList } from '../navigation/types';
import { CategoryList } from '../components/CategoryList';
import { DealsOfTheDay } from '../components/DealsOfTheDay';
import { HomeHeader } from '../components/HomeHeader';
import { HomeSearchSection } from '../components/HomeSearchSection';
import { ProductGrid } from '../components/ProductGrid';
import { Text, useToastModal } from '../components/ui';
import { Product } from '../services/query/productQueries';

type HomeScreenNavProp = DrawerNavigationProp<DrawerParamList> &
  NativeStackNavigationProp<RootStackParamList>;

/**
 * Home feed layout:
 *   [fixed]  HomeHeader
 *   [scroll] ProductGrid — with Search / Banner / Categories / Deals injected
 *            via ListHeaderComponent so the feed stays virtualized.
 */
const HomeScreenComponent: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavProp>();
  const { showAlert, showToast } = useToastModal();

  // ── Local UI state ──────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [deliveryLocation, setDeliveryLocation] = useState({
    type: 'Home',
    address: 'Bangalore, 560001',
  });

  // ── Header actions (notifications / address / cart) ─────────────
  const handleNotificationsPress = useCallback(() => {
    showAlert({
      type: 'info',
      title: 'Notifications',
      message: 'You have no unread notifications right now.',
    });
  }, [showAlert]);

  const handleSelectAddress = useCallback((item: { type: string; address: string }) => {
    setDeliveryLocation({ type: item.type, address: item.address });
  }, []);

  const handlePressCart = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  // ── Search-row actions ────────────────────────────────────
  const handleSearchBarPress = useCallback(() => {
    navigation.navigate('Search', { initialQuery: '' });
  }, [navigation]);

  const handleScanPress = useCallback(() => {
    showAlert({
      type: 'info',
      title: 'Barcode & QR Scanner',
      message: 'Ready to scan product barcode or QR code.',
    });
  }, [showAlert]);

  const handleFilterPress = useCallback(() => {
    showToast({
      type: 'info',
      title: 'Filters',
      message: 'Product filters will appear here.',
    });
  }, [showToast]);

  // ── Product & category actions ──────────────────────────────
  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', { product });
    },
    [navigation]
  );

  const handleSelectCategory = useCallback(
    (slug: string) => {
      setSelectedCategory(slug);
      navigation.navigate('CategoryProducts', { category: slug });
    },
    [navigation]
  );

  // ── Scrollable header for ProductGrid ─
  const listHeaderComponent = (
    <>
      <HomeSearchSection
        onPressBar={handleSearchBarPress}
        onPressScan={handleScanPress}
        onPressFilter={handleFilterPress}
      />

      <View style={styles.bannerCard}>
        <Text variant="caption" weight="semiBold" style={styles.bannerTag}>
          SPECIAL OFFER
        </Text>
        <Text variant="h2" style={styles.bannerTitle}>
          Big Deals Everyday
        </Text>
        <Text variant="title" weight="bold" style={styles.bannerSubtitle}>
          Up to 50% OFF
        </Text>
      </View>

      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      <DealsOfTheDay onPressProduct={handleProductPress} />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <HomeHeader
        locationType={deliveryLocation.type}
        addressText={deliveryLocation.address}
        hasUnreadNotifications={true}
        onSelectAddress={handleSelectAddress}
        onPressNotifications={handleNotificationsPress}
        onPressCart={handlePressCart}
      />

      <ProductGrid
        category={selectedCategory}
        limit={10}
        onPressProduct={handleProductPress}
        ListHeaderComponent={listHeaderComponent}
      />
    </View>
  );
};

export const HomeScreen = React.memo(HomeScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bannerCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#0755E8',
    shadowColor: '#0755E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerTag: {
    color: '#93C5FD',
    letterSpacing: 1,
    marginBottom: 6,
  },
  bannerTitle: {
    color: colors.textInverse,
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#FDE047',
  },
});

export default HomeScreen;
