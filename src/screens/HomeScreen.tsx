import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Menu, Search, ShoppingBag } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { DrawerParamList, RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavProp = DrawerNavigationProp<DrawerParamList> &
  NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavProp>();

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <Menu size={22} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={styles.brandTitle}>
          Smart<Text style={styles.brandAccent}>Cart</Text>
        </Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.7}
        >
          <ShoppingBag size={22} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Clean content body */}
      <View style={styles.content}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textMuted} strokeWidth={2} />
          <Text style={styles.searchPlaceholder}>Search products, brands, categories...</Text>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeSubtitle}>READY FOR YOUR DATA</Text>
          <Text style={styles.welcomeTitle}>Welcome to SmartCart</Text>
          <Text style={styles.welcomeDescription}>
            Home screen is clean and ready. Connect your endpoints and custom components here.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  brandAccent: {
    color: colors.secondary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.textMuted,
  },
  welcomeCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  welcomeSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93c5fd',
    letterSpacing: 1,
    marginBottom: 6,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textInverse,
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 13,
    color: '#dbeafe',
    lineHeight: 18,
  },
});

export default HomeScreen;
