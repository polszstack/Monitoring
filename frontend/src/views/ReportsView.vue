<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50/50 py-4 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">Attendance Reports</h1>
          <p class="mt-1 text-sm text-gray-500">Analyze aggregate teacher performance matrix logs and attendance tracks</p>
        </div>
        <div>
          <button
            @click="exportReport"
            class="w-full md:w-auto px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            📥 Export Matrix Data (.CSV)
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date Range From</label>
            <input
              v-model="dateFrom"
              type="date"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Date Range To</label>
            <input
              v-model="dateTo"
              type="date"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Instructor Filter</label>
            <select
              v-model="selectedTeacher"
              class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="">All Registered Teachers</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.full_name }}
              </option>
            </select>
          </div>
          <div>
            <button
              @click="loadReport"
              class="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10"
            >
              📊 Generate Report
            </button>
          </div>
        </div>
      </div>

      <div v-if="overallStats" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-slate-400"></div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Evaluated Days</p>
          <p class="text-3xl font-black text-gray-900 mt-1">{{ overallStats.total_days }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tracked Logs</p>
          <p class="text-3xl font-black text-blue-600 mt-1">{{ overallStats.total_records }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Present Marks</p>
          <p class="text-3xl font-black text-emerald-600 mt-1">{{ overallStats.total_present }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Absent Deficits</p>
          <p class="text-3xl font-black text-rose-600 mt-1">{{ overallStats.total_absent }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        <LoadingSpinner v-if="isLoading" :full-page="false" message="Generating metric matrices..." />
        
        <div v-else-if="teacherReport.length === 0" class="p-16 text-center max-w-sm mx-auto text-gray-400">
          <div class="text-4xl mb-2">📋</div>
          <p class="font-bold text-gray-900">No report metrics compiled</p>
          <p class="text-xs text-gray-400 mt-1">Select an alternate timeframe sequence lookup window.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/70">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Faculty Member</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Department</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Total Classes</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Present</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Absent</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Late</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Excused</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider pl-12">Attendance Weight</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Evaluation</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="report in teacherReport" :key="report.teacher_id" class="hover:bg-gray-50/60 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">{{ report.teacher_name }}</div>
                  <div class="text-xs text-gray-400 font-mono mt-0.5">{{ report.employee_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">
                  <span class="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                    {{ report.department }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800">
                  {{ report.total_classes }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-black text-emerald-600">
                  {{ report.present_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-rose-500">
                  {{ report.absent_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-amber-500">
                  {{ report.late_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-500">
                  {{ report.excused_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap pl-12">
                  <div class="flex items-center gap-3 max-w-[160px]">
                    <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200/20">
                      <div
                        :class="getPercentageColor(report.attendance_percentage)"
                        class="h-full rounded-full transition-all duration-500"
                        :style="{ width: report.attendance_percentage + '%' }"
                      ></div>
                    </div>
                    <span class="text-xs font-mono font-bold text-gray-900">{{ report.attendance_percentage }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    :class="getStatusBadge(report.attendance_percentage)"
                    class="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg"
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
  if (percentage >= 90) return 'bg-emerald-500';
  if (percentage >= 75) return 'bg-amber-500';
  return 'bg-rose-500';
};

const getStatusBadge = (percentage: number) => {
  if (percentage >= 90) return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
  if (percentage >= 75) return 'bg-amber-50 text-amber-700 border border-amber-100';
  return 'bg-rose-50 text-rose-700 border border-rose-100';
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
    console.error('Failed to register context teachers sync array:', err);
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
    notifyError('Failed to generate operational tracking matrix');
  } finally {
    isLoading.value = false;
  }
};

const exportReport = () => {
  let csv = 'Teacher,Employee ID,Department,Total Classes,Present,Absent,Late,Excused,Attendance %\n';
  
  teacherReport.value.forEach(report => {
    csv += `"${report.teacher_name}","${report.employee_id}","${report.department}",${report.total_classes},${report.present_count},${report.absent_count},${report.late_count},${report.excused_count},${report.attendance_percentage}%\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance_matrix_${dateFrom.value}_to_${dateTo.value}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

onMounted(() => {
  loadTeachers();
  loadReport();
});
</script>