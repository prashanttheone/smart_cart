import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AddressType = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  fullName: string;
  type: AddressType;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface AddressState {
  addresses: Address[];
  selectedAddressId: string;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Prashant Kumar',
    type: 'Home',
    streetAddress: 'Your saved delivery address goes here',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Prashant Kumar',
    type: 'Work',
    streetAddress: 'Tech Hub, Tower 4, Cyber City',
    city: 'Gurugram',
    state: 'Haryana',
    postalCode: '122002',
    country: 'India',
    phone: '+91 98765 43210',
    isDefault: false,
  },
];

const initialState: AddressState = {
  addresses: INITIAL_ADDRESSES,
  selectedAddressId: 'addr-1',
};

export const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    selectAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddressId = action.payload;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
      if (action.payload.isDefault) {
        state.selectedAddressId = action.payload.id;
        state.addresses.forEach((addr) => {
          if (addr.id !== action.payload.id) {
            addr.isDefault = false;
          }
        });
      }
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const index = state.addresses.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    deleteAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = state.addresses[0]?.id ?? '';
      }
    },
  },
});

export const { selectAddress, addAddress, updateAddress, deleteAddress } =
  addressSlice.actions;

export default addressSlice.reducer;
