<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p class="mt-1 text-sm text-gray-500">View and analyze teacher attendance data</p>
        </div>
        <button
          @click="exportReport"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Export Report
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              v-model="dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              v-model="dateTo"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select
              v-model="selectedTeacher"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Teachers</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.full_name }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="loadReport"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <!-- Overall Statistics -->
      <div v-if="overallStats" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-500">Total Days</p>
          <p class="text-3xl font-bold text-gray-900">{{ overallStats.total_days }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-500">Total Records</p>
          <p class="text-3xl font-bold text-blue-600">{{ overallStats.total_records }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-500">Total Present</p>
          <p class="text-3xl font-bold text-green-600">{{ overallStats.total_present }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-500">Total Absent</p>
          <p class="text-3xl font-bold text-red-600">{{ overallStats.total_absent }}</p>
        </div>
      </div>

      <!-- Teacher Report Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <LoadingSpinner v-if="isLoading" :full-page="false" message="Generating report..." />
        
        <div v-else-if="teacherReport.length === 0" class="p-8 text-center">
          <p class="text-gray-500">No data available for the selected period</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Classes</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Late</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Excused</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="report in teacherReport" :key="report.teacher_id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ report.teacher_name }}</div>
                  <div class="text-xs text-gray-500">{{ report.employee_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.department }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                  {{ report.total_classes }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-medium">
                  {{ report.present_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-medium">
                  {{ report.absent_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-yellow-600 font-medium">
                  {{ report.late_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600 font-medium">
                  {{ report.excused_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center">
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                      <div
                        :class="getPercentageColor(report.attendance_percentage)"
                        class="h-2.5 rounded-full"
                        :style="{ width: report.attendance_percentage + '%' }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium">{{ report.attendance_percentage }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    :class="getStatusBadge(report.attendance_percentage)"
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ getStatusText(report.attendance_percentage) }}
                  </span>
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
import { format, subMonths } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import apiService from '@/services/api';
import { useNotification } from '@/composables/useNotification';
import type { AttendanceReport, OverallStatistics, Teacher } from '@/types';

const { error: notifyError } = useNotification();

const dateFrom = ref(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
const dateTo = ref(format(new Date(), 'yyyy-MM-dd'));
const selectedTeacher = ref('');
const isLoading = ref(false);
const teachers = ref<Teacher[]>([]);
const teacherReport = ref<AttendanceReport[]>([]);
const overallStats = ref<OverallStatistics | null>(null);

const getPercentageColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 75) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getStatusBadge = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-100 text-green-800';
  if (percentage >= 75) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getStatusText = (percentage: number) => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 75) return 'Good';
  if (percentage >= 60) return 'Fair';
  return 'Poor';
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

const loadReport = async () => {
  isLoading.value = true;
  try {
    const params: any = {
      date_from: dateFrom.value,
      date_to: dateTo.value,
    };

    if (selectedTeacher.value) {
      params.teacher_id = parseInt(selectedTeacher.value);
    }

    const response = await apiService.getAttendanceReport(params);
    if (response.success && response.data) {
      teacherReport.value = response.data.teacher_report;
      overallStats.value = response.data.overall_statistics;
    }
  } catch (err: any) {
    notifyError('Failed to generate report');
  } finally {
    isLoading.value = false;
  }
};

const exportReport = () => {
  // Create CSV content
  let csv = 'Teacher,Employee ID,Department,Total Classes,Present,Absent,Late,Excused,Attendance %\n';
  
  teacherReport.value.forEach(report => {
    csv += `"${report.teacher_name}","${report.employee_id}","${report.department}",${report.total_classes},${report.present_count},${report.absent_count},${report.late_count},${report.excused_count},${report.attendance_percentage}%\n`;
  });

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance_report_${dateFrom.value}_to_${dateTo.value}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

onMounted(() => {
  loadTeachers();
  loadReport();
});
</script>