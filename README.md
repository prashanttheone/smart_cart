# 🛒 SmartCart — Modern React Native E-Commerce App

SmartCart is a feature-packed, high-performance mobile e-commerce application built with **React Native (0.87)**, **TypeScript**, **Redux Toolkit**, and **TanStack Query**. It combines a rich product catalog with a hybrid dual-backend architecture, secure keychain authentication, native Firebase push notifications, and analytics tracking.

---

## 📱 Features & Functionality

### 🛍️ Product Catalog & Discovery
- **Extensive Catalog**: Explore products across multiple categories powered by the [DummyJSON API](https://dummyjson.com).
- **Deals of the Day**: Dedicated home screen section showcasing top-discounted products with real-time percentage badges.
- **Category Browsing**: Visual category grid and horizontal scroll bars with instant category-filtered product listings.
- **Search & Filter**: Real-time product search with query debouncing, sorting (price, discount, rating), and pagination.
- **Product Details Screen**: High-res image carousel, price breakdowns, stock counters, star ratings, customer reviews, and specifications.

### 🛒 Cart & Wishlist Management
- **Interactive Cart**: Increment/decrement item counts, delete items, and view live order summaries (subtotal, shipping, discounts, tax, and final amount).
- **Persistent Wishlist**: 1-tap heart toggle across product cards and detail pages to save items for later.
- **Instant Badge Badging**: Real-time cart count badges in bottom navigation tabs and home header.

### 💳 Checkout & Order Processing
- **Streamlined Checkout Flow**: Multi-step checkout covering shipping address, delivery options, and payment methods (Card, UPI, Net Banking, COD).
- **Order Placement**: Sends order payloads directly to the backend order processing service.
- **Order History & Tracking**: Authenticated order history dashboard displaying past orders, delivery status badges, tracking timestamps, and item receipts.
- **Protected State UI**: Clean, secure auth prompt when unauthenticated users access their orders.

### 🔐 Authentication & Security
- **Hybrid Backend Auth**: Secure registration and login connected to the custom backend API (`https://acrapathapi.schooldb.in`).
- **Encrypted Keychain Storage**: JWT tokens stored securely via `react-native-keychain` (with transparent `AsyncStorage` fallback for unsupported environments).
- **Persistent Sessions**: Automatic token restoration on app launch with session expiry handling.
- **Device & Platform Fingerprinting**: Device telemetry and OS version metadata attached to authentication handshakes.

### 🔔 Push Notifications & Analytics
- **Firebase Cloud Messaging (FCM)**: Remote push notification service integration.
- **Native Heads-Up Banners**: Powered by `@notifee/react-native` to display native Android & iOS push notification banners in foreground, background, and quit states.
- **Notification Channels**: Pre-configured high-importance Android channels (`smartcart_default_channel`, `smartcart_orders_channel`).
- **FCM Token Syncing**: Automatic token registration, refresh listeners, and backend token synchronization (`/api/auth/fcm-token`).
- **Firebase Analytics**: Automatic screen view logging via React Navigation and custom event tracking (e.g., checkout, login, sign-up).

### 🎨 Design System & UI/UX
- **Custom UI Component Library**: Centralized `Text`, `Button`, `ToastModal`, `ProductCard`, and `CategoryList` components.
- **Interactive Modals & Toasts**: Animated confirmation dialogs and alert banners with customizable icons and button variants.
- **Micro-Animations**: Smooth layout transitions driven by `react-native-reanimated` and gesture handling via `react-native-gesture-handler`.
- **Lucide Icons**: Crisp, vector iconography with `lucide-react-native`.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Core Framework** | React Native `0.87.1`, React `19.2.3` |
| **Language** | TypeScript `6.0` |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit` `2.13`), React-Redux `9.3` |
| **Server State & Caching** | TanStack Query (`@tanstack/react-query` `5.104`) |
| **Navigation** | React Navigation `7.x` (Native Stack, Bottom Tabs, Drawer) |
| **Networking** | Axios `1.20` with centralized interceptors & endpoints |
| **Secure Storage** | `react-native-keychain` `10.0` & `@react-native-async-storage/async-storage` `3.1` |
| **Push Notifications** | `@react-native-firebase/messaging` `26.4` & `@notifee/react-native` `9.1` |
| **Analytics** | `@react-native-firebase/analytics` `26.4` |
| **Animations & Gestures**| `react-native-reanimated` `4.7`, `react-native-gesture-handler` `3.3` |
| **Icons & Media** | `lucide-react-native`, `react-native-svg` `15.15` |
| **Testing** | Jest `29.6`, `react-test-renderer` `19.2` |

---

## 🌐 Dual Backend Architecture

SmartCart utilizes a hybrid API strategy:

```
                      ┌──────────────────────┐
                      │    SmartCart App     │
                      └──────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [DummyJSON Public API]       [Custom Backend Server]
        https://dummyjson.com      https://acrapathapi.schooldb.in
                 │                               │
        • Product Catalog               • User Auth (Register/Login)
        • Category Listings             • JWT Tokens & Sessions
        • Product Search & Sort         • FCM Token Registration
        • Product Reviews/Ratings       • Order Creation & History
```

---

## 📂 Project Structure

```
SmartCart/
├── __tests__/                  # Unit and integration test suites
├── android/                    # Android native configuration & Gradle files
│   └── app/
│       ├── google-services.json # Firebase Android configuration
│       └── src/main/AndroidManifest.xml
├── ios/                        # iOS native configuration & Podfile
├── src/
│   ├── app/
│   │   └── lib/
│   │       └── EndPoint.ts     # Centralized API URLs and endpoint contracts
│   ├── assets/                 # Local images, banners, and static files
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Login & Register modal/sheet components
│   │   ├── checkout/           # Address & payment selector components
│   │   ├── layout/             # Headers, search bars, and wrappers
│   │   ├── ui/                 # Text, ToastModal, and custom buttons
│   │   └── ProductCard.tsx     # Reusable product card with wishlist & cart buttons
│   ├── navigation/             # Navigators (RootStack, TabNavigator, Drawer)
│   ├── screens/                # Screen containers
│   │   ├── HomeScreen.tsx
│   │   ├── ProductDetailsScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── WishlistScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/               # Core services
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── auth/               # AuthProvider context & lifecycle
│   │   ├── firebase/           # FCM notifications & analytics service
│   │   ├── query/              # TanStack Query client configuration
│   │   └── storage/            # Keychain & AsyncStorage wrappers
│   ├── store/                  # Redux Toolkit store and slices
│   │   ├── slices/             # cartSlice, wishlistSlice, orderSlice, etc.
│   │   └── index.ts            # Root store and typed dispatch/selector hooks
│   ├── theme/                  # Color tokens, spacing, and styling constants
│   └── utils/                  # Helper utilities (deviceInfo, currency, validators)
├── App.tsx                     # App entry component with providers and listeners
├── index.js                    # React Native entry point & background task handler
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 22.11.0` (LTS recommended)
- **Package Manager**: `npm` or `yarn`
- **Android**: Android Studio with SDK `34+`, Java 17+, and an active emulator or USB device
- **iOS**: macOS with Xcode 15+, CocoaPods (`bundle install && bundle exec pod install`)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/SmartCart.git
cd SmartCart
npm install
```

### 2. Firebase Configuration
Ensure your `google-services.json` file is present in:
```
android/app/google-services.json
```
*(Contains `project_number`, `project_id`, `mobilesdk_app_id`, and `api_key` for Firebase Cloud Messaging and Analytics).*

### 3. Run on Android
```bash
# Start the Metro bundler
npm start

# In a separate terminal, install and run on Android
npm run android
```

### 4. Run on iOS (macOS only)
```bash
# Install CocoaPods dependencies
cd ios && pod install && cd ..

# Run iOS Simulator
npm run ios
```

---

## 🧪 Testing

SmartCart includes comprehensive test suites covering Redux slices, authentication, FCM token handling, push notifications, and UI components:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
