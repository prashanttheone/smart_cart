import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';

export type BottomTabParamList = {
  Home: undefined;
  Categories: undefined;
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
  ProductDetails: { product: Product };
  Cart: undefined;
  Checkout: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type DrawerNavProps<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;

export type BottomTabNavProps<T extends keyof BottomTabParamList> =
  BottomTabScreenProps<BottomTabParamList, T>;
