import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Preferences</Text>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Push Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Stack & Architecture</Text>
        <View style={styles.row}>
          <Text style={styles.label}>State Management</Text>
          <Text style={styles.value}>Redux Toolkit (RTK)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Server Cache</Text>
          <Text style={styles.value}>TanStack React Query</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>HTTP Client</Text>
          <Text style={styles.value}>Axios</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Local Storage</Text>
          <Text style={styles.value}>AsyncStorage</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Navigation</Text>
          <Text style={styles.value}>Stack + Tabs + Drawer</Text>
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
  section: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default SettingsScreen;
