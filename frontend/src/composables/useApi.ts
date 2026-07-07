import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export function useApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get<T>(url, config)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post<T>(url, data, config)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.put<T>(url, data, config)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.delete<T>(url, config)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    api: apiClient,
    loading,
    error,
    get,
    post,
    put,
    del
  }
}