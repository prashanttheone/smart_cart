import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';
import { api } from '../../services/api/apiClient';
import { ENDPOINTS } from '../../app/lib/EndPoint';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | string;

export interface Order {
  id: string;
  order_id?: string;
  user_id?: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
  items: CartItem[] | any[];
  shippingAddress?: string;
  address?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
}

export interface OrdersState {
  orders: Order[];
  recentOrder: Order | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    order_id: 'ORD-9821',
    date: 'Oct 11, 2026',
    total: 149.99,
    status: 'Delivered',
    itemsCount: 3,
    items: [],
  },
  {
    id: 'ORD-9740',
    order_id: 'ORD-9740',
    date: 'Oct 04, 2026',
    total: 42.5,
    status: 'Delivered',
    itemsCount: 1,
    items: [],
  },
  {
    id: 'ORD-9512',
    order_id: 'ORD-9512',
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
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export interface CreateOrderPayload {
  userId: string;
  address: string;
  items: CartItem[];
  totalAmount: number;
  deliveryMethod?: string;
  paymentMethod?: string;
  status?: string;
}

export const createOrderAsync = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>('orders/createOrderAsync', async (payload, { rejectWithValue }) => {
  try {
    const orderUrl = ENDPOINTS.ORDERS.buildUrl(ENDPOINTS.ORDERS.CREATE);

    // Curate exact payload matching backend createOrder controller:
    // { user_id, address, products: [{ id, title, price, thumbnail, quantity }], total_amount, status }
    const body = {
      user_id: payload.userId,
      userId: payload.userId,
      address: payload.address.trim(),
      products: payload.items.map((item) => ({
        id: item.id,
        title: item.title,
        price: Number(item.price) || 0,
        thumbnail: item.thumbnail || '',
        quantity: Number(item.quantity) || 1,
      })),
      total_amount: Number(payload.totalAmount.toFixed(2)),
      status: payload.status || 'pending',
      delivery_method: payload.deliveryMethod,
      payment_method: payload.paymentMethod,
    };

    const res = await api.post<{
      message?: string;
      order: {
        _id?: string;
        order_id: string;
        user_id: string;
        address: string;
        product?: any;
        products: any[];
        total_amount: number;
        status: string;
        created?: string;
        updated?: string;
      };
    }>(orderUrl, body);

    if (res && res.order) {
      const serverOrder = res.order;
      const formattedOrder: Order = {
        id: serverOrder.order_id,
        order_id: serverOrder.order_id,
        user_id: serverOrder.user_id,
        date: serverOrder.created
          ? new Date(serverOrder.created).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            }),
        total: Number(serverOrder.total_amount),
        status: serverOrder.status || 'Pending',
        itemsCount: (serverOrder.products || []).reduce(
          (sum: number, i: any) => sum + (Number(i.quantity) || 1),
          0
        ),
        items: payload.items,
        shippingAddress: serverOrder.address,
        address: serverOrder.address,
        deliveryMethod: payload.deliveryMethod,
        paymentMethod: payload.paymentMethod,
      };
      return formattedOrder;
    }

    return rejectWithValue('Invalid response structure received from order server');
  } catch (err: any) {
    const errMsg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      'Failed to create order on server';
    return rejectWithValue(errMsg);
  }
});

export const fetchUserOrders = createAsyncThunk<
  Order[],
  string,
  { rejectValue: string }
>('orders/fetchUserOrders', async (userId, { rejectWithValue }) => {
  try {
    const url = ENDPOINTS.ORDERS.buildUrl(ENDPOINTS.ORDERS.GET_BY_USER_ID(userId));
    const res = await api.get<{
      userId: string;
      count: number;
      orders: Array<{
        _id?: string;
        order_id: string;
        user_id: string;
        address: string;
        products: any[];
        total_amount: number;
        status: string;
        created?: string;
      }>;
    }>(url);

    if (res && Array.isArray(res.orders)) {
      return res.orders.map((o) => ({
        id: o.order_id,
        order_id: o.order_id,
        user_id: o.user_id,
        date: o.created
          ? new Date(o.created).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : 'Recent',
        total: Number(o.total_amount),
        status: o.status || 'Pending',
        itemsCount: (o.products || []).reduce(
          (sum: number, i: any) => sum + (Number(i.quantity) || 1),
          0
        ),
        items: o.products || [],
        shippingAddress: o.address,
        address: o.address,
      }));
    }

    return [];
  } catch (err: any) {
    const errMsg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      'Failed to fetch user orders';
    return rejectWithValue(errMsg);
  }
});

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
        order_id: `ORD-${randomNum}`,
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
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.orders.unshift(action.payload);
        state.recentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to place order';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.length > 0) {
          state.orders = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch orders';
      });
  },
});

export const { placeOrder, updateOrderStatus, clearRecentOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
