import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeliveryMethod {
  id: string;
  title: string;
  estimate: string;
  price: number;
}

export type PaymentType = 'all' | 'upi' | 'card' | 'cod';

export interface PaymentMethod {
  id: string;
  type: PaymentType;
  title: string;
  subtitle: string;
}

export interface CheckoutState {
  selectedDeliveryMethodId: string;
  selectedPaymentMethodId: string;
  availableDeliveryMethods: DeliveryMethod[];
  availablePaymentMethods: PaymentMethod[];
  discountApplied: boolean;
  discountAmount: number;
  promoCode: string | null;
  isSubmitting: boolean;
  error: string | null;
}

const DEFAULT_DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'standard',
    title: 'Standard delivery',
    estimate: 'Ships in 3–5 business days',
    price: 0,
  },
  {
    id: 'express',
    title: 'Express delivery',
    estimate: 'Ships in 1–2 business days',
    price: 4.99,
  },
];

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'default_all',
    type: 'all',
    title: 'Payment Method',
    subtitle: 'UPI, cards, or Cash on Delivery',
  },
  {
    id: 'upi',
    type: 'upi',
    title: 'UPI Payment',
    subtitle: 'Google Pay, PhonePe, Paytm',
  },
  {
    id: 'card',
    type: 'card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, MasterCard, Rupay',
  },
  {
    id: 'cod',
    type: 'cod',
    title: 'Cash on Delivery',
    subtitle: 'Pay with cash at delivery',
  },
];

const initialState: CheckoutState = {
  selectedDeliveryMethodId: 'standard',
  selectedPaymentMethodId: 'default_all',
  availableDeliveryMethods: DEFAULT_DELIVERY_METHODS,
  availablePaymentMethods: DEFAULT_PAYMENT_METHODS,
  discountApplied: true,
  discountAmount: 0,
  promoCode: 'SMARTFIRST',
  isSubmitting: false,
  error: null,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    selectDeliveryMethod: (state, action: PayloadAction<string>) => {
      state.selectedDeliveryMethodId = action.payload;
    },
    selectPaymentMethod: (state, action: PayloadAction<string>) => {
      state.selectedPaymentMethodId = action.payload;
    },
    applyPromoCode: (
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) => {
      state.promoCode = action.payload.code;
      state.discountAmount = action.payload.discount;
      state.discountApplied = true;
    },
    removePromoCode: (state) => {
      state.promoCode = null;
      state.discountAmount = 0;
      state.discountApplied = false;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  selectDeliveryMethod,
  selectPaymentMethod,
  applyPromoCode,
  removePromoCode,
  setSubmitting,
  setError,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
