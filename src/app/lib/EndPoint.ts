/**
 * SmartCart API Endpoints
 * 1. DummyJSON API (Products, Categories, Mock Carts): https://dummyjson.com
 * 2. Custom Backend Server (Auth & Orders): http://localhost:3005 (or 10.0.2.2:3005 on Android)
 */


/**
 * Base URL for DummyJSON public catalog
 */
export const DUMMY_JSON_BASE_URL = 'https://dummyjson.com';
export const BASE_URL = DUMMY_JSON_BASE_URL; // Alias for backward compatibility

/**
 * Custom Backend Server Base URL (Auth & Orders)
 * Port: 3005
 * Android Emulator connects to host machine via 10.0.2.2
 * iOS Simulator and Web connect via localhost
 */
export const SERVER_BASE_URL = 'https://acrapathapi.schooldb.in';
export const API_BASE_URL = SERVER_BASE_URL;

// ==========================================
// Types & Query Interfaces
// ==========================================

export interface ProductQueryParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  select?: string | string[];
  modifiedAfter?: string;
  q?: string;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export interface OrderItemPayload {
  id: number | string;
  title: string;
  price: number;
  thumbnail?: string;
  quantity?: number;
}

export interface CreateOrderPayload {
  user_id?: string;
  userId?: string;
  address: string;
  products: OrderItemPayload[];
  total_amount?: number;
}

export interface OrderRecord {
  _id?: string;
  order_id: string;
  user_id: string;
  address: string;
  products: OrderItemPayload[];
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created?: string;
  updated?: string;
}

export interface LoginPayload {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

/**
 * Builds query string for /products with support for pagination, sorting, field selection, and date filter.
 */
export function buildProductQueryString(params?: ProductQueryParams): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  if (params.limit !== undefined) {
    searchParams.append('limit', String(params.limit));
  }
  if (params.skip !== undefined) {
    searchParams.append('skip', String(params.skip));
  }
  if (params.sortBy) {
    searchParams.append('sortBy', params.sortBy);
  }
  if (params.order) {
    searchParams.append('order', params.order);
  }
  if (params.select) {
    const selectStr = Array.isArray(params.select)
      ? params.select.join(',')
      : params.select;
    searchParams.append('select', selectStr);
  }
  if (params.modifiedAfter) {
    searchParams.append('modifiedAfter', params.modifiedAfter);
  }
  if (params.q) {
    searchParams.append('q', params.q);
  }

  const queryStr = searchParams.toString();
  return queryStr ? `?${queryStr}` : '';
}

// ==========================================
// Centralized API Endpoints Map
// ==========================================

export const ENDPOINTS = {
  // Base URLs
  BASE_URL,
  DUMMY_JSON_BASE_URL,
  SERVER_BASE_URL,
  API_BASE_URL,

  /**
   * Product Endpoints (DummyJSON)
   * Base URL: https://dummyjson.com
   */
  PRODUCTS: {
    // 1. GET /products (All products)
    LIST: '/products',

    // 2. GET /products/:id (Single product by ID)
    DETAIL: (id: number | string) => `/products/${id}`,

    // 3. GET /products/search?q=:query (Search products)
    SEARCH: (query: string) => `/products/search?q=${encodeURIComponent(query)}`,
    SEARCH_BASE: '/products/search',

    // 4. GET /products?limit=:limit&skip=:skip (Pagination & filtered query builder)
    PAGINATED: (params?: ProductQueryParams) =>
      `/products${buildProductQueryString(params)}`,

    // 5. GET /products?sortBy=:field&order=:order (Sorting products)
    SORT: (sortBy: string, order: 'asc' | 'desc' = 'asc') =>
      `/products?sortBy=${encodeURIComponent(sortBy)}&order=${order}`,

    // Deals of the Day (sorted by highest discount percentage)
    DEALS_OF_THE_DAY: (limit = 10) =>
      `/products?sortBy=discountPercentage&order=desc&limit=${limit}`,

    // 6. GET /products?select=:fields (Select specific fields, e.g. title,price)
    SELECT: (fields: string[] | string) => {
      const selectStr = Array.isArray(fields) ? fields.join(',') : fields;
      return `/products?select=${encodeURIComponent(selectStr)}`;
    },

    // 7. GET /products?modifiedAfter=:isoDate (Filter by modification date)
    MODIFIED_AFTER: (isoDate: string) =>
      `/products?modifiedAfter=${encodeURIComponent(isoDate)}`,

    // 10. GET /products/category/:category (Get products by category slug)
    BY_CATEGORY: (category: string, params?: Omit<ProductQueryParams, 'q'>) =>
      `/products/category/${encodeURIComponent(category)}${buildProductQueryString(params)}`,

    // Mutations
    ADD: '/products/add',
    UPDATE: (id: number | string) => `/products/${id}`,
    DELETE: (id: number | string) => `/products/${id}`,
  },

  /**
   * Category Endpoints (DummyJSON)
   * Base URL: https://dummyjson.com
   */
  CATEGORIES: {
    // 8. GET /products/categories (Categories with names, slugs, and URLs)
    LIST: '/products/categories',

    // 9. GET /products/category-list (Category slugs array)
    SLUG_LIST: '/products/category-list',

    // 10. GET /products/category/:category (Get products by category)
    PRODUCTS_BY_CATEGORY: (category: string, params?: Omit<ProductQueryParams, 'q'>) =>
      `/products/category/${encodeURIComponent(category)}${buildProductQueryString(params)}`,
  },

  /**
   * Cart Endpoints (DummyJSON mock carts)
   * Base URL: https://dummyjson.com
   */
  CARTS: {
    LIST: '/carts',
    DETAIL: (id: number | string) => `/carts/${id}`,
    USER_CART: (userId: number | string) => `/carts/user/${userId}`,
    ADD: '/carts/add',
    UPDATE: (id: number | string) => `/carts/${id}`,
    DELETE: (id: number | string) => `/carts/${id}`,
  },

  /**
   * Auth Endpoints (Custom Backend Server)
   * Base URL: SERVER_BASE_URL (http://10.0.2.2:3005 or http://localhost:3005)
   * Base Path: /api/auth
   */
  AUTH: {
    BASE_URL: SERVER_BASE_URL,
    // POST /api/auth/register (User registration)
    REGISTER: '/api/auth/register',

    // POST /api/auth/login (User login)
    LOGIN: '/api/auth/login',

    // POST /api/auth/fcm-token (Register FCM token)
    FCM_TOKEN: '/api/auth/fcm-token',

    // Full URL builder
    buildUrl: (path: string) =>
      `${SERVER_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
  },

  /**
   * Order Endpoints (Custom Backend Server)
   * Base URL: SERVER_BASE_URL (http://10.0.2.2:3005 or http://localhost:3005)
   * Base Path: /api/orders
   * Protected with middleware: router.use(requireAuth)
   */
  ORDERS: {
    BASE_URL: SERVER_BASE_URL,
    BASE_PATH: '/api/orders',
    REQUIRES_AUTH: true,

    // POST /api/orders (createOrder) [Protected with requireAuth]
    CREATE: '/api/orders',

    // GET /api/orders (getOrders) [Protected with requireAuth]
    LIST: '/api/orders',

    // GET /api/orders/user/:userId (getOrdersByUserId) [Protected with requireAuth]
    GET_BY_USER_ID: (userId: number | string) =>
      `/api/orders/user/${encodeURIComponent(String(userId))}`,

    // GET /api/orders/:id (getOrderById) [Protected with requireAuth]
    GET_BY_ID: (id: number | string) =>
      `/api/orders/${encodeURIComponent(String(id))}`,

    // Full URL builder
    buildUrl: (path: string) =>
      `${SERVER_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
  },
} as const;

export default ENDPOINTS;
