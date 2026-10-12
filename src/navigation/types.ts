import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';

export type BottomTabParamList = {
  Home: undefined;
  Categories: { category?: string } | undefined;
  Wishlist: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  Orders: undefined;
  Settings: undefined;
};

import { Product } from '../services/query/productQueries';

export type RootStackParamList = {
  DrawerRoot: NavigatorScreenParams<DrawerParamList>;
  CategoryProducts: { category?: string; categoryName?: string };
  ProductDetails: { product?: Product; productId?: number };
  Cart: undefined;
  Checkout: undefined;
  Search: { initialQuery?: string } | undefined;
  Login: undefined;
  Register: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type DrawerNavProps<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;

export type BottomTabNavProps<T extends keyof BottomTabParamList> =
  BottomTabScreenProps<BottomTabParamList, T>;
