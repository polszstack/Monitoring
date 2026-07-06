<template>
  <aside class="bg-slate-900 text-slate-200 w-64 min-h-screen fixed left-0 top-0 border-r border-slate-800 flex flex-col justify-between z-30 shadow-xl select-none">
    <div class="p-5 flex-1 overflow-y-auto">
      <div class="flex items-center gap-3 px-3 mb-8 group cursor-pointer">
        <div class="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-600/20 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
          T
        </div>
        <div>
          <h1 class="text-base font-bold text-white tracking-tight leading-none mb-0.5">TAS Admin</h1>
          <span class="text-[10px] font-medium text-slate-500 tracking-wider uppercase">Attendance System</span>
        </div>
      </div>
      
      <nav class="space-y-2">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm group relative overflow-hidden active:scale-[0.96] transform"
          :class="isActive(item.path) ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/15 font-bold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'"
        >
          <span 
            class="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md transform transition-all duration-300 origin-left"
            :class="isActive(item.path) ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-40'"
          ></span>

          <span class="mr-3 transition-all duration-300 block" :class="isActive(item.path) ? 'scale-110 text-white' : 'text-slate-400 group-hover:text-slate-200 group-hover:translate-x-0.5'">
            <span v-html="item.iconRaw" class="w-5 h-5 block"></span>
          </span>
          
          <span class="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
            {{ item.name }}
          </span>
        </router-link>
      </nav>
    </div>

    <div class="p-4 border-t border-slate-800 bg-slate-950/40">
      <button 
        type="button"
        @click.prevent="handleLogout"
        class="flex items-center w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 font-medium text-sm group active:scale-[0.96] transform"
      >
        <svg class="w-5 h-5 mr-3 text-red-400/80 group-hover:text-red-300 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="group-hover:translate-x-0.5 transition-transform duration-300">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isActive = (path: string) => route.path === path;

const navItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    iconRaw: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`
  },
  {
    name: 'Attendance',
    path: '/attendance',
    iconRaw: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`
  },
  {
    name: 'Schedules',
    path: '/schedules',
    iconRaw: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
  },
  {
    name: 'Visitors',
    path: '/visitors',
    iconRaw: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
  },
  {
    name: 'Facility',
    path: '/facility',
    iconRaw: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
  },
  {
    name: 'Reports',
    path: '/reports',
    iconRaw: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
  }
];

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.clear();

  router.push('/login').catch(() => {
    window.location.href = '/login';
  });
};
</script>