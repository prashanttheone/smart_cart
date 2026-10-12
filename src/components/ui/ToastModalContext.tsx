import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  ToastModal,
  ToastModalType,
  ToastPosition,
  ButtonVariant,
  ToastModalProps,
} from './ToastModal';

export interface ShowModalOptions {
  type?: ToastModalType;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  cancelVariant?: ButtonVariant;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
}

export interface ShowToastOptions {
  type?: ToastModalType;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  position?: ToastPosition;
  autoHideDuration?: number;
  showCloseButton?: boolean;
}

export interface ToastModalContextValue {
  showAlert: (optionsOrTitle: ShowModalOptions | string, message?: string) => void;
  showConfirm: (options: ShowModalOptions) => void;
  showToast: (optionsOrTitle: ShowToastOptions | string, message?: string) => void;
  hide: () => void;
}

const ToastModalContext = createContext<ToastModalContextValue | null>(null);

export const ToastModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalConfig, setModalConfig] = useState<
    Omit<ToastModalProps, 'isVisible' | 'onClose'> & { isVisible: boolean }
  >({
    isVisible: false,
    mode: 'modal',
    type: 'info',
  });

  const hide = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const showAlert = useCallback(
    (optionsOrTitle: ShowModalOptions | string, maybeMessage?: string) => {
      if (typeof optionsOrTitle === 'string') {
        setModalConfig({
          isVisible: true,
          mode: 'modal',
          type: 'info',
          title: optionsOrTitle,
          message: maybeMessage,
          confirmText: 'OK',
          confirmVariant: 'primary',
          showCancel: false,
        });
      } else {
        setModalConfig({
          isVisible: true,
          mode: 'modal',
          type: optionsOrTitle.type || 'info',
          title: optionsOrTitle.title,
          message: optionsOrTitle.message,
          children: optionsOrTitle.children,
          confirmText: optionsOrTitle.confirmText || 'OK',
          cancelText: optionsOrTitle.cancelText || 'Cancel',
          confirmVariant: optionsOrTitle.confirmVariant || 'primary',
          cancelVariant: optionsOrTitle.cancelVariant || 'secondary',
          showCancel: optionsOrTitle.showCancel ?? false,
          onConfirm: optionsOrTitle.onConfirm,
          onCancel: optionsOrTitle.onCancel,
          showCloseButton: optionsOrTitle.showCloseButton ?? true,
        });
      }
    },
    []
  );

  const showConfirm = useCallback((options: ShowModalOptions) => {
    setModalConfig({
      isVisible: true,
      mode: 'modal',
      type: options.type || 'confirm',
      title: options.title || 'Are you sure?',
      message: options.message,
      children: options.children,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      confirmVariant: options.confirmVariant || 'primary',
      cancelVariant: options.cancelVariant || 'secondary',
      showCancel: true,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
      showCloseButton: options.showCloseButton ?? true,
    });
  }, []);

  const showToast = useCallback(
    (optionsOrTitle: ShowToastOptions | string, maybeMessage?: string) => {
      if (typeof optionsOrTitle === 'string') {
        setModalConfig({
          isVisible: true,
          mode: 'toast',
          type: 'success',
          title: optionsOrTitle,
          message: maybeMessage,
          position: 'top',
          autoHideDuration: 3500,
          showCloseButton: true,
        });
      } else {
        setModalConfig({
          isVisible: true,
          mode: 'toast',
          type: optionsOrTitle.type || 'success',
          title: optionsOrTitle.title,
          message: optionsOrTitle.message,
          children: optionsOrTitle.children,
          position: optionsOrTitle.position || 'top',
          autoHideDuration: optionsOrTitle.autoHideDuration ?? 3500,
          showCloseButton: optionsOrTitle.showCloseButton ?? true,
        });
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      showAlert,
      showConfirm,
      showToast,
      hide,
    }),
    [showAlert, showConfirm, showToast, hide]
  );

  return (
    <ToastModalContext.Provider value={contextValue}>
      {children}
      <ToastModal
        {...modalConfig}
        isVisible={modalConfig.isVisible}
        onClose={hide}
      />
    </ToastModalContext.Provider>
  );
};

export const useToastModal = (): ToastModalContextValue => {
  const context = useContext(ToastModalContext);
  if (!context) {
    throw new Error('useToastModal must be used within a ToastModalProvider');
  }
  return context;
};

export default ToastModalProvider;
