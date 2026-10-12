import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appStorage, STORAGE_KEYS } from '../../services/storage/asyncStorage';
import { POPULAR_SEARCH_KEYWORDS, sanitizeSearchQuery } from '../../utils/searchUtils';

export interface SearchFilterState {
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchState {
  query: string;
  debouncedQuery: string;
  recentSearches: string[];
  popularSearches: string[];
  filters: SearchFilterState;
  isSearching: boolean;
}

const initialState: SearchState = {
  query: '',
  debouncedQuery: '',
  recentSearches: [],
  popularSearches: [...POPULAR_SEARCH_KEYWORDS],
  filters: {},
  isSearching: false,
};

const MAX_RECENT_SEARCHES = 10;

/**
 * Async thunk to hydrate recent searches from AsyncStorage
 */
export const loadRecentSearches = createAsyncThunk(
  'search/loadRecentSearches',
  async () => {
    const stored = await appStorage.getItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES);
    return stored || [];
  }
);

/**
 * Async thunk to save a new search query to recent searches
 */
export const saveRecentSearch = createAsyncThunk(
  'search/saveRecentSearch',
  async (rawQuery: string, { getState }) => {
    const cleanQuery = sanitizeSearchQuery(rawQuery);
    if (!cleanQuery) return [];

    const state = getState() as { search: SearchState };
    const current = state.search.recentSearches;

    // Place at front, remove duplicates, cap at MAX_RECENT_SEARCHES
    const updated = [
      cleanQuery,
      ...current.filter((item) => item.toLowerCase() !== cleanQuery.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);

    await appStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
    return updated;
  }
);

/**
 * Async thunk to remove a single recent search term
 */
export const removeRecentSearch = createAsyncThunk(
  'search/removeRecentSearch',
  async (termToRemove: string, { getState }) => {
    const state = getState() as { search: SearchState };
    const updated = state.search.recentSearches.filter(
      (item) => item.toLowerCase() !== termToRemove.toLowerCase()
    );

    await appStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, updated);
    return updated;
  }
);

/**
 * Async thunk to clear all recent searches
 */
export const clearAllRecentSearches = createAsyncThunk(
  'search/clearAllRecentSearches',
  async () => {
    await appStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    return [];
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
    },
    clearQuery: (state) => {
      state.query = '';
      state.debouncedQuery = '';
    },
    setSearchFilter: (state, action: PayloadAction<Partial<SearchFilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearchFilters: (state) => {
      state.filters = {};
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRecentSearches.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      })
      .addCase(saveRecentSearch.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      })
      .addCase(removeRecentSearch.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      })
      .addCase(clearAllRecentSearches.fulfilled, (state) => {
        state.recentSearches = [];
      });
  },
});

export const {
  setQuery,
  setDebouncedQuery,
  clearQuery,
  setSearchFilter,
  clearSearchFilters,
  setIsSearching,
} = searchSlice.actions;

export default searchSlice.reducer;
