<template>
  <aside 
    :class="[
      'bg-gray-800 text-white transition-all duration-300 ease-in-out',
      isOpen ? 'w-64' : 'w-0 lg:w-20'
    ]"
    class="min-h-screen fixed lg:static inset-y-0 left-0 z-40 overflow-hidden"
  >
    <div class="flex flex-col h-full">
      <!-- Logo/Header -->
      <div class="flex items-center justify-center h-16 border-b border-gray-700">
        <h2 v-if="isOpen" class="text-xl font-bold">TAS</h2>
        <h2 v-else class="text-xl font-bold">T</h2>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1">
        <router-link
          v-for="item in filteredNavItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200',
            isActive(item.path)
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          ]"
        >
          <span class="flex-shrink-0" v-html="item.icon"></span>
          <span v-if="isOpen" class="ml-3">{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-700">
        <div v-if="isOpen" class="text-xs text-gray-400">
          <p>Teacher Attendance</p>
          <p>System v1.0</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import type { NavigationItem } from '@/types';

const props = defineProps<{
  isOpen: boolean;
}>();

const route = useRoute();
const { isAdmin } = useAuth();

const navItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
  },
  {
    name: 'Attendance',
    path: '/attendance',
    icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>',
    requiredRole: 'admin',
  },
  {
    name: 'Schedules',
    path: '/schedules',
    icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    requiredRole: 'admin',
  },
  {
    name: 'Visitors',
    path: '/visitors',
    icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
  },
];

const filteredNavItems = computed(() => {
  return navItems.filter(item => {
    if (item.requiredRole) {
      return isAdmin.value;
    }
    return true;
  });
});

const isActive = (path: string) => {
  return route.path === path;
};
</script>