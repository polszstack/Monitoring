<template>
  <aside 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-6 bg-gray-800">
      <router-link to="/" class="flex items-center space-x-2">
        <svg class="h-8 w-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span class="text-xl font-bold text-white">SchoolMS</span>
      </router-link>
      <button @click="$emit('close')" class="lg:hidden text-gray-400 hover:text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- User info -->
    <div class="px-6 py-4 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <span class="text-white font-medium text-sm">
              {{ authStore.user?.full_name?.charAt(0) || 'U' }}
            </span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">
            {{ authStore.user?.full_name || 'User' }}
          </p>
          <p class="text-xs text-gray-400 truncate capitalize">
            {{ authStore.user?.role || 'user' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="mt-5 px-3 space-y-1">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 group"
        :class="[
          isActive(item.href)
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        ]"
      >
        <component 
          :is="item.icon" 
          class="mr-3 h-5 w-5 flex-shrink-0"
          :class="isActive(item.href) ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-300'"
        />
        {{ item.name }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

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