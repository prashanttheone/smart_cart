# 🛒 SmartCart — Modern React Native E-Commerce App

SmartCart is a production-grade, high-performance mobile e-commerce application built with **React Native (0.87.1)**, **React 19**, **TypeScript**, **Redux Toolkit**, and **TanStack Query**. It combines a rich product catalog with a hybrid dual-backend architecture, secure keychain authentication, native push notifications, deep-linking, R8/ProGuard release minification, and profiling instrumentation.

---

## 📱 Features & Functionality

### 🛍️ Product Catalog & Discovery
- **Comprehensive Catalog**: Browse 100+ products across multiple categories powered by the [DummyJSON API](https://dummyjson.com).
- **Deals of the Day**: Dedicated home screen carousel showcasing top-discounted products with instant percentage badges.
- **Category Browsing**: Visual category grid and horizontal scroll bars with instant category-filtered product listings.
- **Instant Search with Autocomplete**: Real-time search with a 300ms debounce, recent search history chips, popular search keywords, and highlighted search match text.
- **Multi-Factor Sorting & Filtering**: Sort by price, rating, discount, and title; paginate dynamically with TanStack Query caching.
- **Rich Product Details**: High-resolution image gallery carousel, discount breakdown, stock indicator badges, star ratings, customer review list, and technical specifications.

### 🛒 Cart & Wishlist Management
- **Interactive Cart**: Increment/decrement quantities, swipe-to-delete/remove items, and view live order summaries (subtotal, shipping, discount, taxes, final total).
- **Persistent Wishlist**: 1-tap heart toggle across product cards, grid views, and detail pages to save items for later.
- **Synchronized Badges**: Real-time cart and wishlist badge counts displayed across the bottom navigation tab bar and header icons.

### 💳 Checkout & Order Processing
- **Seamless Checkout Flow**: Multi-step checkout with delivery address selection/creation and payment method dropdown.
- **Order Placement**: Direct payload submission to the custom order processing API.
- **Order History & Receipts**: Authenticated dashboard displaying past orders, delivery status badges (`Pending`, `Confirmed`, `Processing`, `Delivered`), tracking dates, and itemized breakdown.
- **Protected View State**: Clean, secure auth prompt and redirect when unauthenticated users attempt to access checkout or orders.

### 🔐 Authentication & Security
- **Hybrid Backend Auth**: Secure registration and login connected to the custom backend API (`https://acrapathapi.schooldb.in`).
- **Encrypted Keychain Storage**: JWT tokens stored securely via `react-native-keychain` (with transparent `AsyncStorage` fallback).
- **Persistent Sessions**: Automatic token restoration on app boot, auto-attaching bearer tokens via Axios request interceptors.
- **Device & Telemetry Metadata**: Device model, brand, OS version, and app version automatically tracked on authentication handshakes.

### 🔔 Push Notifications & Deep Linking
- **Firebase Cloud Messaging (FCM)**: Remote push notification service with token registration and refresh listeners.
- **Native Heads-Up Banners**: Powered by `@notifee/react-native` to display native Android & iOS push notification banners with sound and vibration.
- **Android Notification Channels**: Pre-configured high-importance notification channels (`smartcart_default_channel`, `smartcart_orders_channel`, `smartcart_promotions_channel`).
- **Notification Deep-Linking**: Tapping an order update notification navigates the user directly to the **Orders screen** (`DrawerRoot -> MainTabs -> Orders`).
- **Foreground, Background & Quit States**: Background message handler registered in `index.js` and quit-state initial notification recovery in `App.tsx`.
- **Android 13+ Runtime Permissions**: Supports `POST_NOTIFICATIONS` runtime permission checks and user notification preferences in Settings.

### ⚡ Performance & Profiling Instrumentation
- **Android `<profileable>` Enabled**: Configured with `<profileable android:shell="true" />` in `AndroidManifest.xml` for low-overhead release profiling using Android Studio Profiler, Simpleperf, and Perfetto.
- **R8 / ProGuard Minification**: Fully enabled for release builds (`enableProguardInReleaseBuilds = true`) with custom keep rules preserving TurboModules, Fabric JNI, Hermes, and native modules.
- **React Profiler Optimizations**:
  - **Modal Short-Circuiting**: Inactive sheets (`AddressBottomSheet`, `PaymentMethodBottomSheet`) return `null` when `visible={false}`, eliminating 100% of unmounted render overhead.
  - **Component Memoization**: `Input`, `LoginForm`, `HomeSearchBar`, and `ProductCard` wrapped in `React.memo` with custom scalar comparators.
  - **Hook Allocation Reduction**: Inlined cheap scalar math in `ProductCard`, removing 7 unnecessary `useMemo` hooks per card instance.
  - **Header Decoupling**: Encapsulated search input state into `HomeSearchSection`, preventing `listHeaderComponent` from invalidating the entire product list on every keystroke.
  - **Static Tab Options**: Extracted static route options outside `TabNavigator` render cycles to eliminate repetitive allocations.

### 🎨 Design System & UI/UX
- **Custom UI Library**: Standardized `Text`, `Button`, `Input`, `ToastModal`, `ProductCard`, and `CategoryList` components.
- **Dark Mode & Dynamic Status Bar**: System-aware status bar (`dark-content` / `light-content`) and coordinated surface color palette.
- **Micro-Animations**: Smooth layout transitions driven by `react-native-reanimated` (4.x) and touch interactions via `react-native-gesture-handler`.
- **Vector Icons**: Lucide iconography via `lucide-react-native`.

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
| **Icons & SVG** | `lucide-react-native`, `react-native-svg` `15.15` |
| **Minification & Engine**| ProGuard / R8, Hermes JavaScript Engine |
| **Testing** | Jest `29.6`, `react-test-renderer` `19.2` |

---

## 🌐 Dual Backend Architecture

SmartCart uses a hybrid dual-backend design separating the public e-commerce catalog from authenticated user account transactions:

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
        • Categories & Deals            • JWT Tokens & Sessions
        • Autocomplete & Search         • Order Creation (POST /api/orders)
        • Reviews & Specifications      • User Order History (GET /api/orders/user/:id)
```

---

## 📂 Project Structure

```
SmartCart/
├── __tests__/                      # Jest test suites
│   ├── App.test.tsx                # App root & navigation test suite
│   ├── AuthFcm.test.tsx            # Auth, FCM token & push notification tests
│   └── Components.test.tsx         # UI component render & behavior tests
├── android/                        # Android native project & Gradle build scripts
│   ├── app/
│   │   ├── google-services.json    # Firebase Android configuration
│   │   ├── proguard-rules.pro      # Custom R8/ProGuard preservation rules
│   │   ├── build.gradle            # App-level build config (minifyEnabled, R8)
│   │   └── src/main/
│   │       └── AndroidManifest.xml # Permissions, channels & <profileable> flag
│   ├── build.gradle                # Root project build configuration
│   └── gradle.properties           # Architecture flags, JVM args, Hermes, NewArch
├── ios/                            # iOS native project & Podfile
├── src/
│   ├── app/
│   │   └── lib/
│   │       └── EndPoint.ts         # Centralized API URLs and endpoint contracts
│   ├── assets/                     # Static assets, images, and brand resources
│   ├── components/                 # Reusable UI components
│   │   ├── auth/                   # LoginForm, RegisterForm, AuthModal
│   │   ├── checkout/               # AddressBottomSheet, PaymentMethodBottomSheet, PlaceOrderBar
│   │   ├── layout/                 # Headers, search bars, and wrappers
│   │   ├── ui/                     # Text, Button, Input, ToastModal
│   │   ├── HomeSearchBar.tsx       # Memoized search input with debounce
│   │   └── ProductCard.tsx         # Memoized product card with scalar comparison
│   ├── navigation/                 # Navigation setup
│   │   ├── DrawerNavigator.tsx     # Side drawer navigation
│   │   ├── RootStackNavigator.tsx  # Root stack & modal screens
│   │   ├── TabNavigator.tsx        # Bottom tab navigator with memoized badges
│   │   └── types.ts                # TypeScript navigation param lists
│   ├── screens/                    # Application screens
│   │   ├── HomeScreen.tsx          # Home page, Deals of the Day, decoupled search
│   │   ├── ProductDetailsScreen.tsx# Product image gallery, specs, reviews
│   │   ├── CartScreen.tsx          # Cart items, price calculation, checkout CTA
│   │   ├── WishlistScreen.tsx      # Saved items grid & quick add-to-cart
│   │   ├── CheckoutScreen.tsx      # Address, payment method, order submission
│   │   ├── OrdersScreen.tsx        # Order history with status & tracking
│   │   ├── CategoriesScreen.tsx    # Category list & browsing
│   │   ├── CategoryProductsScreen.tsx # Filtered category product view
│   │   ├── SearchScreen.tsx        # Search input with 300ms autocomplete debounce
│   │   ├── ProfileScreen.tsx       # User profile details & quick links
│   │   ├── AuthScreen.tsx          # Login & registration container
│   │   └── SettingsScreen.tsx      # Notification toggles & preferences
│   ├── services/                   # Core business & external services
│   │   ├── api/                    # Axios client instance & interceptors
│   │   ├── auth/                   # AuthProvider context & token lifecycle
│   │   ├── firebase/               # FCM notifications & Firebase Analytics
│   │   ├── query/                  # TanStack Query client & product queries
│   │   └── storage/                # Keychain & AsyncStorage secure storage
│   ├── store/                      # Redux Toolkit state management
│   │   ├── slices/                 # cartSlice, wishlistSlice, orderSlice, searchSlice, authSlice
│   │   └── index.ts                # Root store and typed useAppDispatch / useAppSelector
│   ├── theme/                      # Design tokens (colors, typography, spacing)
│   └── utils/                      # Helper utilities (searchUtils, deviceInfo, formatters)
├── App.tsx                         # App entry with Providers, listeners & deep linking
├── index.js                        # RN entry point & background message handlers
├── jest.config.js                  # Jest configuration
└── package.json                    # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 22.11.0` (LTS recommended)
- **Package Manager**: `npm`
- **Android**: Android Studio with SDK `34+`, Java 17+, and an active emulator or USB connected device
- **iOS**: macOS with Xcode 15+ and CocoaPods

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/prashanttheone/smart_cart.git
cd SmartCart
npm install
```

### 2. Firebase Configuration
Ensure your `google-services.json` file is placed in:
```
android/app/google-services.json
```
This enables Firebase Cloud Messaging (FCM) and Firebase Analytics.

### 3. Running in Development

```bash
# Start the Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
cd ios && pod install && cd ..
npm run ios
```

---

## 📦 Building & Release

### Build Release APK with ProGuard / R8
To build a release APK with bytecode minification, dead code elimination, and the `<profileable>` flag:

```bash
cd android
./gradlew assembleRelease
```

The generated APK will be available at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Install and Launch on Connected Device
```bash
# Check connected device
adb devices

# Install release APK
adb install -r android/app/build/outputs/apk/release/app-release.apk

# Launch SmartCart application
adb shell monkey -p com.smartcart 1
```

---

## 🧪 Testing & Code Quality

```bash
# Run TypeScript static type checking
npx tsc --noEmit

# Run all Jest unit & component tests
npm test

# Run ESLint
npm run lint
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
