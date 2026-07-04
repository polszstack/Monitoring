import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/api';
import type { User, LoginCredentials } from '@/types';

const currentUser = ref<User | null>(null);
const isAuthenticated = computed(() => !!currentUser.value && !!localStorage.getItem('auth_token'));
const isAdmin = computed(() => currentUser.value?.role === 'admin');
const userRole = computed(() => currentUser.value?.role || null);

export function useAuth() {
  const router = useRouter();

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string; data?: User }> => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        const userData = response.data;
        currentUser.value = userData;
        localStorage.setItem('auth_token', userData.token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        return { success: true, message: response.message, data: userData };
      }
      
      return { success: false, message: response.message || 'Login failed' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred during login';
      return { success: false, message };
    }
  };

  const logout = (): void => {
    currentUser.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        currentUser.value = JSON.parse(userData);
        return true;
      } catch (e) {
        logout();
        return false;
      }
    }
    return false;
  };

  const initializeAuth = (): void => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        currentUser.value = JSON.parse(userData);
      } catch (e) {
        logout();
      }
    }
  };

  // Initialize on import
  initializeAuth();

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    userRole,
    login,
    logout,
    checkAuth,
  };
}