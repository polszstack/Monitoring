<template>
  <header class="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100/80 transition-all">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      
      <div class="flex items-center space-x-3">
        <button 
          @click="$emit('toggle-sidebar')" 
          class="lg:hidden -ml-2 p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="text-base sm:text-lg font-black text-gray-900 tracking-tight capitalize">
          {{ pageTitle }}
        </h1>
      </div>

      <div class="flex items-center space-x-4">
        
        <div class="hidden md:flex items-center space-x-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
          <router-link to="/attendance" class="text-xs font-bold text-gray-600 hover:text-primary-600 hover:bg-white px-3 py-1.5 rounded-lg transition-all shadow-2sm">
            Check Rooms
          </router-link>
          <router-link to="/visitors" class="text-xs font-bold text-gray-600 hover:text-primary-600 hover:bg-white px-3 py-1.5 rounded-lg transition-all shadow-2sm">
            Check-in Visitor
          </router-link>
        </div>

        <button class="relative p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 active:scale-95 transition-all group">
          <svg class="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <span class="h-5 w-px bg-gray-200" aria-hidden="true"></span>

        <div class="relative" v-click-outside="() => userMenuOpen = false">
          <button 
            @click="userMenuOpen = !userMenuOpen"
            class="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all group"
          >
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <span class="text-white font-black text-xs tracking-wider">
                {{ authStore.user?.full_name?.charAt(0) || 'A' }}
              </span>
            </div>
            <svg class="hidden sm:block h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-1"
          >
            <div 
              v-if="userMenuOpen" 
              class="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100/80 p-1.5 z-50 animate-slide-up"
            >
              <div class="px-3.5 py-3 border-b border-gray-50 mb-1">
                <p class="text-sm font-bold text-gray-900 tracking-tight truncate">{{ authStore.user?.full_name }}</p>
                <p class="text-xs text-gray-400 truncate mt-0.5 font-medium">{{ authStore.user?.email }}</p>
              </div>
              <button 
                @click="handleLogout"
                class="w-full flex items-center px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all group"
              >
                <svg class="mr-3 h-4 w-4 text-red-500 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </transition>
        </div>
        
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineEmits<{ 'toggle-sidebar': [] }>()

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

const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: any) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>