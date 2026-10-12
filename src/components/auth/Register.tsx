import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';
import { Input, InputRef } from '../ui/Input';
import { useToastModal } from '../ui/ToastModalContext';
import { AuthLayout } from '../layout/AuthLayout';
import { api } from '../../services/api/apiClient';
import { appStorage, STORAGE_KEYS } from '../../services/storage/asyncStorage';
import { useAppDispatch } from '../../store';
import { setUser, setToken } from '../../store/slices/authSlice';
import { ENDPOINTS } from '../../app/lib/EndPoint';

export interface RegisterProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const Register: React.FC<RegisterProps> = ({
  onSuccess,
  onNavigateToLogin,
  onBack,
  showBack = false,
}) => {
  const dispatch = useAppDispatch();
  const { showToast, showAlert } = useToastModal();

  // Input refs for automatic keyboard "Next" navigation
  const emailRef = useRef<InputRef>(null);
  const phoneRef = useRef<InputRef>(null);
  const passwordRef = useRef<InputRef>(null);
  const confirmPasswordRef = useRef<InputRef>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Field validation error states
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Complete Form Validation
  const validate = (): boolean => {
    let isValid = true;
    setFullNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Full name
    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      isValid = false;
    } else if (fullName.trim().length < 2) {
      setFullNameError('Name must be at least 2 characters');
      isValid = false;
    }

    // Email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Enter a valid email address');
      isValid = false;
    }

    // Phone
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      setPhoneError('Mobile number is required');
      isValid = false;
    } else if (cleanPhone.length < 10) {
      setPhoneError('Enter a valid 10-digit mobile number');
      isValid = false;
    }

    // Password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    // Confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const registerUrl = ENDPOINTS.AUTH.buildUrl(ENDPOINTS.AUTH.REGISTER);
      const res = await api.post<{
        message?: string;
        userId: string;
        email: string;
        full_name?: string;
        token: string;
      }>(registerUrl, {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        is_recruiter: false, // Default shopper account
      });

      if (res && res.token) {
        await appStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.token);
        dispatch(
          setUser({
            id: res.userId,
            email: res.email,
            name: res.full_name || fullName.trim(),
          })
        );
        dispatch(setToken(res.token));

        showToast({
          type: 'success',
          title: 'Account Created! 🎉',
          message: `Welcome to SmartCart, ${res.full_name || fullName}!`,
        });

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Unable to create account. Please check your details and try again.';

      showAlert({
        type: 'error',
        title: 'Registration Failed',
        message: serverMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to start shopping on SmartCart."
      showBack={showBack}
      onBack={onBack}
      showFeatures={true}
    >
      <View style={styles.form}>
        {/* 1. Full Name Input */}
        <Input
          label="Full name"
          placeholder="e.g. John Doe"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            if (fullNameError) setFullNameError('');
          }}
          error={fullNameError}
          leftIcon={<User size={18} color={fullNameError ? colors.danger : colors.textSecondary} />}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          editable={!isLoading}
        />

        {/* 2. Email Address Input */}
        <Input
          ref={emailRef}
          label="Email address"
          placeholder="name@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          leftIcon={<Mail size={18} color={emailError ? colors.danger : colors.textSecondary} />}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
          editable={!isLoading}
        />

        {/* 3. Mobile Number Input with +91 Flag Badge */}
        <View style={styles.phoneGroup}>
          <Input
            ref={phoneRef}
            label="Mobile number"
            placeholder="Enter mobile number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (phoneError) setPhoneError('');
            }}
            error={phoneError}
            leftElement={
              <View style={styles.countryCodeBadge}>
                <Text style={styles.flagEmoji}>🇮🇳</Text>
                <Text weight="bold" size="sm" color="textPrimary">
                  +91
                </Text>
                <View style={styles.phoneDivider} />
              </View>
            }
            keyboardType="phone-pad"
            maxLength={10}
            returnKeyType="done"
            editable={!isLoading}
          />
          <View style={styles.phoneHelperRow}>
            <CheckCircle2 size={13} color="#059669" />
            <Text variant="caption" color="textSecondary" style={styles.phoneHelperText}>
              We will send order tracking updates to this number.
            </Text>
          </View>
        </View>

        {/* 4. Password Input */}
        <Input
          ref={passwordRef}
          label="Password"
          placeholder="At least 6 characters"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          leftIcon={<Lock size={18} color={passwordError ? colors.danger : colors.textSecondary} />}
          isPassword={true}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          editable={!isLoading}
        />

        {/* 5. Confirm Password Input */}
        <Input
          ref={confirmPasswordRef}
          label="Confirm password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (confirmPasswordError) setConfirmPasswordError('');
          }}
          error={confirmPasswordError}
          leftIcon={<ShieldCheck size={18} color={confirmPasswordError ? colors.danger : colors.textSecondary} />}
          isPassword={true}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
          editable={!isLoading}
        />

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleRegister}
          disabled={isLoading}
          style={[styles.submitBtn, isLoading ? styles.submitBtnDisabled : null]}
          accessibilityRole="button"
          accessibilityLabel="Create account"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text weight="bold" size="md" color="textInverse" style={styles.submitBtnText}>
                Create account
              </Text>
              <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.2} />
            </>
          )}
        </TouchableOpacity>

        {/* Toggle to Login */}
        {onNavigateToLogin && (
          <View style={styles.switchRow}>
            <Text variant="body" color="textSecondary" style={styles.switchText}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onNavigateToLogin}>
              <Text weight="bold" size="sm" style={styles.switchLink}>
                Sign in
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
  phoneGroup: {
    marginBottom: 0,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 10,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
    marginLeft: 6,
  },
  phoneHelperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 4,
  },
  phoneHelperText: {
    fontSize: 11,
    lineHeight: 14,
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

export default Register;
