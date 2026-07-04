<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="cancel"></div>

      <div class="relative bg-white rounded-lg max-w-md w-full p-6">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          <p class="mt-2 text-sm text-gray-500">{{ message }}</p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="cancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirm"
            :class="confirmButtonClass"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'info',
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const confirmButtonClass = computed(() => {
  const base = 'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  switch (props.type) {
    case 'danger':
      return `${base} bg-red-600 hover:bg-red-700 focus:ring-red-500`;
    case 'warning':
      return `${base} bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500`;
    default:
      return `${base} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`;
  }
});

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>