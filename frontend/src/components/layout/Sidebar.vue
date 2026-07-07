<template>
  <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 z-40 bg-gray-950/20 backdrop-blur-sm lg:hidden transition-opacity"></div>

  <aside 
    class="fixed inset-y-0 left-0 z-50 w-72 transform transition-all cubic-bezier(0.4, 0, 0.2, 1) duration-300 lg:translate-x-0"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <div class="h-full flex flex-col bg-gray-950 border-r border-gray-900/60 shadow-2xl">
      
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-900/40">
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="text-base font-black text-white tracking-wide uppercase font-sans">SchoolMS</span>
        </router-link>
        
        <button @click="$emit('close')" class="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-900 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="px-5 py-5 border-b border-gray-900/40 bg-gray-900/10">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div class="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-800 shadow-inner">
              <span class="text-primary-400 font-black text-base">
                {{ authStore.user?.full_name?.charAt(0) || 'A' }}
              </span>
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-gray-950 rounded-full animate-pulse"></div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-white tracking-tight truncate">
              {{ authStore.user?.full_name || 'Admin User' }}
            </p>
            <p class="text-[10px] font-bold text-gray-500 tracking-wider uppercase mt-0.5">
              {{ authStore.user?.role || 'Administrator' }}
            </p>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p class="px-3 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">
          Navigation Matrix
        </p>
        
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 group relative"
          :class="[
            isActive(item.href)
              ? 'bg-primary-600/10 text-primary-400'
              : 'text-gray-400 hover:bg-gray-900/60 hover:text-gray-200'
          ]"
        >
          <div v-if="isActive(item.href)" class="absolute left-0 top-1/4 h-1/2 w-1 bg-primary-500 rounded-r-full animate-fade-in"></div>

          <component 
            :is="item.icon" 
            class="mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
            :class="isActive(item.href) ? 'text-primary-500' : 'text-gray-500 group-hover:text-gray-400'"
          />
          <span class="tracking-tight">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-900/40">
        <div class="bg-gray-900/30 border border-gray-900/60 rounded-xl p-3.5">
          <p class="text-[10px] font-black text-primary-500 uppercase tracking-wider mb-1">Core Operations</p>
          <p class="text-xs font-medium text-gray-500 leading-normal">Encountered an anomaly? Ping the infrastructure team.</p>
        </div>
      </div>
      
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,
  IdentificationIcon
} from '@heroicons/vue/24/outline'

defineProps<{ isOpen: boolean }>()
defineEmits<{ close: [] }>()

const route = useRoute()
const authStore = useAuthStore()

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Teachers', href: '/teachers', icon: UserGroupIcon },
  { name: 'Schedules', href: '/schedules', icon: CalendarIcon },
  { name: 'Attendance', href: '/attendance', icon: ClipboardDocumentCheckIcon },
  { name: 'Facilities', href: '/facilities', icon: BuildingOfficeIcon },
  { name: 'Visitors', href: '/visitors', icon: IdentificationIcon }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>