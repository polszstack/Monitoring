<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50/50 py-4 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">Teacher Schedules</h1>
          <p class="mt-1 text-sm text-gray-500">Manage and track weekly class distributions and teaching assignments</p>
        </div>
        <div>
          <button
            @click="showCreateModal = true"
            class="w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            ➕ Add Schedule
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Day of Week</label>
            <select
              v-model="selectedDay"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
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
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Assigned Teacher</label>
            <select
              v-model="selectedTeacher"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
              @change="loadSchedules"
            >
              <option value="">All Teachers</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.full_name }}
              </option>
            </select>
          </div>
          <div>
            <button
              @click="loadSchedules"
              class="w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm"
            >
              🔍 Refresh Filter Indexes
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-6 relative">
        <div v-if="isLoading" class="p-16 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
          <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
          <p class="text-xs text-gray-400">Syncing schedule registers...</p>
        </div>
        
        <div v-else-if="schedules.length === 0" class="p-16 bg-white rounded-2xl border border-gray-100 shadow-sm text-center max-w-sm mx-auto">
          <div class="text-4xl mb-3">📅</div>
          <h3 class="text-base font-bold text-gray-900">No schedules configured</h3>
          <p class="mt-1 text-xs text-gray-400 leading-relaxed">There are currently no tracked allocations matching your selected criteria.</p>
          <div class="mt-5">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-blue-50 text-blue-600 border border-gray-100 hover:border-blue-100 rounded-xl text-xs font-bold transition-all"
            >
              Create Initial Matrix
            </button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="(daySchedules, day) in groupedSchedules" :key="day" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="bg-gray-50/70 border-b border-gray-100 px-6 py-4">
              <h3 class="text-sm font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
                <span>🗓️</span> {{ day }}
              </h3>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50/40">
                  <tr>
                    <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Time Window</th>
                    <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Faculty Instructor</th>
                    <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Subject Title</th>
                    <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Room Allocation</th>
                    <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Grade/Section</th>
                    <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Department Base</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="schedule in daySchedules" :key="schedule.id" class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-blue-600 relative">
                      <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      {{ formatTime(schedule.start_time) }} – {{ formatTime(schedule.end_time) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-bold text-gray-900">{{ schedule.teacher_name }}</div>
                      <div class="text-[11px] text-gray-400 font-mono tracking-wide mt-0.5">{{ schedule.employee_id }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      {{ schedule.subject }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-[11px] font-bold rounded-lg bg-gray-100 text-gray-600 uppercase">
                        🚪 {{ schedule.room || 'N/A' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {{ schedule.grade_level }} <span class="text-gray-400 font-normal">— {{ schedule.section }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                        {{ schedule.department }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showCreateModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
        <div class="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 border border-gray-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <div class="mb-5">
            <h3 class="text-lg font-black text-gray-900 tracking-tight">Add New Schedule</h3>
            <p class="text-xs text-gray-400 mt-0.5">Define targeted matrix points for upcoming lesson clusters.</p>
          </div>

          <form @submit.prevent="createSchedule" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Faculty Instructor *</label>
              <select
                v-model="newSchedule.teacher_id"
                required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="">Select Teacher Target</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.full_name }} — ({{ teacher.department }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Day Matrix *</label>
              <select
                v-model="newSchedule.day_of_week"
                required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="">Select Target Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time *</label>
                <input
                  v-model="newSchedule.start_time"
                  type="time"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">End Time *</label>
                <input
                  v-model="newSchedule.end_time"
                  type="time"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Subject Title *</label>
              <input
                v-model="newSchedule.subject"
                type="text"
                required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="e.g., Advanced Mathematics"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Room Assignment</label>
              <input
                v-model="newSchedule.room"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="e.g., Room 402-B"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Grade Level</label>
                <input
                  v-model="newSchedule.grade_level"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="e.g., Grade 11"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Section</label>
                <input
                  v-model="newSchedule.section"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="e.g., STEM - A"
                />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 border border-gray-200 font-bold text-xs text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isCreating"
                class="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {{ isCreating ? 'Syncing...' : 'Create Matrix Entry' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout.vue';
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

  // Sort chronologically within day sets
  Object.keys(grouped).forEach(day => {
    grouped[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  return grouped;
});

const formatTime = (time: string) => {
  if (!time) return '';
  // Formats both raw ISO segments and standard string sets safely
  const standardTimeStr = time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time;
  return format(new Date(`2000-01-01 ${standardTimeStr}`), 'h:mm a');
};

const loadTeachers = async () => {
  try {
    const response = await apiService.getTeachers();
    if (response.success && response.data) {
      teachers.value = response.data;
    }
  } catch (err: any) {
    console.error('Failed to sync master list teachers:', err);
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
    notifyError('Failed to sync system matrices index');
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
      success('Schedule added successfully');
      showCreateModal.value = false;
      resetForm();
      await loadSchedules();
    } else {
      notifyError(response.message);
    }
  } catch (err: any) {
    notifyError('Execution logic breakdown while saving entry');
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