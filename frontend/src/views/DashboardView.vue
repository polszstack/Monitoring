<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <!-- Welcome Card -->
      <div class="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 transition-all hover:shadow-md">
        <div class="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span class="text-blue-600">{{ userName }}</span>!
            </h2>
            <p class="text-sm sm:text-base text-gray-500 mt-1.5 flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 capitalize">
                {{ userRole }}
              </span>
              <span>• Access authorized</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Card: Total Teachers -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Teachers</span>
            <div v-if="isLoading" class="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
            <div v-else class="mt-2 text-3xl font-black text-gray-900">{{ stats.totalTeachers }}</div>
          </div>
          <div class="p-3 bg-gray-50 rounded-xl text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
        </div>

        <!-- Card: Today's Classes -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">Today's Classes</span>
            <div v-if="isLoading" class="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
            <div v-else class="mt-2 text-3xl font-black text-gray-900">{{ stats.todayClasses }}</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-xl text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
        </div>

        <!-- Card: Present Today -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">Present Today</span>
            <div v-if="isLoading" class="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
            <div v-else class="mt-2 text-3xl font-black text-green-600">{{ stats.presentToday }}</div>
          </div>
          <div class="p-3 bg-green-50 rounded-xl text-green-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        <!-- Card: Visitors Today -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">Visitors Today</span>
            <div v-if="isLoading" class="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
            <div v-else class="mt-2 text-3xl font-black text-purple-600">{{ stats.visitorsToday }}</div>
          </div>
          <div class="p-3 bg-purple-50 rounded-xl text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
        </div>
      </div>

      <!-- Main Layout Split -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Quick Actions Panel -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span>Quick Actions</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <router-link to="/attendance" class="flex items-center gap-3 px-4 py-3.5 bg-blue-50/60 text-blue-700 rounded-xl hover:bg-blue-100/80 transition-all font-medium border border-blue-100 group">
              <span class="text-xl group-hover:scale-110 transition-transform">📋</span> Mark Attendance
            </router-link>
            <router-link to="/schedules" class="flex items-center gap-3 px-4 py-3.5 bg-green-50/60 text-green-700 rounded-xl hover:bg-green-100/80 transition-all font-medium border border-green-100 group">
              <span class="text-xl group-hover:scale-110 transition-transform">📅</span> Manage Schedules
            </router-link>
            <router-link to="/visitors" class="flex items-center gap-3 px-4 py-3.5 bg-purple-50/60 text-purple-700 rounded-xl hover:bg-purple-100/80 transition-all font-medium border border-purple-100 group">
              <span class="text-xl group-hover:scale-110 transition-transform">🚶</span> Check-in Visitor
            </router-link>
            <router-link to="/facility" class="flex items-center gap-3 px-4 py-3.5 bg-amber-50/60 text-amber-700 rounded-xl hover:bg-amber-100/80 transition-all font-medium border border-amber-100 group">
              <span class="text-xl group-hover:scale-110 transition-transform">🔧</span> Report Facility Issue
            </router-link>
            <router-link to="/reports" class="sm:col-span-2 flex items-center justify-center gap-3 px-4 py-3.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium border border-gray-200 group">
              <span class="text-xl group-hover:scale-110 transition-transform">📈</span> View System Reports
            </router-link>
          </div>
        </div>

        <!-- System Info Panel -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-5">System Info</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-gray-50">
                <span class="text-sm font-medium text-gray-400">Date</span>
                <span class="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> {{ currentDate }}
                </span>
              </div>
              <div class="flex items-center justify-between pb-3 border-b border-gray-50">
                <span class="text-sm font-medium text-gray-400">Current Role</span>
                <span class="text-sm font-semibold text-gray-700 capitalize">{{ userRole }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-400">Status</span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    AppLayout
  },
  data() {
    return {
      userName: 'User',
      userRole: 'user',
      currentDate: new Date().toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      isLoading: false,
      stats: {
        totalTeachers: 0,
        todayClasses: 0,
        presentToday: 0,
        visitorsToday: 0
      }
    }
  },
  methods: {
    async loadStats() {
      this.isLoading = true
      try {
        const token = localStorage.getItem('token')
        
        // 1. Load Teachers
        const teachersRes = await fetch('http://localhost:8000/api/teachers/get-teachers', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const teachersData = await teachersRes.json()
        if (teachersData.success) {
          this.stats.totalTeachers = teachersData.data.length
        }
        
        // 2. Load Attendance
        const today = new Date().toISOString().split('T')[0]
        const attendanceRes = await fetch(`http://localhost:8000/api/attendance/get-daily-sheet?date=${today}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const attendanceData = await attendanceRes.json()
        if (attendanceData.success) {
          this.stats.todayClasses = attendanceData.data.statistics.total_schedules
          this.stats.presentToday = attendanceData.data.statistics.present_count
        }
        
        // 3. Load Visitors
        const visitorsRes = await fetch(`http://localhost:8000/api/visitors/get-visitors?date_from=${today}&date_to=${today}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const visitorsData = await visitorsRes.json()
        if (visitorsData.success) {
          this.stats.visitorsToday = visitorsData.data.length
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        this.userName = user.full_name || 'User'
        this.userRole = user.role || 'user'
      } catch (e) {
        console.error('Error parsing user data')
      }
    }
    this.loadStats()
  }
})
</script>