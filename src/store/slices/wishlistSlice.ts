import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appStorage, STORAGE_KEYS } from '../../services/storage/asyncStorage';

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category?: string;
  brand?: string;
  rating?: number;
  discountPercentage?: number;
}

export interface WishlistState {
  items: WishlistItem[];
  totalCount: number;
  isLoaded: boolean;
}

const initialState: WishlistState = {
  items: [],
  totalCount: 0,
  isLoaded: false,
};

/**
 * Async thunk to hydrate wishlist items from AsyncStorage
 */
export const loadWishlist = createAsyncThunk(
  'wishlist/loadWishlist',
  async () => {
    const stored = await appStorage.getItem<WishlistItem[]>(STORAGE_KEYS.WISHLIST);
    return stored || [];
  }
);

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        state.totalCount = state.items.length;
      }
    },

    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalCount = state.items.length;
    },

    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      state.totalCount = state.items.length;
    },

    clearWishlist: (state) => {
      state.items = [];
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
      state.totalCount = action.payload.length;
      state.isLoaded = true;
    });
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
