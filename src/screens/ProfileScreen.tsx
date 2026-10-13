import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { useToastModal } from '../components/ui';
import { useAuth } from '../services/auth';
import { appStorage } from '../services/storage/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showToast, showConfirm } = useToastModal();
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState<string | null>(null);

  useEffect(() => {
    appStorage.getItem<string>('@user_note').then((val) => {
      if (val) setSavedNote(val);
    });
  }, []);

  const handleSaveNote = async () => {
    if (!note.trim()) return;
    await appStorage.setItem('@user_note', note);
    setSavedNote(note);
    setNote('');
    showToast({
      type: 'success',
      title: 'Note Saved',
      message: 'Saved note successfully to local device storage!',
    });
  };

  const handleClearNote = async () => {
    showConfirm({
      type: 'confirm',
      title: 'Clear Saved Note',
      message: 'Are you sure you want to remove your stored note?',
      confirmText: 'Clear Note',
      confirmVariant: 'danger',
      onConfirm: async () => {
        await appStorage.removeItem('@user_note');
        setSavedNote(null);
        showToast({
          type: 'info',
          title: 'Note Cleared',
          message: 'Saved note was removed from local storage.',
        });
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Profile</Text>
      </View>

      {/* User Card */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name || user?.name
              ? (user.full_name || user.name).trim()[0].toUpperCase()
              : '👤'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{(user?.full_name || user?.name) ?? 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? 'Not logged in'}</Text>

          {user?.userId && (
            <View style={styles.userIdRow}>
              <Text style={styles.userIdLabel}>User ID: </Text>
              <Text style={styles.userIdValue} numberOfLines={1} ellipsizeMode="middle">
                {user.userId}
              </Text>
            </View>
          )}

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isAuthenticated ? colors.secondaryLight : colors.dangerLight },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isAuthenticated ? colors.secondary : colors.danger },
                ]}
              >
                {isAuthenticated ? '● Authenticated' : '○ Logged Out'}
              </Text>
            </View>

            {isAuthenticated && user?.is_recruiter && (
              <View style={styles.recruiterBadge}>
                <Text style={styles.recruiterBadgeText}>👔 Recruiter</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* AsyncStorage Demo Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AsyncStorage Demo</Text>
        <Text style={styles.cardSubtitle}>
          Test local persistence using @react-native-async-storage/async-storage:
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter a note or test string..."
          placeholderTextColor={colors.textMuted}
          value={note}
          onChangeText={setNote}
        />

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNote}>
            <Text style={styles.saveBtnText}>Save to Storage</Text>
          </TouchableOpacity>
          {savedNote && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearNote}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {savedNote && (
          <View style={styles.storedBox}>
            <Text style={styles.storedLabel}>Persisted in AsyncStorage:</Text>
            <Text style={styles.storedValue}>"{savedNote}"</Text>
          </View>
        )}
      </View>

      {/* Auth Actions */}
      <View style={styles.actionSection}>
        {isAuthenticated ? (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={async () => {
              await authLogout();
              showToast({
                type: 'info',
                title: 'Logged Out',
                message: 'You have been logged out of SmartCart.',
              });
            }}
          >
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.authButtonsStack}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Auth', { initialMode: 'login' })}
            >
              <Text style={styles.loginBtnText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Auth', { initialMode: 'register' })}
            >
              <Text style={styles.registerBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  card: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
  },
  userInfo: {},
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  userIdLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  userIdValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.textPrimary,
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  recruiterBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginLeft: 6,
  },
  recruiterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: 'row',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  saveBtnText: {
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 13,
  },
  clearBtn: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearBtnText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 13,
  },
  storedBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceVariant,
  },
  storedLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  storedValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
  },
  actionSection: {
    margin: 16,
  },
  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 15,
  },
  authButtonsStack: {
    gap: 10,
  },
  loginBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  loginBtnText: {
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 15,
  },
  registerBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  registerBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ProfileScreen;
