<template>
  <header class="bg-white shadow-sm sticky top-0 z-30">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Mobile menu button -->
      <button 
        @click="$emit('toggle-sidebar')" 
        class="lg:hidden -ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Page title -->
      <div class="flex-1">
        <h1 class="text-lg font-semibold text-gray-900 capitalize">
          {{ pageTitle }}
        </h1>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Notifications bell -->
        <button class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <!-- User dropdown -->
        <div class="relative">
          <button 
            @click="userMenuOpen = !userMenuOpen"
            class="flex items-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
          >
            <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <span class="text-white font-medium">
                {{ authStore.user?.full_name?.charAt(0) || 'U' }}
              </span>
            </div>
            <span class="hidden md:block text-gray-700 font-medium">
              {{ authStore.user?.full_name || 'User' }}
            </span>
          </button>

          <!-- Dropdown menu -->
          <div 
            v-if="userMenuOpen" 
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
          >
            <div class="px-4 py-2 text-xs text-gray-500 border-b">
              {{ authStore.user?.email }}
            </div>
            <button 
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userMenuOpen = ref(false)

const pageTitle = computed(() => {
  const name = route.name as string
  return name || 'Dashboard'
})

const handleLogout = () => {
  userMenuOpen.value = false
  authStore.logout()
  router.push('/login')
}
</script>