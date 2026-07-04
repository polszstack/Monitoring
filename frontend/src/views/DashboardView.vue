<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold text-gray-900">
          Welcome back, {{ userName }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Here's what's happening with teacher attendance today.
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Today's Attendance -->
        <div class="bg-white rounded-lg shadow p-6 hover-card">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today's Classes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ todayStats?.total_schedules || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Present Count -->
        <div class="bg-white rounded-lg shadow p-6 hover-card">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Present</p>
              <p class="text-2xl font-semibold text-green-600">{{ todayStats?.present_count || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Absent Count -->
        <div class="bg-white rounded-lg shadow p-6 hover-card">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 rounded-lg p-3">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Absent</p>
              <p class="text-2xl font-semibold text-red-600">{{ todayStats?.absent_count || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Pending Count -->
        <div class="bg-white rounded-lg shadow p-6 hover-card">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending</p>
              <p class="text-2xl font-semibold text-yellow-600">{{ todayStats?.pending_count || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Today's Schedule Summary -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Today's Schedule Overview</h2>
          </div>
          <div class="p-6">
            <div v-if="todaySchedules.length > 0" class="space-y-4">
              <div v-for="schedule in todaySchedules.slice(0, 5)" :key="schedule.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">{{ schedule.teacher_name }}</p>
                  <p class="text-sm text-gray-500">{{ schedule.subject }} - {{ schedule.room }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ formatTime(schedule.start_time) }} - {{ formatTime(schedule.end_time) }}</p>
                  <StatusBadge :status="schedule.attendance_status" />
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-500">No schedules for today. Generate attendance sheet first.</p>
              <button
                v-if="isAdmin"
                @click="generateTodaySheet"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Generate Today's Sheet
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Visitors -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Recent Visitors</h2>
          </div>
          <div class="p-6">
            <div v-if="recentVisitors.length > 0" class="space-y-4">
              <div v-for="visitor in recentVisitors.slice(0, 5)" :key="visitor.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">{{ visitor.visitor_name }}</p>
                  <p class="text-sm text-gray-500">{{ visitor.person_to_visit }} - {{ visitor.purpose_of_visit }}</p>
                </div>
                <StatusBadge :status="visitor.status" />
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-500">No visitors today</p>
            </div>
          </div>
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
import apiService from '@/services/api';
import { useAuth } from '@/composables/useAuth';
import { useNotification } from '@/composables/useNotification';
import type { DailyAttendance, AttendanceStatistics, VisitorLog } from '@/types';

const { currentUser, isAdmin } = useAuth();
const { success, error } = useNotification();

const userName = currentUser.value?.full_name || 'User';
const todayStats = ref<AttendanceStatistics | null>(null);
const todaySchedules = ref<DailyAttendance[]>([]);
const recentVisitors = ref<VisitorLog[]>([]);

const formatTime = (time: string) => {
  return format(new Date(`2000-01-01 ${time}`), 'h:mm a');
};

const loadDashboardData = async () => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Load today's attendance
    const attendanceResponse = await apiService.getDailySheet({ date: today });
    if (attendanceResponse.success && attendanceResponse.data) {
      todayStats.value = attendanceResponse.data.statistics;
      todaySchedules.value = attendanceResponse.data.attendance_sheet;
    }

    // Load recent visitors
    const visitorsResponse = await apiService.getVisitors({ date_from: today, date_to: today });
    if (visitorsResponse.success && visitorsResponse.data) {
      recentVisitors.value = visitorsResponse.data;
    }
  } catch (err) {
    console.error('Error loading dashboard data:', err);
  }
};

const generateTodaySheet = async () => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const response = await apiService.generateDailySheet(today);
    if (response.success) {
      success('Today\'s attendance sheet generated!');
      await loadDashboardData();
    } else {
      error(response.message);
    }
  } catch (err) {
    error('Failed to generate attendance sheet');
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>