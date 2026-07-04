<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div 
      class="animate-spin rounded-full border-t-2 border-b-2 border-blue-500"
      :class="sizeClass"
    ></div>
    <span v-if="message" class="ml-3 text-gray-600">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullPage?: boolean;
}>(), {
  size: 'md',
  fullPage: false,
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-6 w-6';
    case 'lg': return 'h-12 w-12';
    default: return 'h-8 w-8';
  }
});

const containerClass = computed(() => {
  return props.fullPage ? 'min-h-screen' : 'py-4';
});
</script>