<template>
  <div class="min-h-screen flex">
    <!-- Left Panel - Full Background Image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img 
          src="/images/main.jpg" 
          alt="School Campus" 
          class="w-full h-full object-cover"
        />
        <!-- Dark Overlay for depth -->
        <div class="absolute inset-0 bg-black/30"></div>
      </div>
    </div>

    <!-- Right Panel - Blue Login Form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      <div class="w-full max-w-md animate-in">
        <!-- Mobile Logo (visible on small screens) -->
        <div class="lg:hidden text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white">SchoolMS</h2>
        </div>

        <!-- Login Card -->
        <div class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div class="text-center mb-8">
            <div class="hidden lg:flex items-center justify-center mb-4">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-bold text-white">Welcome Back</h2>
            <p class="text-blue-100 mt-1">Sign in to your admin account</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-blue-100 mb-2">Username</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  v-model="username" 
                  type="text" 
                  required
                  class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Enter username"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-blue-100 mb-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required
                  class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-10 py-3 text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  placeholder="Enter password"
                >
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg class="h-5 w-5 text-blue-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="error" class="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 animate-in">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-red-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 2.5 1.732 2.5z" />
                </svg>
                <p class="text-sm text-red-100">{{ error }}</p>
              </div>
            </div>

            <button 
              type="submit"
              :disabled="loading"
              class="w-full py-3 text-base font-bold text-blue-900 bg-white hover:bg-blue-50 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-900" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
              <span v-else>Sign In</span>
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-white/10">
            <p class="text-xs text-blue-200 text-center mb-3">Demo Credentials</p>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <span class="text-blue-200">Admin</span>
                <span class="font-mono text-white">admin / admin123</span>
              </div>
              <div class="flex items-center justify-between text-sm bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <span class="text-blue-200">Teacher</span>
                <span class="font-mono text-white">john.doe / admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const result = await authStore.login(username.value, password.value)
    if (result.success) {
      await authStore.fetchProfile()
      router.push('/')
    } else {
      error.value = result.error || 'Invalid credentials'
    }
  } catch (err) {
    error.value = 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-in {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar for the right panel if needed */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>