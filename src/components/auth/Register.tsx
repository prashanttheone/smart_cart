import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  ShoppingBag,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from '../ui/Text';
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

  // Multi-step index: 1, 2, 3
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form states
  const [fullName, setFullName] = useState('');
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field validation error states
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Step transition animations
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (direction: 'next' | 'back', callback: () => void) => {
    const exitTo = direction === 'next' ? -50 : 50;
    const enterFrom = direction === 'next' ? 50 : -50;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: exitTo,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(enterFrom);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    let isValid = true;
    setFullNameError('');

    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      isValid = false;
    } else if (fullName.trim().length < 2) {
      setFullNameError('Name must be at least 2 characters');
      isValid = false;
    }

    return isValid;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPhoneError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Enter a valid email address');
      isValid = false;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      setPhoneError('Mobile number is required');
      isValid = false;
    } else if (cleanPhone.length < 10) {
      setPhoneError('Enter a valid 10-digit mobile number');
      isValid = false;
    }

    return isValid;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    let isValid = true;
    setPasswordError('');
    setConfirmPasswordError('');

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      animateTransition('next', () => setCurrentStep(2));
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      animateTransition('next', () => setCurrentStep(3));
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      animateTransition('back', () => setCurrentStep((prev) => prev - 1));
    } else if (onBack) {
      onBack();
    }
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;

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
        is_recruiter: isRecruiter,
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Profile';
      case 2:
        return 'Contact Details';
      case 3:
      default:
        return 'Set Password';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Step 1 of 3: Tell us your name and account type.';
      case 2:
        return 'Step 2 of 3: How should we get in touch with you?';
      case 3:
      default:
        return 'Step 3 of 3: Secure your SmartCart account.';
    }
  };

  return (
    <AuthLayout
      title={getStepTitle()}
      subtitle={getStepSubtitle()}
      showBack={showBack || currentStep > 1}
      onBack={handlePrev}
      showFeatures={currentStep === 1}
    >
      <View style={styles.container}>
        {/* Step Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(currentStep / totalSteps) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.stepDotsRow}>
            {[1, 2, 3].map((step) => {
              const isActive = step === currentStep;
              const isDone = step < currentStep;
              return (
                <View
                  key={`step-${step}`}
                  style={[
                    styles.stepBadge,
                    isActive && styles.stepBadgeActive,
                    isDone && styles.stepBadgeDone,
                  ]}
                >
                  <Text
                    weight="bold"
                    size="xs"
                    style={[
                      styles.stepBadgeText,
                      (isActive || isDone) && styles.stepBadgeTextActive,
                    ]}
                  >
                    {isDone ? '✓' : step}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Animated Step Content */}
        <Animated.View
          style={[
            styles.animatedStepContent,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <View>
              <View style={styles.inputGroup}>
                <Text weight="semiBold" size="sm" color="textPrimary" style={styles.label}>
                  Full name
                </Text>
                <View style={[styles.inputWrapper, fullNameError ? styles.inputError : null]}>
                  <User size={18} color={fullNameError ? colors.danger : colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. John Doe"
                    placeholderTextColor={colors.textMuted}
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      if (fullNameError) setFullNameError('');
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                {fullNameError ? (
                  <Text variant="caption" color="danger" style={styles.errorText}>
                    {fullNameError}
                  </Text>
                ) : null}
              </View>

              {/* Account Type Selector */}
              <View style={styles.inputGroup}>
                <Text weight="semiBold" size="sm" color="textPrimary" style={styles.label}>
                  Account Type
                </Text>
                <View style={styles.roleSelectorRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsRecruiter(false)}
                    style={[styles.roleCard, !isRecruiter && styles.roleCardSelected]}
                  >
                    <ShoppingBag size={20} color={!isRecruiter ? colors.primary : colors.textSecondary} />
                    <Text weight={!isRecruiter ? 'bold' : 'medium'} size="sm" style={!isRecruiter ? styles.roleTextSelected : styles.roleText}>
                      Shopper
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsRecruiter(true)}
                    style={[styles.roleCard, isRecruiter && styles.roleCardSelected]}
                  >
                    <Briefcase size={20} color={isRecruiter ? colors.primary : colors.textSecondary} />
                    <Text weight={isRecruiter ? 'bold' : 'medium'} size="sm" style={isRecruiter ? styles.roleTextSelected : styles.roleText}>
                      Partner
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: CONTACT DETAILS */}
          {currentStep === 2 && (
            <View>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text weight="semiBold" size="sm" color="textPrimary" style={styles.label}>
                  Email address
                </Text>
                <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                  <Mail size={18} color={emailError ? colors.danger : colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="name@example.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {emailError ? (
                  <Text variant="caption" color="danger" style={styles.errorText}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Mobile Number Input with Flag & +91 badge */}
              <View style={styles.inputGroup}>
                <Text weight="semiBold" size="sm" color="textPrimary" style={styles.label}>
                  Mobile number
                </Text>
                <View style={[styles.phoneInputRow, phoneError ? styles.inputError : null]}>
                  {/* Country Flag Badge */}
                  <View style={styles.countryCodeBadge}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                    <Text weight="bold" size="sm" color="textPrimary">
                      +91
                    </Text>
                  </View>
                  <View style={styles.phoneDivider} />
                  <TextInput
                    style={styles.phoneTextInput}
                    placeholder="Enter mobile number"
                    placeholderTextColor={colors.textMuted}
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text);
                      if (phoneError) setPhoneError('');
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
                {phoneError ? (
                  <Text variant="caption" color="danger" style={styles.errorText}>
                    {phoneError}
                  </Text>
                ) : null}
                <View style={styles.phoneHelperRow}>
                  <CheckCircle2 size={13} color="#059669" />
                  <Text variant="caption" color="textSecondary" style={styles.phoneHelperText}>
                    We will send order tracking updates to this number.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: SECURITY & PASSWORD */}
          {currentStep === 3 && (
            <View>
              {/* Password */}
              <View style={styles.inputGroup}>
                <Text weight="semiBold" size="sm" color="textPrimary" style={styles.label}>
                  Create password
                </Text>
                <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
                  <Lock size={18} color={passwordError ? colors.danger : colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
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

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text weight="semiBold" size="sm" color="textPrimary" style={styles.label}>
                  Confirm password
                </Text>
                <View style={[styles.inputWrapper, confirmPasswordError ? styles.inputError : null]}>
                  <ShieldCheck size={18} color={confirmPasswordError ? colors.danger : colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Re-enter password"
                    placeholderTextColor={colors.textMuted}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} color={colors.textSecondary} />
                    ) : (
                      <Eye size={18} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text variant="caption" color="danger" style={styles.errorText}>
                    {confirmPasswordError}
                  </Text>
                ) : null}
              </View>
            </View>
          )}
        </Animated.View>

        {/* Action Navigation Buttons */}
        <View style={styles.btnRow}>
          {currentStep > 1 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePrev}
              style={styles.backStepBtn}
              accessibilityRole="button"
              accessibilityLabel="Previous step"
            >
              <ArrowLeft size={18} color={colors.textPrimary} strokeWidth={2.2} />
              <Text weight="semiBold" size="sm" color="textPrimary" style={styles.backBtnText}>
                Back
              </Text>
            </TouchableOpacity>
          )}

          {currentStep < totalSteps ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNext}
              style={[styles.nextStepBtn, currentStep === 1 && styles.fullWidthBtn]}
              accessibilityRole="button"
              accessibilityLabel="Next step"
            >
              <Text weight="bold" size="md" color="textInverse" style={styles.nextBtnText}>
                {currentStep === 1 ? 'Next: Contact details' : 'Next: Set password'}
              </Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={isLoading}
              style={[styles.nextStepBtn, styles.saveBtn]}
              accessibilityRole="button"
              accessibilityLabel="Create account and save"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text weight="bold" size="md" color="textInverse" style={styles.nextBtnText}>
                    Create account & save
                  </Text>
                  <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

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
  container: {
    width: '100%',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  stepDotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepBadgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepBadgeDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepBadgeText: {
    color: '#94A3B8',
  },
  stepBadgeTextActive: {
    color: '#FFFFFF',
  },
  animatedStepContent: {
    minHeight: 180,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
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
  roleSelectorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  roleText: {
    color: colors.textSecondary,
  },
  roleTextSelected: {
    color: colors.primary,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    height: 52,
    overflow: 'hidden',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  phoneDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#CBD5E1',
    marginRight: 8,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  phoneHelperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginLeft: 2,
  },
  phoneHelperText: {
    fontSize: 11,
    lineHeight: 14,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  backStepBtn: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  backBtnText: {
    marginLeft: 2,
  },
  nextStepBtn: {
    flex: 1,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  fullWidthBtn: {
    width: '100%',
  },
  saveBtn: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  nextBtnText: {
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
