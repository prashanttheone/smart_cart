import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { DrawerParamList, RootStackParamList } from '../navigation/types';
import { HomeHeader } from '../components/HomeHeader';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { CategoryList } from '../components/CategoryList';
import { DealsOfTheDay } from '../components/DealsOfTheDay';
import { ProductGrid } from '../components/ProductGrid';
import { Text, useToastModal } from '../components/ui';
import { Product } from '../services/query/productQueries';

type HomeScreenNavProp = DrawerNavigationProp<DrawerParamList> &
  NativeStackNavigationProp<RootStackParamList>;

const HomeSearchSection: React.FC<{
  onPressBar: () => void;
  onPressScan: () => void;
  onPressFilter: () => void;
}> = React.memo(({ onPressBar, onPressScan, onPressFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  return (
    <View style={styles.searchContainer}>
      <HomeSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onPressBar={onPressBar}
        onDebouncedSearch={setDebouncedQuery}
        onClear={handleClearSearch}
        rightActionType="scan"
        onPressScan={onPressScan}
        onPressFilter={onPressFilter}
      />

      {debouncedQuery.length > 0 && (
        <View style={styles.searchActivePill}>
          <Text variant="caption" color="primaryLight">
            Searching for: <Text weight="semiBold" size="xs">{debouncedQuery}</Text>
          </Text>
        </View>
      )}
    </View>
  );
});

const HomeScreenComponent: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavProp>();
  const { showAlert, showToast } = useToastModal();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [deliveryLocation, setDeliveryLocation] = useState({
    type: 'Home',
    address: 'Bangalore, 560001',
  });

  const handleNotificationsPress = useCallback(() => {
    showAlert({
      type: 'info',
      title: 'Notifications',
      message: 'You have no unread notifications right now.',
    });
  }, [showAlert]);

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

  const handleSearchBarPress = useCallback(() => {
    navigation.navigate('Search', { initialQuery: '' });
  }, [navigation]);

  const handleSelectAddress = useCallback((item: { type: string; address: string }) => {
    setDeliveryLocation({ type: item.type, address: item.address });
  }, []);

  const handlePressCart = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  // Header content rendered at the top of the paginated product grid - memoized
  const listHeaderComponent = useMemo(
    () => (
      <>
        {/* HomeSearchBar with debounce, clear action, scanner & filter actions */}
        <HomeSearchSection
          onPressBar={handleSearchBarPress}
          onPressScan={handleScanPress}
          onPressFilter={handleFilterPress}
        />

        {/* Special Offer Banner */}
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

        {/* Dynamic Category Slugs List */}
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Deals of the Day Section */}
        <DealsOfTheDay onPressProduct={handleProductPress} />
      </>
    ),
    [
      selectedCategory,
      handleSearchBarPress,
      handleScanPress,
      handleFilterPress,
      handleSelectCategory,
      handleProductPress,
    ]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* HomeHeader with SmartCart logo, delivery address, notifications, and cart badge */}
      <HomeHeader
        locationType={deliveryLocation.type}
        addressText={deliveryLocation.address}
        hasUnreadNotifications={true}
        onSelectAddress={handleSelectAddress}
        onPressNotifications={handleNotificationsPress}
        onPressCart={handlePressCart}
      />

      {/* 2-Column Paginated Grid with Auto Scroll-based Next Limit/Skip Fetching */}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.surface,
  },
  searchActivePill: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    alignSelf: 'flex-start',
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
