import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

const CATEGORIES = [
  { id: '1', title: 'Electronics', icon: '💻', count: 48 },
  { id: '2', title: 'Groceries & Foods', icon: '🍎', count: 120 },
  { id: '3', title: 'Fashion & Apparel', icon: '👕', count: 85 },
  { id: '4', title: 'Home & Kitchen', icon: '🏠', count: 64 },
  { id: '5', title: 'Beauty & Health', icon: '✨', count: 32 },
  { id: '6', title: 'Sports & Outdoors', icon: '⚽', count: 29 },
  { id: '7', title: 'Books & Stationery', icon: '📚', count: 50 },
  { id: '8', title: 'Toys & Gaming', icon: '🎮', count: 41 },
];

export function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Categories</Text>
        <Text style={styles.subtitle}>Discover items across 8 departments</Text>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardCount}>{item.count} items</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  list: {
    padding: 12,
  },
  card: {
    flex: 1,
    margin: 6,
    padding: 18,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 11,
    color: colors.textMuted,
  },
});

export default CategoriesScreen;
