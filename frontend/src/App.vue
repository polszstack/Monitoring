<template>
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
// Main application layout wrapper tracking dynamic route components
</script>

<style>
/* --- 1. Global Reset & Smooth Scrolled Layout defaults --- */
html, body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc; /* Matches Tailwind bg-slate-50/50 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* --- 2. Ultra-Smooth Page Transition Engine --- */

/* The active stage: governs how long the transition takes */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Before entry starts (where the next page slides up from) */
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

/* After exit starts (where the current page lifts up to) */
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>