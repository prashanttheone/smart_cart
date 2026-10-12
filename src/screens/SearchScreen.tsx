import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Search,
  X,
  Clock,
  TrendingUp,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';

import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setQuery,
  saveRecentSearch,
  removeRecentSearch,
  clearAllRecentSearches,
  loadRecentSearches,
} from '../store/slices/searchSlice';
import {
  useSearchProductsQuery,
  useSearchSuggestionsQuery,
  Product,
} from '../services/query/productQueries';
import { highlightSearchMatch } from '../utils/searchUtils';
import { ProductCard } from '../components/ProductCard';

type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;
type SearchScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SearchScreenNavProp>();
  const route = useRoute<SearchScreenRouteProp>();
  const dispatch = useAppDispatch();

  const inputRef = useRef<any>(null);

  // Redux search state
  const { recentSearches, popularSearches } = useAppSelector(
    (state) => state.search
  );

  // Local search query
  const initialQuery = route.params?.initialQuery || '';
  const [inputText, setInputText] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  // Load recent searches on mount
  useEffect(() => {
    dispatch(loadRecentSearches());
  }, [dispatch]);

  // Focus input automatically if no initial query
  useEffect(() => {
    if (!initialQuery) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]);

  // TanStack queries
  const { data: suggestionsData, isFetching: isFetchingSuggestions } =
    useSearchSuggestionsQuery(inputText);

  const {
    data: searchResultsData,
    isLoading: isLoadingResults,
    isFetching: isFetchingResults,
  } = useSearchProductsQuery(submittedQuery, { limit: 20 });

  const searchResults = searchResultsData?.products || [];
  const suggestions = suggestionsData?.products || [];

  // Submit search query
  const handleExecuteSearch = (queryToSearch: string) => {
    const trimmed = queryToSearch.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setInputText(trimmed);
    setSubmittedQuery(trimmed);
    dispatch(setQuery(trimmed));
    dispatch(saveRecentSearch(trimmed));
  };

  // Select suggestion item
  const handleSelectSuggestion = (suggestion: Product) => {
    Keyboard.dismiss();
    setInputText(suggestion.title);
    setSubmittedQuery(suggestion.title);
    dispatch(saveRecentSearch(suggestion.title));
  };

  // Clear search input
  const handleClearInput = () => {
    setInputText('');
    setSubmittedQuery('');
    dispatch(setQuery(''));
    inputRef.current?.focus();
  };

  // Product press handler
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', { product });
  };

  // Render recent searches chips
  const renderRecentAndPopular = () => (
    <View style={styles.discoveryContainer}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.sectionTitle}>Recent Searches</Text>
            </View>
            <TouchableOpacity
              onPress={() => dispatch(clearAllRecentSearches())}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.clearAllBtn}
            >
              <Trash2 size={13} color={colors.danger} />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chipsWrap}>
            {recentSearches.map((term) => (
              <View key={term} style={styles.recentChip}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleExecuteSearch(term)}
                  style={styles.chipTextBtn}
                >
                  <Text style={styles.chipText}>{term}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => dispatch(removeRecentSearch(term))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.chipRemoveBtn}
                >
                  <X size={13} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Popular / Trending Searches */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <TrendingUp size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>Popular Searches</Text>
        </View>
        <View style={styles.chipsWrap}>
          {popularSearches.map((keyword) => (
            <TouchableOpacity
              key={keyword}
              activeOpacity={0.75}
              onPress={() => handleExecuteSearch(keyword)}
              style={styles.popularChip}
            >
              <Text style={styles.popularChipText}>{keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // Render autocomplete suggestions dropdown list
  const renderSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      {isFetchingSuggestions && suggestions.length === 0 ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Finding suggestions...</Text>
        </View>
      ) : (
        suggestions.map((item) => {
          const matchParts = highlightSearchMatch(item.title, inputText);
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => handleSelectSuggestion(item)}
              style={styles.suggestionRow}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.suggestionThumb}
                resizeMode="cover"
              />
              <View style={styles.suggestionTextCol}>
                <Text style={styles.suggestionTitle} numberOfLines={1}>
                  {matchParts.map((part, i) => (
                    <Text
                      key={i}
                      style={
                        part.isMatch
                          ? styles.matchHighlight
                          : styles.regularMatch
                      }
                    >
                      {part.text}
                    </Text>
                  ))}
                </Text>
                <Text style={styles.suggestionCategory}>in {item.category}</Text>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );

  // Determine which body content to show
  const isTyping = inputText.trim().length >= 2 && inputText !== submittedQuery;
  const isShowingResults = submittedQuery.trim().length > 0;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* Top Safe Area Notch Bar with Shadow Grey Header */}
      <View
        style={[
          styles.safeTopBar,
          { paddingTop: insets.top + 30 },
        ]}
      >
        {/* Search Header Row */}
        <View style={styles.headerRow}>
          {/* Back Navigation Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>

          {/* Search Input Box */}
          <View style={styles.inputWrapper}>
            <Search size={18} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleExecuteSearch(inputText)}
              placeholder="Search products, brands, categories..."
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {inputText.length > 0 && (
              <TouchableOpacity
                onPress={handleClearInput}
                style={styles.clearBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {isTyping ? (
          renderSuggestions()
        ) : isShowingResults ? (
          isLoadingResults || isFetchingResults ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.centerText}>
                Searching for "{submittedQuery}"...
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>
                We couldn't find any items matching "{submittedQuery}". Try checking the spelling or use different keywords.
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsGrid}
              columnWrapperStyle={styles.gridRow}
              ListHeaderComponent={
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsCountText}>
                    Found {searchResultsData?.total ?? searchResults.length} results for{' '}
                    <Text style={styles.queryHighlight}>"{submittedQuery}"</Text>
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.gridItem}>
                  <ProductCard product={item} onPress={handleProductPress} />
                </View>
              )}
            />
          )
        ) : (
          renderRecentAndPopular()
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Top Safe Area Notch Bar with Shadow Grey color
  safeTopBar: {
    backgroundColor: '#f1f5f9', // Shadow grey color for status bar & notch
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    // Elevation & shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  discoveryContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 6,
  },
  chipTextBtn: {
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  chipRemoveBtn: {
    padding: 2,
  },
  popularChip: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  popularChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  suggestionsContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  suggestionThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.surfaceVariant,
  },
  suggestionTextCol: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  matchHighlight: {
    fontWeight: '800',
    color: colors.primary,
  },
  regularMatch: {
    fontWeight: '500',
    color: colors.textPrimary,
  },
  suggestionCategory: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  resultsHeader: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  resultsCountText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  queryHighlight: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultsGrid: {
    padding: 12,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridItem: {
    width: '48%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  centerText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SearchScreen;
