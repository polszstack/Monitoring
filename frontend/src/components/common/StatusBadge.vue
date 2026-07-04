<template>
  <span :class="badgeClass">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status: string;
}>();

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
  present: { label: 'Present', class: 'bg-green-100 text-green-800' },
  absent: { label: 'Absent', class: 'bg-red-100 text-red-800' },
  late: { label: 'Late', class: 'bg-orange-100 text-orange-800' },
  excused: { label: 'Excused', class: 'bg-blue-100 text-blue-800' },
  checked_in: { label: 'Checked In', class: 'bg-green-100 text-green-800' },
  checked_out: { label: 'Checked Out', class: 'bg-gray-100 text-gray-800' },
  active: { label: 'Active', class: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', class: 'bg-red-100 text-red-800' },
};

const badgeClass = computed(() => {
  const config = statusConfig[props.status] || { label: props.status, class: 'bg-gray-100 text-gray-800' };
  return `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.class}`;
});

const label = computed(() => {
  return statusConfig[props.status]?.label || props.status;
});
</script>