import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// Local User type because src/types.ts is not a module in this project setup
type User = {
  id?: number | string
  role?: string
  [key: string]: any
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'teacher')

  function initialize() {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
  }

  async function login(username: string, password: string) {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      })
      
      const { token: newToken, user: userData } = response.data
      
      token.value = newToken
      user.value = userData
      
      localStorage.setItem('token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      }
    }
  }

  async function fetchProfile() {
    try {
      const response = await axios.get('/api/auth/profile')
      user.value = response.data
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    window.location.href = '/login'
  }

  // Initialize auth state
  initialize()

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isTeacher,
    login,
    logout,
    fetchProfile
  }
})