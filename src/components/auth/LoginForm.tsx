import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';
import { Input, InputRef } from '../ui/Input';
import { useToastModal } from '../ui/ToastModalContext';
import { useAuth } from '../../services/auth';

export interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const { login } = useAuth();
  const { showToast, showAlert } = useToastModal();

  const passwordRef = useRef<InputRef>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const result = await login(email, password);
      if (result.success) {
        showToast({
          type: 'success',
          title: 'Welcome back! 👋',
          message: 'Signed in successfully to SmartCart',
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        showAlert({
          type: 'error',
          title: 'Sign In Failed',
          message: result.message || 'Unable to sign in. Please verify your credentials.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      {/* Email Field with UI Input Box */}
      <Input
        label="Email address"
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) setEmailError('');
        }}
        error={emailError}
        leftIcon={<Mail size={18} color={emailError ? colors.danger : colors.textSecondary} />}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        editable={!isLoading}
      />

      {/* Password Field with UI Input Box */}
      <View style={styles.passwordContainer}>
        <Input
          ref={passwordRef}
          label="Password"
          placeholder="Enter your password"
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
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          editable={!isLoading}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleLogin}
        disabled={isLoading}
        style={[styles.submitBtn, isLoading ? styles.submitBtnDisabled : null]}
        accessibilityRole="button"
        accessibilityLabel="Continue with email"
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

      {/* Switch to Register */}
      {onSwitchToRegister && (
        <View style={styles.switchRow}>
          <Text variant="body" color="textSecondary" style={styles.switchText}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onSwitchToRegister}>
            <Text weight="bold" size="sm" style={styles.switchLink}>
              Create account
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 4,
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

export default LoginForm;
