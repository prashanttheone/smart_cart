import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import cartReducer, { loadCart, CartItem } from './slices/cartSlice';
import wishlistReducer, { loadWishlist, WishlistItem } from './slices/wishlistSlice';
import searchReducer from './slices/searchSlice';
import addressReducer from './slices/addressSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import { appStorage, STORAGE_KEYS } from '../services/storage/asyncStorage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    search: searchReducer,
    addresses: addressReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
  },
});

// Automatic persistence subscription for cart & wishlist changes
let prevCartItems: CartItem[] | undefined;
let prevWishlistItems: WishlistItem[] | undefined;

store.subscribe(() => {
  const state = store.getState();
  if (state.cart.isLoaded && state.cart.items !== prevCartItems) {
    prevCartItems = state.cart.items;
    appStorage.setItem(STORAGE_KEYS.CART, state.cart.items);
  }
  if (state.wishlist.isLoaded && state.wishlist.items !== prevWishlistItems) {
    prevWishlistItems = state.wishlist.items;
    appStorage.setItem(STORAGE_KEYS.WISHLIST, state.wishlist.items);
  }
});

// Hydrate cart and wishlist from AsyncStorage on startup
store.dispatch(loadCart());
store.dispatch(loadWishlist());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
