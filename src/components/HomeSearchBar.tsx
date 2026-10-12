import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextInputProps,
  Platform,
} from 'react-native';
import { Search, X, ScanBarcode, SlidersHorizontal } from 'lucide-react-native';

import { colors } from '../theme/colors';
import { fontFamilies, fontSizes } from '../theme/typography';
import { Badge } from './ui/Badge';

export interface HomeSearchBarProps
  extends Omit<TextInputProps, 'onChangeText' | 'style'> {
  /**
   * Search input value (controlled)
   */
  value?: string;

  /**
   * Default initial search query (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Placeholder text
   * @default 'Search products, brands...'
   */
  placeholder?: string;

  /**
   * Debounce delay in milliseconds
   * @default 350
   */
  debounceMs?: number;

  /**
   * Callback fired immediately when text changes
   */
  onChangeText?: (query: string) => void;

  /**
   * Callback fired after debounce duration completes
   */
  onDebouncedSearch?: (debouncedQuery: string) => void;

  /**
   * Callback fired when user taps the clear button
   */
  onClear?: () => void;

  /**
   * Right action button type
   * @default 'scan'
   */
  rightActionType?: 'scan' | 'filter' | 'both';

  /**
   * Callback when barcode/QR scanner icon is pressed
   */
  onPressScan?: () => void;

  /**
   * Callback when filter icon is pressed (e.g. filter navigation)
   */
  onPressFilter?: () => void;

  /**
   * Whether any filter is currently applied (displays badge dot)
   */
  filterActive?: boolean;

  /**
   * If true, tapping the search bar triggers onPress instead of editing inline
   * (useful for navigating to a full-screen search view)
   */
  onPressBar?: () => void;

  /**
   * Outer container style override
   */
  containerStyle?: StyleProp<ViewStyle>;
}

export const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  value: controlledValue,
  defaultValue = '',
  placeholder = 'Search products, brands...',
  debounceMs = 350,
  onChangeText,
  onDebouncedSearch,
  onClear,
  rightActionType = 'scan',
  onPressScan,
  onPressFilter,
  filterActive = false,
  onPressBar,
  containerStyle,
  editable = true,
  autoFocus = false,
  ...inputProps
}) => {
  const [internalQuery, setInternalQuery] = useState(
    controlledValue !== undefined ? controlledValue : defaultValue
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  // Sync internal state if controlled value updates
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalQuery(controlledValue);
    }
  }, [controlledValue]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleQueryChange = useCallback(
    (text: string) => {
      if (controlledValue === undefined) {
        setInternalQuery(text);
      }
      onChangeText?.(text);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        onDebouncedSearch?.(text);
      }, debounceMs);
    },
    [controlledValue, debounceMs, onChangeText, onDebouncedSearch]
  );

  const handleClear = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (controlledValue === undefined) {
      setInternalQuery('');
    }
    onChangeText?.('');
    onDebouncedSearch?.('');
    onClear?.();
    inputRef.current?.focus();
  }, [controlledValue, onChangeText, onDebouncedSearch, onClear]);

  const activeText = controlledValue !== undefined ? controlledValue : internalQuery;
  const isClearVisible = activeText.length > 0;

  const content = (
    <View style={[styles.container, containerStyle]}>
      {/* Search Magnifying Glass Icon */}
      <View style={styles.leftIconWrapper}>
        <Search size={19} color={colors.textMuted} strokeWidth={2.2} />
      </View>

      {/* Input Field */}
      <TextInput
        ref={inputRef}
        value={activeText}
        onChangeText={handleQueryChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        returnKeyType="search"
        editable={editable && !onPressBar}
        pointerEvents={onPressBar ? 'none' : 'auto'}
        autoFocus={autoFocus}
        accessibilityLabel="Search input"
        accessibilityRole="search"
        {...inputProps}
      />

      {/* Clear Button */}
      {isClearVisible && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityLabel="Clear search text"
          accessibilityRole="button"
        >
          <X size={15} color={colors.textMuted} strokeWidth={2.5} />
        </TouchableOpacity>
      )}

      {/* Right Action: Barcode Scan / Filter Navigation */}
      {rightActionType === 'scan' && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressScan || onPressFilter}
          style={styles.rightActionButton}
          accessibilityLabel="Scan barcode or QR"
          accessibilityRole="button"
        >
          <ScanBarcode size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
      )}

      {rightActionType === 'filter' && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressFilter}
          style={styles.rightActionButton}
          accessibilityLabel="Filter products"
          accessibilityRole="button"
        >
          <SlidersHorizontal size={19} color={colors.textPrimary} strokeWidth={2.2} />
          {filterActive && (
            <View style={styles.filterDotWrapper}>
              <Badge dot variant="primary" size="sm" />
            </View>
          )}
        </TouchableOpacity>
      )}

      {rightActionType === 'both' && (
        <View style={styles.bothActionsWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressScan}
            style={styles.rightActionButton}
            accessibilityLabel="Scan barcode"
          >
            <ScanBarcode size={19} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressFilter}
            style={styles.rightActionButton}
            accessibilityLabel="Filter"
          >
            <SlidersHorizontal size={19} color={colors.textPrimary} strokeWidth={2.2} />
            {filterActive && (
              <View style={styles.filterDotWrapper}>
                <Badge dot variant="primary" size="sm" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (onPressBar) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPressBar}
        accessibilityRole="button"
        accessibilityLabel="Navigate to search"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  leftIconWrapper: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 0,
    includeFontPadding: false,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  rightActionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterDotWrapper: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  bothActionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default HomeSearchBar;
