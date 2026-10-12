import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Text } from './Text';

export interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  isRequired?: boolean;
}

export const Input = forwardRef<RNTextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      leftElement,
      rightElement,
      isPassword = false,
      containerStyle,
      inputWrapperStyle,
      inputStyle,
      isRequired = false,
      onFocus,
      onBlur,
      secureTextEntry,
      editable = true,
      ...restProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      if (onBlur) {
        onBlur(e);
      }
    };

    const isSecure = isPassword ? !showPassword : secureTextEntry;

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        {label ? (
          <View style={styles.labelRow}>
            <Text
              weight="semiBold"
              size="sm"
              style={[
                styles.label,
                isFocused && !error ? styles.labelFocused : null,
                error ? styles.labelError : null,
              ]}
            >
              {label}
              {isRequired ? <Text style={styles.requiredAsterisk}> *</Text> : null}
            </Text>
          </View>
        ) : null}

        {/* Input Box Wrapper with Active on Focus */}
        <View
          style={[
            styles.inputWrapper,
            isFocused ? styles.inputWrapperFocused : null,
            error ? styles.inputWrapperError : null,
            !editable ? styles.inputWrapperDisabled : null,
            inputWrapperStyle,
          ]}
        >
          {/* Custom Left Element (e.g. +91 Flag Badge) */}
          {leftElement}

          {/* Left Icon */}
          {leftIcon ? (
            <View style={styles.leftIconWrapper}>
              {leftIcon}
            </View>
          ) : null}

          {/* Main Text Input */}
          <RNTextInput
            ref={ref}
            style={[styles.textInput, inputStyle]}
            placeholderTextColor={colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isSecure}
            editable={editable}
            {...restProps}
          />

          {/* Password Show/Hide Toggle */}
          {isPassword ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={18} color={isFocused ? colors.primary : colors.textSecondary} />
              ) : (
                <Eye size={18} color={isFocused ? colors.primary : colors.textSecondary} />
              )}
            </TouchableOpacity>
          ) : null}

          {/* Right Icon */}
          {rightIcon && !isPassword ? (
            <View style={styles.rightIconWrapper}>
              {rightIcon}
            </View>
          ) : null}

          {/* Custom Right Element */}
          {rightElement}
        </View>

        {/* Error Message */}
        {error ? (
          <Text variant="caption" color="danger" style={styles.errorText}>
            {error}
          </Text>
        ) : hint ? (
          <Text variant="caption" color="textMuted" style={styles.hintText}>
            {hint}
          </Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: colors.textPrimary,
  },
  labelFocused: {
    color: colors.primary,
  },
  labelError: {
    color: colors.danger,
  },
  requiredAsterisk: {
    color: colors.danger,
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
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: '#FEF2F2',
  },
  inputWrapperDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },
  leftIconWrapper: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconWrapper: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 4,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  hintText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
