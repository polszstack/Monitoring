<template>
  <nav class="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <button
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:hidden transition-all"
            aria-label="Toggle Sidebar"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 class="ml-3 lg:ml-0 text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span class="bg-blue-600 text-white p-1.5 rounded-lg text-xs hidden sm:inline-block">📚</span>
            Teacher Attendance System
          </h1>
        </div>

        <div class="flex items-center space-x-4">
          <div class="hidden sm:flex items-center text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <svg class="h-4 w-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ currentDate }}
          </div>

          <div class="relative" ref="menuRef">
            <button 
              @click="toggleUserMenu"
              class="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl hover:bg-gray-50 focus:outline-none transition-all group"
            >
              <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white group-hover:ring-blue-100 transition-all">
                {{ userInitials }}
              </div>
              <div class="hidden md:block text-left">
                <p class="text-xs font-semibold text-gray-800 leading-none mb-0.5">{{ userName }}</p>
                <p class="text-[10px] text-gray-400 font-medium capitalize leading-none">{{ userRole }}</p>
              </div>
              <svg class="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl py-1 z-50 border border-gray-100/80 overflow-hidden origin-top-right"
              >
                <div class="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                  <p class="text-xs font-medium text-gray-400">Signed in as</p>
                  <p class="text-sm font-bold text-gray-900 truncate mt-0.5">{{ userName }}</p>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 uppercase tracking-wider mt-1.5">
                    {{ userRole }}
                  </span>
                </div>
                
                <div class="p-1.5">
                  <button
                    @click="handleLogout"
                    class="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors font-medium group"
                  >
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { format } from 'date-fns';

const emit = defineEmits<{
  'toggle-sidebar': [];
}>();

const { currentUser, logout } = useAuth();
const showUserMenu = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const userName = computed(() => currentUser.value?.full_name || 'User');
const userRole = computed(() => currentUser.value?.role || 'user');
const userInitials = computed(() => {
  const name = userName.value;
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
});

const currentDate = computed(() => {
  return format(new Date(), 'EEEE, MMMM d, yyyy');
});

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = () => {
  showUserMenu.value = false;
  logout();
};

const closeUserMenu = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeUserMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu);
});
</script>