import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { DrawerParamList, RootStackParamList } from '../navigation/types';
import { HomeHeader } from '../components/HomeHeader';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { Text } from '../components/ui/Text';

type HomeScreenNavProp = DrawerNavigationProp<DrawerParamList> &
  NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState({
    type: 'Home',
    address: 'Bangalore, 560001',
  });

  const handleAddressPress = () => {
    Alert.alert(
      'Select Delivery Address',
      'Choose your preferred delivery location:',
      [
        {
          text: 'Home (Bangalore, 560001)',
          onPress: () =>
            setDeliveryLocation({
              type: 'Home',
              address: 'Bangalore, 560001',
            }),
        },
        {
          text: 'Office (Indiranagar, 560038)',
          onPress: () =>
            setDeliveryLocation({
              type: 'Office',
              address: 'Indiranagar, 560038',
            }),
        },
        {
          text: 'Other (Koramangala, 560034)',
          onPress: () =>
            setDeliveryLocation({
              type: 'Other',
              address: 'Koramangala, 560034',
            }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNotificationsPress = () => {
    Alert.alert('Notifications', 'You have no unread notifications right now.');
  };

  const handleScanPress = () => {
    Alert.alert('Barcode & QR Scanner', 'Ready to scan product barcode.');
  };

  const handleFilterPress = () => {
    Alert.alert('Filters', 'Open filter sheet / drawer.');
  };

  return (
    <View style={styles.container}>
      {/* HomeHeader with SmartCart logo, delivery address, notifications, and cart badge */}
      <HomeHeader
        locationType={deliveryLocation.type}
        addressText={deliveryLocation.address}
        hasUnreadNotifications={true}
        onPressAddress={handleAddressPress}
        onPressNotifications={handleNotificationsPress}
        onPressCart={() => navigation.navigate('Cart')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* HomeSearchBar with debounce, clear action, scanner & filter actions */}
        <View style={styles.searchContainer}>
          <HomeSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onDebouncedSearch={(q) => {
              setDebouncedQuery(q);
            }}
            onClear={() => {
              setSearchQuery('');
              setDebouncedQuery('');
            }}
            rightActionType="scan"
            onPressScan={handleScanPress}
            onPressFilter={handleFilterPress}
          />

          {debouncedQuery.length > 0 && (
            <View style={styles.searchActivePill}>
              <Text variant="caption" color="primaryLight">
                Searching for: <Text weight="semiBold" size="xs">{debouncedQuery}</Text>
              </Text>
            </View>
          )}
        </View>

        {/* Demo banner showcasing Poppins typography */}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
