import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
  items: CartItem[];
  shippingAddress?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
}

export interface OrdersState {
  orders: Order[];
  recentOrder: Order | null;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    date: 'Oct 11, 2026',
    total: 149.99,
    status: 'Delivered',
    itemsCount: 3,
    items: [],
  },
  {
    id: 'ORD-9740',
    date: 'Oct 04, 2026',
    total: 42.5,
    status: 'Delivered',
    itemsCount: 1,
    items: [],
  },
  {
    id: 'ORD-9512',
    date: 'Sep 28, 2026',
    total: 219.0,
    status: 'Delivered',
    itemsCount: 4,
    items: [],
  },
];

const initialState: OrdersState = {
  orders: INITIAL_ORDERS,
  recentOrder: null,
};

export interface PlaceOrderPayload {
  items: CartItem[];
  total: number;
  shippingAddress: string;
  deliveryMethod: string;
  paymentMethod: string;
}

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<PlaceOrderPayload>) => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newOrder: Order = {
        id: `ORD-${randomNum}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        total: action.payload.total,
        status: 'Confirmed',
        itemsCount: action.payload.items.reduce(
          (sum, i) => sum + i.quantity,
          0
        ),
        items: action.payload.items,
        shippingAddress: action.payload.shippingAddress,
        deliveryMethod: action.payload.deliveryMethod,
        paymentMethod: action.payload.paymentMethod,
      };

      state.orders.unshift(newOrder);
      state.recentOrder = newOrder;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    clearRecentOrder: (state) => {
      state.recentOrder = null;
    },
  },
});

export const { placeOrder, updateOrderStatus, clearRecentOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
