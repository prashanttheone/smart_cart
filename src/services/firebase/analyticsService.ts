import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserId,
  setUserProperty,
  logViewItem,
  logAddToCart,
  logRemoveFromCart,
  logBeginCheckout,
  logPurchase,
  logLogin,
  logSignUp,
  logSearch,
} from '@react-native-firebase/analytics';

function getAnalyticsInstance() {
  try {
    return getAnalytics();
  } catch (error) {
    console.warn('[AnalyticsService] getAnalytics failed:', error);
    return null;
  }
}

/**
 * Service for Firebase Analytics tracking
 * Logs standard e-commerce events, custom app events, screen views, and user properties.
 */
export const analyticsService = {
  /**
   * Log a custom analytics event with optional key-value parameters
   */
  async logEvent(name: string, params: Record<string, any> = {}): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logEvent(analytics, name as any, params);
    } catch (error) {
      console.warn(`[AnalyticsService] Failed to log event "${name}":`, error);
    }
  },

  /**
   * Log a screen view event for screen navigation tracking
   */
  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logScreenView(analytics, {
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.warn(`[AnalyticsService] Failed to log screen view "${screenName}":`, error);
    }
  },

  /**
   * Set user ID upon login to correlate events across sessions
   */
  async setUserId(userId: string | null): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await setUserId(analytics, userId);
    } catch (error) {
      console.warn('[AnalyticsService] Failed to set user ID:', error);
    }
  },

  /**
   * Set a custom user property (e.g. is_recruiter, account_tier)
   */
  async setUserProperty(name: string, value: string | null): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await setUserProperty(analytics, name, value);
    } catch (error) {
      console.warn(`[AnalyticsService] Failed to set user property "${name}":`, error);
    }
  },

  // ==========================================
  // E-Commerce Event Helpers
  // ==========================================

  /**
   * Log when a user views a product details page
   */
  async logViewItem(product: {
    id: number | string;
    title: string;
    price: number;
    category?: string;
  }): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logViewItem(analytics, {
        currency: 'USD',
        value: Number(product.price),
        items: [
          {
            item_id: String(product.id),
            item_name: product.title,
            item_category: product.category || 'General',
            price: Number(product.price),
            quantity: 1,
          },
        ],
      });
    } catch (error) {
      console.warn('[AnalyticsService] Failed to log view_item:', error);
    }
  },

  /**
   * Log when a user adds an item to cart
   */
  async logAddToCart(item: {
    id: number | string;
    title: string;
    price: number;
    quantity: number;
    category?: string;
  }): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logAddToCart(analytics, {
        currency: 'USD',
        value: Number((item.price * (item.quantity || 1)).toFixed(2)),
        items: [
          {
            item_id: String(item.id),
            item_name: item.title,
            item_category: item.category || 'General',
            price: Number(item.price),
            quantity: Number(item.quantity || 1),
          },
        ],
      });
    } catch (error) {
      console.warn('[AnalyticsService] Failed to log add_to_cart:', error);
    }
  },

  /**
   * Log when a user removes an item from cart
   */
  async logRemoveFromCart(item: {
    id: number | string;
    title: string;
    price: number;
    quantity: number;
  }): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logRemoveFromCart(analytics, {
        currency: 'USD',
        value: Number((item.price * (item.quantity || 1)).toFixed(2)),
        items: [
          {
            item_id: String(item.id),
            item_name: item.title,
            price: Number(item.price),
            quantity: Number(item.quantity || 1),
          },
        ],
      });
    } catch (error) {
      console.warn('[AnalyticsService] Failed to log remove_from_cart:', error);
    }
  },

  /**
   * Log when a user initiates the checkout process
   */
  async logBeginCheckout(value: number, _itemsCount?: number): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logBeginCheckout(analytics, {
        currency: 'USD',
        value: Number(value.toFixed(2)),
      });
    } catch (error) {
      console.warn('[AnalyticsService] Failed to log begin_checkout:', error);
    }
  },

  /**
   * Log a successful purchase / order completion
   */
  async logPurchase(order: {
    id: string;
    total: number;
    items?: any[];
  }): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logPurchase(analytics, {
        transaction_id: order.id,
        currency: 'USD',
        value: Number(order.total.toFixed(2)),
        items: (order.items || []).map((item) => ({
          item_id: String(item.id),
          item_name: item.title || 'Product',
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
        })),
      });
    } catch (error) {
      console.warn('[AnalyticsService] Failed to log purchase:', error);
    }
  },

  /**
   * Log user login event
   */
  async logLogin(method: string = 'email'): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logLogin(analytics, { method });
    } catch (error) {
      console.warn('[AnalyticsService] Failed to log login:', error);
    }
  },

  /**
   * Log user registration / sign up event
   */
  async logSignUp(method: string = 'email'): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logSignUp(analytics, { method });
    } catch (error) {
      console.warn('[AnalyticsService] Failed to log sign_up:', error);
    }
  },

  /**
   * Log search query
   */
  async logSearch(query: string): Promise<void> {
    try {
      const analytics = getAnalyticsInstance();
      if (!analytics) return;
      await logSearch(analytics, { search_term: query.trim() });
    } catch (error) {
      console.warn('[AnalyticsService] Failed to log search:', error);
    }
  },
};

export default analyticsService;
