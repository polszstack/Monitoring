/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-toastification' {
  import { Plugin } from 'vue'
  export const useToast: () => {
    success: (msg: string, options?: any) => void
    error: (msg: string, options?: any) => void
    warning: (msg: string, options?: any) => void
    info: (msg: string, options?: any) => void
  }
  const Toast: Plugin
  export default Toast
}