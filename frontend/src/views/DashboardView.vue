<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Admin Dashboard
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          Welcome back, <span class="font-semibold text-primary-600 bg-primary-50/60 px-2 py-0.5 rounded-md">{{ authStore.user?.full_name || 'Admin' }}</span>. Here's your operational overview for today.
        </p>
      </div>
      
      <div class="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-soft self-start md:self-auto">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-xs font-semibold text-gray-600 tracking-wide uppercase">Live Monitoring</span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in cardStats" :key="stat.title" 
           class="card card-glow-hover p-6 bg-white hover:-translate-y-1 transition-all duration-300 group">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ stat.title }}</p>
            <p class="text-3xl font-black text-gray-900 tracking-tight mt-1 group-hover:scale-105 origin-left transition-transform duration-200">
              {{ stat.value }}
            </p>
          </div>
          <div :class="stat.iconBg" class="flex-shrink-0 p-3.5 rounded-2xl group-hover:rotate-6 transition-all duration-300 shadow-sm">
            <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
          </div>
        </div>
        <div class="w-full bg-gray-50 h-1 rounded-full mt-4 overflow-hidden">
          <div :class="stat.barColor" class="h-full w-2/3 rounded-full opacity-70"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <div class="card lg:col-span-2 bg-white">
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div>
            <h3 class="text-base font-bold text-gray-900 tracking-tight">Today's Schedule Matrix</h3>
            <p class="text-xs text-gray-400 mt-0.5">Real-time room assessments</p>
          </div>
          <router-link to="/attendance" class="text-xs text-primary-600 hover:text-primary-700 font-bold uppercase tracking-wider bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 group transition-all">
            View All <span class="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </router-link>
        </div>
        
        <div class="p-6">
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-9 w-9 border-2 border-primary-600 border-t-transparent"></div>
          </div>
          
          <div v-else-if="todaySchedule.length === 0" class="text-center py-14 animate-fade-in">
            <div class="inline-flex p-4 bg-gray-50 text-gray-400 rounded-2xl mb-4 border border-gray-100">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-base font-semibold text-gray-900">Schedule is clear today</p>
            <p class="text-xs text-gray-400 mt-1 max-w-xs mx-auto">No outstanding classroom checks are registered in the tracking matrix.</p>
            <router-link to="/schedules" class="mt-4 inline-flex text-xs uppercase tracking-wider font-bold bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-xl shadow-sm transition-all">
              Manage Schedules
            </router-link>
          </div>

          <div v-else class="space-y-3">
            <div v-for="att in todaySchedule.slice(0, 5)" :key="att.id" 
                 class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-gray-50/80 border border-gray-100/70 rounded-2xl transition-all duration-200 gap-4 animate-slide-up shadow-sm">
              <div class="flex items-center space-x-4">
                <div class="text-center min-w-[64px] bg-gray-900 text-white py-2 px-2.5 rounded-xl shadow-sm">
                  <p class="text-xs font-black tracking-tight">{{ formatTime(att.start_time) }}</p>
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{{ formatTime(att.end_time) }}</p>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-base leading-tight">{{ att.teacher_name }}</p>
                  <p class="text-xs text-gray-500 font-medium mt-1 inline-flex items-center gap-1.5">
                    <span class="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono text-[10px]">{{ att.subject }}</span>
                    <span class="text-gray-300">•</span> 
                    <span>{{ att.grade_level }} {{ att.section }}</span>
                  </p>
                </div>
              </div>
              <div class="flex items-center justify-between sm:justify-end space-x-3 border-t border-gray-50 sm:border-0 pt-3 sm:pt-0">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-primary-50 text-primary-700 border border-primary-100/50">
                  RM {{ att.room }}
                </span>
                <span :class="getStatusClass(att.attendance_status)" class="badge px-3 py-1 text-xs font-bold rounded-lg shadow-2sm capitalize">
                  {{ att.attendance_status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4 lg:col-span-1">
        <div class="px-2">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Command Center</h3>
          <p class="text-xs text-gray-500 mt-0.5">Instant event registrations</p>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <button v-for="action in quickActions" :key="action.title"
                  @click="$router.push(action.route)" 
                  class="card p-5 card-glow-hover text-left bg-white relative overflow-hidden group active:scale-[0.98] transition-all duration-200 border border-gray-100">
            <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300" :class="action.gradient"></div>
            
            <div class="flex items-start space-x-4 relative z-10">
              <div :class="action.bg" class="p-3 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110">
                <component :is="action.icon" class="h-5 w-5" :class="action.color" />
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-sm sm:text-base flex items-center justify-between">
                  {{ action.title }}
                  <span class="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all text-primary-600 text-sm">→</span>
                </p>
                <p class="text-xs text-gray-400 font-medium mt-0.5 leading-normal">{{ action.desc }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'

interface DailyAttendance {
  id: number
  start_time: string
  end_time: string
  teacher_name: string
  subject: string
  grade_level: string
  section: string
  room: string
  attendance_status: string
}

// Minimalistic clean stroke SVG icon definitions 
const UsersIcon = markRaw({ template: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>` })
const CalendarIcon = markRaw({ template: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>` })
const CheckedIcon = markRaw({ template: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` })
const ClockIcon = markRaw({ template: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>` })
const UserPlusIcon = markRaw({ template: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>` })
const CheckListIcon = markRaw({ template: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>` })
const ShieldAlertIcon = markRaw({ template: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>` })

const authStore = useAuthStore()
const { get, loading } = useApi()

const todaySchedule = ref<DailyAttendance[]>([])
const totalTeachersCount = ref(0)

// High-end metadata configuration matrices
const cardStats = computed(() => [
  { title: 'Total Teachers', value: totalTeachersCount.value, icon: UsersIcon, iconBg: 'bg-primary-50', iconColor: 'text-primary-600', barColor: 'bg-primary-500' },
  { title: "Today's Classes", value: todaySchedule.value.length, icon: CalendarIcon, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', barColor: 'bg-blue-500' },
  { title: 'Checked Rooms', value: todaySchedule.value.filter(a => a.attendance_status !== 'pending').length, icon: CheckedIcon, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', barColor: 'bg-emerald-500' },
  { title: 'Pending Checks', value: todaySchedule.value.filter(a => a.attendance_status === 'pending').length, icon: ClockIcon, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', barColor: 'bg-amber-500' },
])

const quickActions = [
  { title: 'Check-in Visitor', desc: 'Register a new guest or visitor arrival', route: '/visitors', icon: UserPlusIcon, bg: 'bg-purple-50', color: 'text-purple-600', gradient: 'from-purple-500 to-transparent' },
  { title: 'Check Rooms', desc: 'Perform live classroom status sweeps', route: '/attendance', icon: CheckListIcon, bg: 'bg-emerald-50', color: 'text-emerald-600', gradient: 'from-emerald-500 to-transparent' },
  { title: 'Report Issue', desc: 'Log infrastructure or facility problems', route: '/facilities', icon: ShieldAlertIcon, bg: 'bg-orange-50', color: 'text-orange-600', gradient: 'from-orange-500 to-transparent' }
]

const fetchDashboardData = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    todaySchedule.value = await get<DailyAttendance[]>(`/attendance/date/${today}`)
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
  }
}

const formatTime = (time: string) => (time ? time.substring(0, 5) : '')

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'present': return 'badge-success ring-1 ring-emerald-600/10'
    case 'absent':  return 'badge-danger ring-1 ring-red-600/10'
    case 'late':    return 'badge-warning ring-1 ring-amber-600/10'
    case 'excused': return 'badge-info ring-1 ring-sky-600/10'
    default:        return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>