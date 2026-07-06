<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50/50 py-4 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">Daily Attendance Sheet</h1>
          <p class="mt-1 text-sm text-gray-500">Manage and track teacher schedules for today</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <input
              type="date"
              v-model="selectedDate"
              class="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              @change="loadAttendanceSheet"
            />
          </div>
          <button
            @click="generateSheet"
            class="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-sm shadow-blue-600/10 transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Generate Sheet
          </button>
        </div>
      </div>

      <div v-if="statistics" class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Schedules</p>
            <p class="text-2xl font-black text-gray-900 mt-1">{{ statistics.total_schedules }}</p>
          </div>
          <div class="p-2.5 bg-gray-50 rounded-xl text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Present</p>
            <p class="text-2xl font-black text-green-600 mt-1">{{ statistics.present_count }}</p>
          </div>
          <div class="p-2.5 bg-green-50 rounded-xl text-green-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Absent</p>
            <p class="text-2xl font-black text-red-600 mt-1">{{ statistics.absent_count }}</p>
          </div>
          <div class="p-2.5 bg-red-50 rounded-xl text-red-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Late</p>
            <p class="text-2xl font-black text-amber-600 mt-1">{{ statistics.late_count }}</p>
          </div>
          <div class="p-2.5 bg-amber-50 rounded-xl text-amber-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
            <p class="text-2xl font-black text-purple-600 mt-1">{{ statistics.pending_count }}</p>
          </div>
          <div class="p-2.5 bg-purple-50 rounded-xl text-purple-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center">
        <div class="flex flex-wrap items-center gap-3 w-full">
          <div class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Filter By:
          </div>
          <select
            v-model="filterStatus"
            class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            @change="loadAttendanceSheet"
          >
            <option value="">All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="present">✅ Present</option>
            <option value="absent">❌ Absent</option>
            <option value="late">⏰ Late</option>
            <option value="excused">🛡️ Excused</option>
          </select>
          <select
            v-model="filterDepartment"
            class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            @change="loadAttendanceSheet"
          >
            <option value="">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        <div v-if="isLoading" class="p-12 flex justify-center items-center">
          <LoadingSpinner :full-page="false" message="Syncing structural schedules..." />
        </div>
        
        <div v-else-if="attendanceSheet.length === 0" class="p-12 text-center max-w-sm mx-auto">
          <div class="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl mx-auto mb-4">📂</div>
          <p class="text-sm font-bold text-gray-900">No attendance records found</p>
          <p class="text-xs text-gray-400 mt-1 mb-5">There are no operational records active on this tracking date.</p>
          <button
            @click="generateSheet"
            class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-sm rounded-xl transition-colors"
          >
            Generate Structure Sheet
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/70">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Time Window</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Instructor Profiles</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Subject Core</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Room</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Grade Allocation</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status Badge</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Actions Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="record in attendanceSheet" :key="record.id" class="hover:bg-gray-50/60 transition-colors relative">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 relative">
                  <div class="absolute left-0 top-0 bottom-0 w-1" :class="getBorderAccentClass(record.attendance_status)"></div>
                  {{ formatTime(record.start_time) }} - {{ formatTime(record.end_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">
                      {{ record.teacher_name?.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-gray-900 leading-tight">{{ record.teacher_name }}</div>
                      <div class="text-[11px] text-gray-400 font-mono tracking-tight mt-0.5">{{ record.employee_id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{{ record.subject }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500">
                  <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">{{ record.room }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                  {{ record.grade_level }} — {{ record.section }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="record.attendance_status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex justify-center items-center gap-1.5 bg-gray-50 p-1 rounded-xl max-w-max mx-auto border border-gray-100">
                    <button
                      v-if="record.attendance_status !== 'present'"
                      @click="markStatus(record.id, 'present')"
                      class="px-2.5 py-1 text-xs font-bold rounded-lg text-emerald-700 hover:bg-emerald-50 bg-white shadow-sm border border-gray-100 transition-all"
                    >
                      Present
                    </button>
                    <button
                      v-if="record.attendance_status !== 'absent'"
                      @click="markStatus(record.id, 'absent')"
                      class="px-2.5 py-1 text-xs font-bold rounded-lg text-red-700 hover:bg-red-50 bg-white shadow-sm border border-gray-100 transition-all"
                    >
                      Absent
                    </button>
                    <button
                      v-if="record.attendance_status !== 'late'"
                      @click="markStatus(record.id, 'late')"
                      class="px-2.5 py-1 text-xs font-bold rounded-lg text-amber-700 hover:bg-amber-50 bg-white shadow-sm border border-gray-100 transition-all"
                    >
                      Late
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import apiService from '@/services/api';
import { useNotification } from '@/composables/useNotification';
import type { DailyAttendance, AttendanceStatistics } from '@/types';

const { success, error: notifyError } = useNotification();

const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'));
const filterStatus = ref('');
const filterDepartment = ref('');
const isLoading = ref(false);
const attendanceSheet = ref<DailyAttendance[]>([]);
const statistics = ref<AttendanceStatistics | null>(null);

const formatTime = (time: string) => {
  return format(new Date(`2000-01-01 ${time}`), 'h:mm a');
};

const getBorderAccentClass = (status: string) => {
  switch (status) {
    case 'present': return 'bg-emerald-500';
    case 'absent': return 'bg-red-500';
    case 'late': return 'bg-amber-500';
    default: return 'bg-gray-300';
  }
};

const loadAttendanceSheet = async () => {
  isLoading.value = true;
  try {
    const params: any = { date: selectedDate.value };
    if (filterStatus.value) params.status = filterStatus.value;
    if (filterDepartment.value) params.department = filterDepartment.value;

    const response = await apiService.getDailySheet(params);
    if (response.success && response.data) {
      attendanceSheet.value = response.data.attendance_sheet;
      statistics.value = response.data.statistics;
    }
  } catch (err: any) {
    notifyError('Failed to load attendance sheet');
  } finally {
    isLoading.value = false;
  }
};

const generateSheet = async () => {
  try {
    const response = await apiService.generateDailySheet(selectedDate.value);
    if (response.success) {
      success('Attendance sheet generated successfully');
      await loadAttendanceSheet();
    } else {
      notifyError(response.message);
    }
  } catch (err: any) {
    notifyError('Failed to generate attendance sheet');
  }
};

const markStatus = async (attendanceId: number, status: string) => {
  try {
    const response = await apiService.markAttendance({
      attendance_id: attendanceId,
      status: status as any,
    });
    if (response.success) {
      success(`Marked as ${status}`);
      await loadAttendanceSheet();
    } else {
      notifyError(response.message);
    }
  } catch (err: any) {
    notifyError('Failed to update attendance');
  }
};

onMounted(() => {
  loadAttendanceSheet();
});
</script>