<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Daily Attendance Sheet</h1>
          <p class="mt-1 text-sm text-gray-500">Mark teacher attendance for today</p>
        </div>
        <div class="flex space-x-3">
          <input
            type="date"
            v-model="selectedDate"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadAttendanceSheet"
          />
          <button
            @click="generateSheet"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Sheet
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div v-if="statistics" class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Total</p>
          <p class="text-2xl font-bold text-gray-900">{{ statistics.total_schedules }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Present</p>
          <p class="text-2xl font-bold text-green-600">{{ statistics.present_count }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Absent</p>
          <p class="text-2xl font-bold text-red-600">{{ statistics.absent_count }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Late</p>
          <p class="text-2xl font-bold text-yellow-600">{{ statistics.late_count }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-500">Pending</p>
          <p class="text-2xl font-bold text-orange-600">{{ statistics.pending_count }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex flex-wrap gap-4">
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadAttendanceSheet"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
          </select>
          <select
            v-model="filterDepartment"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadAttendanceSheet"
          >
            <option value="">All Departments</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      <!-- Attendance Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <LoadingSpinner v-if="isLoading" :full-page="false" message="Loading attendance sheet..." />
        
        <div v-else-if="attendanceSheet.length === 0" class="p-8 text-center">
          <p class="text-gray-500 mb-4">No attendance sheet for this date.</p>
          <button
            @click="generateSheet"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate Attendance Sheet
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade/Section</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in attendanceSheet" :key="record.id" :class="getRowClass(record.attendance_status)">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatTime(record.start_time) }} - {{ formatTime(record.end_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ record.teacher_name }}</div>
                  <div class="text-xs text-gray-500">{{ record.employee_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.subject }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.room }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ record.grade_level }} {{ record.section }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="record.attendance_status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      v-if="record.attendance_status !== 'present'"
                      @click="markStatus(record.id, 'present')"
                      class="text-green-600 hover:text-green-900"
                    >
                      Present
                    </button>
                    <button
                      v-if="record.attendance_status !== 'absent'"
                      @click="markStatus(record.id, 'absent')"
                      class="text-red-600 hover:text-red-900"
                    >
                      Absent
                    </button>
                    <button
                      v-if="record.attendance_status !== 'late'"
                      @click="markStatus(record.id, 'late')"
                      class="text-yellow-600 hover:text-yellow-900"
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

const getRowClass = (status: string) => {
  switch (status) {
    case 'present': return 'bg-green-50';
    case 'absent': return 'bg-red-50';
    case 'late': return 'bg-yellow-50';
    default: return '';
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