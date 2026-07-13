// composables/useApi.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export function useApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  const getHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      // Also try x-access-token header
      headers['x-access-token'] = token
    }
    
    console.log('📤 Headers being sent:', headers)
    return headers
  }

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('token')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        
        // Redirect to login
        if (router && router.push) {
          router.push('/login')
        } else {
          window.location.href = '/login'
        }
        
        throw new Error('Session expired. Please login again.')
      }
      
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  const get = async <T>(url: string): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${BACKEND_URL}${url}`, {
        method: 'GET',
        headers: getHeaders()
      })
      
      return await handleResponse(response) as T
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const post = async <T>(url: string, body: any): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${BACKEND_URL}${url}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body)
      })
      
      return await handleResponse(response) as T
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const put = async <T>(url: string, body: any): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${BACKEND_URL}${url}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body)
      })
      
      return await handleResponse(response) as T
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const del = async <T>(url: string): Promise<T> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${BACKEND_URL}${url}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      
      return await handleResponse(response) as T
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { get, post, put, del, loading, error }
}