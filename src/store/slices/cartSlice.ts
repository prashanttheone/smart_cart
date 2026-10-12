import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appStorage, STORAGE_KEYS } from '../../services/storage/asyncStorage';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
  isLoaded: boolean;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalCount: 0,
  isLoaded: false,
};

/**
 * Async thunk to hydrate cart items from AsyncStorage
 */
export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async () => {
    const stored = await appStorage.getItem<CartItem[]>(STORAGE_KEYS.CART);
    return stored || [];
  }
);

function calculateTotals(items: CartItem[]) {
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalCount, totalAmount: Math.round(totalAmount * 100) / 100 };
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>
    ) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      const qty = action.payload.quantity ?? 1;

      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({
          id: action.payload.id,
          title: action.payload.title,
          price: action.payload.price,
          thumbnail: action.payload.thumbnail,
          quantity: qty,
        });
      }

      const totals = calculateTotals(state.items);
      state.totalCount = totals.totalCount;
      state.totalAmount = totals.totalAmount;
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalCount = totals.totalCount;
      state.totalAmount = totals.totalAmount;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      const totals = calculateTotals(state.items);
      state.totalCount = totals.totalCount;
      state.totalAmount = totals.totalAmount;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.items = action.payload;
      const totals = calculateTotals(state.items);
      state.totalCount = totals.totalCount;
      state.totalAmount = totals.totalAmount;
      state.isLoaded = true;
    });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
