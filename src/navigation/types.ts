import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Product } from '../services/query/productQueries';

export type BottomTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  Orders: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  DrawerRoot: NavigatorScreenParams<DrawerParamList>;
  ProductDetails: { product: Product };
  Checkout: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type DrawerNavProps<T extends keyof DrawerParamList> =
  DrawerScreenProps<DrawerParamList, T>;

export type BottomTabNavProps<T extends keyof BottomTabParamList> =
  BottomTabScreenProps<BottomTabParamList, T>;
