import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';
import { useToastModal } from '../ui/ToastModalContext';
import { AuthLayout } from '../layout/AuthLayout';
import { api } from '../../services/api/apiClient';
import { appStorage, STORAGE_KEYS } from '../../services/storage/asyncStorage';
import { useAppDispatch } from '../../store';
import { setUser, setToken } from '../../store/slices/authSlice';
import { ENDPOINTS } from '../../app/lib/EndPoint';

export interface LoginProps {
  onSuccess?: () => void;
  onNavigateToRegister?: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onNavigateToRegister,
  onBack,
  showBack = false,
}) => {
  const dispatch = useAppDispatch();
  const { showToast, showAlert } = useToastModal();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const loginUrl = ENDPOINTS.AUTH.buildUrl(ENDPOINTS.AUTH.LOGIN);
      const res = await api.post<{
        message?: string;
        userId: string;
        email: string;
        full_name?: string;
        token: string;
      }>(loginUrl, {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res && res.token) {
        await appStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
        dispatch(
          setUser({
            id: res.userId,
            email: res.email,
            name: res.full_name || res.email.split('@')[0],
          })
        );
        dispatch(setToken(res.token));

        showToast({
          type: 'success',
          title: 'Welcome back! 👋',
          message: `Signed in as ${res.full_name || res.email}`,
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Unable to sign in. Please verify your email and password.';

      showAlert({
        type: 'error',
        title: 'Sign In Failed',
        message: serverMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to continue to SmartCart."
      showBack={showBack}
      onBack={onBack}
      showFeatures={true}
    >
      <View style={styles.form}>
        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text weight="semiBold" size="sm" color="textPrimary" style={styles.label}>
            Email address
          </Text>
          <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
            <Mail size={18} color={emailError ? colors.danger : colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>
          {emailError ? (
            <Text variant="caption" color="danger" style={styles.errorText}>
              {emailError}
            </Text>
          ) : null}
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text weight="semiBold" size="sm" color="textPrimary" style={styles.label}>
              Password
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                showAlert({
                  type: 'info',
                  title: 'Password Reset',
                  message: 'A password reset link will be sent to your registered email address.',
                })
              }
            >
              <Text variant="caption" weight="semiBold" style={styles.forgotLink}>
                Forgot?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
            <Lock size={18} color={passwordError ? colors.danger : colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {showPassword ? (
                <EyeOff size={18} color={colors.textSecondary} />
              ) : (
                <Eye size={18} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text variant="caption" color="danger" style={styles.errorText}>
              {passwordError}
            </Text>
          ) : null}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleLogin}
          disabled={isLoading}
          style={[styles.submitBtn, isLoading ? styles.submitBtnDisabled : null]}
          accessibilityRole="button"
          accessibilityLabel="Continue to SmartCart"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text weight="bold" size="md" color="textInverse" style={styles.submitBtnText}>
                Continue with email
              </Text>
              <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.2} />
            </>
          )}
        </TouchableOpacity>

        {/* Toggle to Register */}
        {onNavigateToRegister && (
          <View style={styles.switchRow}>
            <Text variant="body" color="textSecondary" style={styles.switchText}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToRegister}>
              <Text weight="bold" size="sm" style={styles.switchLink}>
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    marginBottom: 6,
  },
  forgotLink: {
    color: colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 52,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  submitBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    marginRight: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
  },
  switchLink: {
    color: colors.primary,
  },
});

export default Login;
