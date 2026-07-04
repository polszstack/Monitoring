import { useToast } from 'vue-toastification';

const toastOptions = {
  position: 'top-right' as const,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button' as const,
  icon: true,
  rtl: false,
};

export function useNotification() {
  const toast = useToast();

  const success = (message: string, timeout?: number): void => {
    toast.success(message, { ...toastOptions, timeout: timeout || 3000 });
  };

  const error = (message: string, timeout?: number): void => {
    toast.error(message, { ...toastOptions, timeout: timeout || 5000 });
  };

  const warning = (message: string, timeout?: number): void => {
    toast.warning(message, { ...toastOptions, timeout: timeout || 4000 });
  };

  const info = (message: string, timeout?: number): void => {
    toast.info(message, { ...toastOptions, timeout: timeout || 3000 });
  };

  return {
    success,
    error,
    warning,
    info,
  };
}