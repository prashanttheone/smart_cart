import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';
import { HomeSearchBar } from './HomeSearchBar';
import { Text } from './ui';

interface HomeSearchSectionProps {
  onPressBar: () => void;
  onPressScan: () => void;
  onPressFilter: () => void;
}

/**
 * Debounced search row shown at the top of the Home feed.
 * Isolated into its own memoized component so keystrokes do not
 * re-render HomeScreen or its virtualized ProductGrid.
 */
const HomeSearchSectionComponent: React.FC<HomeSearchSectionProps> = ({
  onPressBar,
  onPressScan,
  onPressFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  return (
    <View style={styles.container}>
      <HomeSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onPressBar={onPressBar}
        onDebouncedSearch={setDebouncedQuery}
        onClear={handleClearSearch}
        rightActionType="scan"
        onPressScan={onPressScan}
        onPressFilter={onPressFilter}
      />

      {debouncedQuery.length > 0 && (
        <View style={styles.activePill}>
          <Text variant="caption" color="primaryLight">
            Searching for: <Text weight="semiBold" size="xs">{debouncedQuery}</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

export const HomeSearchSection = React.memo(HomeSearchSectionComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.surface,
  },
  activePill: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});

export default HomeSearchSection;
