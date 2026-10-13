import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { keychainStorage } from '../storage/keychainStorage';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  User,
  setAuthSession,
  setInitializing,
  logout as logoutRedux,
} from '../../store/slices/authSlice';
import { api } from '../api/apiClient';
import { ENDPOINTS } from '../../app/lib/EndPoint';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (payload: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const reduxAuth = useAppSelector((state) => state.auth);

  const [token, setLocalToken] = useState<string | null>(null);
  const [user, setLocalUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializingState] = useState<boolean>(true);

  // Restore session from Keychain on app launch
  const restoreSession = useCallback(async () => {
    try {
      setIsInitializingState(true);
      dispatch(setInitializing(true));

      const storedToken = await keychainStorage.getToken();
      const storedUser = await keychainStorage.getUserData();

      if (storedToken && storedUser) {
        setLocalToken(storedToken);
        setLocalUser(storedUser);
        dispatch(setAuthSession({ user: storedUser, token: storedToken }));
      } else if (storedToken) {
        // Token exists, reconstruct fallback user
        const fallbackUser: User = {
          id: 'user_restored',
          name: 'Verified Customer',
          email: 'customer@smartcart.app',
        };
        setLocalToken(storedToken);
        setLocalUser(fallbackUser);
        dispatch(setAuthSession({ user: fallbackUser, token: storedToken }));
      } else {
        setLocalToken(null);
        setLocalUser(null);
        dispatch(logoutRedux());
      }
    } catch (error) {
      console.warn('[AuthProvider] Error restoring auth session from Keychain:', error);
      dispatch(logoutRedux());
    } finally {
      setIsInitializingState(false);
      dispatch(setInitializing(false));
    }
  }, [dispatch]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Login handler
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const loginUrl = ENDPOINTS.AUTH.buildUrl(ENDPOINTS.AUTH.LOGIN);
        const res = await api.post<{
          message?: string;
          userId: string;
          email: string;
          full_name?: string;
          token: string;
        }>(loginUrl, {
          email: email.trim().toLowerCase(),
          password,
        });

        if (res && res.token) {
          const userData: User = {
            id: res.userId,
            email: res.email,
            name: res.full_name || res.email.split('@')[0],
          };

          // 1. Persist securely in Keychain & storage
          await keychainStorage.setToken(res.token);
          await keychainStorage.setUserData(userData);

          // 2. Update Redux & local context
          setLocalToken(res.token);
          setLocalUser(userData);
          dispatch(setAuthSession({ user: userData, token: res.token }));

          return { success: true, message: res.message };
        }

        return { success: false, message: 'Invalid response from server' };
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Unable to sign in. Please verify your email and password.';
        return { success: false, message: msg };
      }
    },
    [dispatch]
  );

  // Register handler
  const register = useCallback(
    async (payload: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      try {
        const registerUrl = ENDPOINTS.AUTH.buildUrl(ENDPOINTS.AUTH.REGISTER);
        const res = await api.post<{
          message?: string;
          userId: string;
          email: string;
          full_name?: string;
          token: string;
        }>(registerUrl, {
          full_name: payload.fullName.trim(),
          email: payload.email.trim().toLowerCase(),
          phone: payload.phone.trim(),
          password: payload.password,
          is_recruiter: false,
        });

        if (res && res.token) {
          const userData: User = {
            id: res.userId,
            email: res.email,
            name: res.full_name || payload.fullName.trim(),
            phone: payload.phone.trim(),
          };

          // 1. Persist securely in Keychain & storage
          await keychainStorage.setToken(res.token);
          await keychainStorage.setUserData(userData);

          // 2. Update Redux & local context
          setLocalToken(res.token);
          setLocalUser(userData);
          dispatch(setAuthSession({ user: userData, token: res.token }));

          return { success: true, message: res.message };
        }

        return { success: false, message: 'Invalid response from server' };
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Unable to create account. Please check your details and try again.';
        return { success: false, message: msg };
      }
    },
    [dispatch]
  );

  // Logout handler
  const logout = useCallback(async () => {
    await keychainStorage.clearAuth();
    setLocalToken(null);
    setLocalUser(null);
    dispatch(logoutRedux());
  }, [dispatch]);

  const isAuthenticated = Boolean(
    (reduxAuth.isAuthenticated && reduxAuth.token) ||
    (token && user)
  );

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user: reduxAuth.user || user,
      token: reduxAuth.token || token,
      isAuthenticated,
      isInitializing: reduxAuth.isInitializing || isInitializing,
      login,
      register,
      logout,
      restoreSession,
    }),
    [
      reduxAuth.user,
      reduxAuth.token,
      reduxAuth.isInitializing,
      user,
      token,
      isAuthenticated,
      isInitializing,
      login,
      register,
      logout,
      restoreSession,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
