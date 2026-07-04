<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Teacher Schedules</h1>
          <p class="mt-1 text-sm text-gray-500">Manage weekly teaching schedules</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Schedule
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
            <select
              v-model="selectedDay"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="loadSchedules"
            >
              <option value="">All Days</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select
              v-model="selectedTeacher"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="loadSchedules"
            >
              <option value="">All Teachers</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.full_name }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="loadSchedules"
              class="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      <!-- Schedules Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <LoadingSpinner v-if="isLoading" :full-page="false" message="Loading schedules..." />
        
        <div v-else-if="schedules.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No schedules</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new schedule.</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Schedule
            </button>
          </div>
        </div>

        <div v-else>
          <!-- Group by day -->
          <div v-for="(daySchedules, day) in groupedSchedules" :key="day" class="border-b border-gray-200 last:border-b-0">
            <div class="bg-gray-50 px-6 py-3">
              <h3 class="text-lg font-medium text-gray-900">{{ day }}</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade/Section</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="schedule in daySchedules" :key="schedule.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatTime(schedule.start_time) }} - {{ formatTime(schedule.end_time) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ schedule.teacher_name }}</div>
                    <div class="text-xs text-gray-500">{{ schedule.employee_id }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ schedule.subject }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ schedule.room }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ schedule.grade_level }} {{ schedule.section }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ schedule.department }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Create Schedule Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCreateModal = false"></div>

          <div class="relative bg-white rounded-lg max-w-lg w-full p-6">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900">Add New Schedule</h3>
            </div>

            <form @submit.prevent="createSchedule" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Teacher *</label>
                <select
                  v-model="newSchedule.teacher_id"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Teacher</option>
                  <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.full_name }} - {{ teacher.department }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Day *</label>
                <select
                  v-model="newSchedule.day_of_week"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Start Time *</label>
                  <input
                    v-model="newSchedule.start_time"
                    type="time"
                    required
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">End Time *</label>
                  <input
                    v-model="newSchedule.end_time"
                    type="time"
                    required
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Subject *</label>
                <input
                  v-model="newSchedule.subject"
                  type="text"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Room</label>
                <input
                  v-model="newSchedule.room"
                  type="text"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Room 101"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Grade Level</label>
                  <input
                    v-model="newSchedule.grade_level"
                    type="text"
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Grade 10"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Section</label>
                  <input
                    v-model="newSchedule.section"
                    type="text"
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Section A"
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="showCreateModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isCreating"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ isCreating ? 'Creating...' : 'Create Schedule' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import apiService from '@/services/api';
import { useNotification } from '@/composables/useNotification';
import type { ScheduleTemplate, Teacher } from '@/types';

const { success, error: notifyError } = useNotification();

const selectedDay = ref('');
const selectedTeacher = ref('');
const isLoading = ref(false);
const isCreating = ref(false);
const showCreateModal = ref(false);
const schedules = ref<ScheduleTemplate[]>([]);
const teachers = ref<Teacher[]>([]);

const newSchedule = ref({
  teacher_id: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  subject: '',
  room: '',
  grade_level: '',
  section: '',
});

const groupedSchedules = computed(() => {
  const grouped: Record<string, ScheduleTemplate[]> = {};
  
  schedules.value.forEach(schedule => {
    if (!grouped[schedule.day_of_week]) {
      grouped[schedule.day_of_week] = [];
    }
    grouped[schedule.day_of_week].push(schedule);
  });

  // Sort by time within each day
  Object.keys(grouped).forEach(day => {
    grouped[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  return grouped;
});

const formatTime = (time: string) => {
  return format(new Date(`2000-01-01 ${time}`), 'h:mm a');
};

const loadTeachers = async () => {
  try {
    const response = await apiService.getTeachers();
    if (response.success && response.data) {
      teachers.value = response.data;
    }
  } catch (err: any) {
    console.error('Failed to load teachers:', err);
  }
};

const loadSchedules = async () => {
  isLoading.value = true;
  try {
    const teacherId = selectedTeacher.value ? parseInt(selectedTeacher.value) : undefined;
    const response = await apiService.getTeacherSchedules(teacherId, selectedDay.value || undefined);
    if (response.success && response.data) {
      schedules.value = response.data;
    }
  } catch (err: any) {
    notifyError('Failed to load schedules');
  } finally {
    isLoading.value = false;
  }
};

const createSchedule = async () => {
  isCreating.value = true;
  try {
    const response = await apiService.createSchedule({
      teacher_id: parseInt(newSchedule.value.teacher_id),
      day_of_week: newSchedule.value.day_of_week,
      start_time: newSchedule.value.start_time,
      end_time: newSchedule.value.end_time,
      subject: newSchedule.value.subject,
      room: newSchedule.value.room,
      grade_level: newSchedule.value.grade_level,
      section: newSchedule.value.section,
    });

    if (response.success) {
      success('Schedule created successfully');
      showCreateModal.value = false;
      resetForm();
      await loadSchedules();
    } else {
      notifyError(response.message);
    }
  } catch (err: any) {
    notifyError('Failed to create schedule');
  } finally {
    isCreating.value = false;
  }
};

const resetForm = () => {
  newSchedule.value = {
    teacher_id: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    subject: '',
    room: '',
    grade_level: '',
    section: '',
  };
};

onMounted(() => {
  loadTeachers();
  loadSchedules();
});
</script>