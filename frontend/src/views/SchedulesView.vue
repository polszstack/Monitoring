<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Schedule Templates</h2>
        <p class="mt-2 text-sm text-gray-500">Construct, configure, and manage institutional master weekly class schedules for teachers[cite: 9].</p>
      </div>
      <button 
        @click="showAddModal = true" 
        class="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-black bg-gray-950 text-white hover:bg-gray-800 px-5 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] self-start sm:self-center"
      >
        ➕ Add Schedule
      </button>
    </div>

    <!-- Schedule Table Matrix Card -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Day</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Block</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Faculty</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Matrix</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Placement</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Grade & Section</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50 text-sm">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="px-6 py-16">
                <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent inline-block"></div>
                <p class="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fetching schedule frames...</p>
              </td>
            </tr>
            <tr v-else-if="schedules.length === 0">
              <td colspan="6" class="px-6 py-16 text-center text-gray-400 font-medium">
                <p class="text-gray-900 font-bold mb-0.5">No schedule templates discovered</p>
                <p class="text-xs">Click the action button above to initialize your institutional agenda matrix.</p>
              </td>
            </tr>
            <tr 
              v-for="schedule in schedules" 
              :key="schedule.id" 
              class="hover:bg-gray-50/60 transition-colors duration-150"
            >
              <td class="px-6 py-4.5 whitespace-nowrap">
                <span 
                  :class="getDayClass(schedule.day_of_week)" 
                  class="inline-flex items-center px-2.5 py-1 border border-current/10 rounded-lg text-xs font-bold shadow-2sm"
                >
                  🗓️ {{ schedule.day_of_week }}
                </span>
              </td>
              <td class="px-6 py-4.5 font-mono font-bold text-gray-700 text-xs whitespace-nowrap">
                {{ formatTime(schedule.start_time) }} - {{ formatTime(schedule.end_time) }}
              </td>
              <td class="px-6 py-4.5">
                <div class="font-extrabold text-gray-900 tracking-tight">{{ schedule.teacher_name }}</div>
                <div class="mt-0.5">
                  <span class="inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-gray-50 text-gray-500 border border-gray-100 tracking-tight uppercase">
                    {{ schedule.employee_id }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4.5 font-bold text-gray-900 tracking-tight">
                {{ schedule.subject }}
              </td>
              <td class="px-6 py-4.5 whitespace-nowrap">
                <span class="text-gray-900 font-semibold text-xs bg-gray-100/70 border border-gray-200/40 px-2.5 py-1 rounded-lg shadow-2sm">
                  📍 {{ schedule.room || '—' }}
                </span>
              </td>
              <td class="px-6 py-4.5 text-gray-600 font-medium">
                {{ schedule.grade_level }} <span v-if="schedule.section" class="font-bold text-gray-900">— {{ schedule.section }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Schedule Modal Frame -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-sm" @click="showAddModal = false"></div>
        
        <div class="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-scale-up z-10 max-h-[90vh] overflow-y-auto space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <h3 class="text-base font-black text-gray-900 tracking-tight">📝 Add Schedule Template</h3>
              <p class="text-xs text-gray-400 font-medium mt-0.5">Initialize a weekly class block blueprint configuration.</p>
            </div>
            <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 text-xl transition-all">&times;</button>
          </div>

          <form @submit.prevent="addSchedule" class="space-y-4">
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Teacher Allocation</label>
              <select v-model="newSchedule.teacher_id" required class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm cursor-pointer">
                <option value="">Select Teacher</option>
                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  🏢 {{ teacher.full_name }} ({{ teacher.employee_id }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Target Day of Week</label>
              <select v-model="newSchedule.day_of_week" required class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm cursor-pointer">
                <option value="">Select Day</option>
                <option v-for="day in days" :key="day" :value="day">🗓️ {{ day }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Start Time</label>
                <input v-model="newSchedule.start_time" type="time" required class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm">
              </div>
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">End Time</label>
                <input v-model="newSchedule.end_time" type="time" required class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm">
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Subject Designation</label>
              <input v-model="newSchedule.subject" type="text" required class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm" placeholder="e.g. Advanced Mathematics">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Room Assignment</label>
                <input v-model="newSchedule.room" type="text" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm" placeholder="e.g. Room 402">
              </div>
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Grade Tier</label>
                <input v-model="newSchedule.grade_level" type="text" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm" placeholder="e.g. Grade 11">
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Section Name</label>
              <input v-model="newSchedule.section" type="text" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm" placeholder="e.g. Section Alpha">
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
              <button 
                type="button" 
                @click="showAddModal = false" 
                class="text-xs uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="text-xs uppercase tracking-wider font-black bg-gray-950 hover:bg-gray-800 text-white px-5 py-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Save Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

type ScheduleTemplate = {
  id?: string | number
  teacher_id?: string | number
  teacher_name?: string
  employee_id?: string
  day_of_week: string
  start_time: string
  end_time: string
  subject?: string
  room?: string
  grade_level?: string
  section?: string
}

type Teacher = {
  id: string | number
  full_name: string
  employee_id?: string
}

const { get, post, loading } = useApi()

const schedules = ref<ScheduleTemplate[]>([])
const teachers = ref<Teacher[]>([])
const showAddModal = ref(false)

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const newSchedule = ref({
  teacher_id: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  subject: '',
  room: '',
  grade_level: '',
  section: ''
})

const fetchSchedules = async () => {
  try {
    schedules.value = await get<ScheduleTemplate[]>('/schedules')
  } catch (err) {
    console.error('Failed to fetch schedules:', err)
  }
}

const fetchTeachers = async () => {
  try {
    teachers.value = await get<Teacher[]>('/teachers')
  } catch (err) {
    console.error('Failed to fetch teachers:', err)
  }
}

const addSchedule = async () => {
  try {
    await post('/schedules', newSchedule.value)
    showAddModal.value = false
    newSchedule.value = { teacher_id: '', day_of_week: '', start_time: '', end_time: '', subject: '', room: '', grade_level: '', section: '' }
    await fetchSchedules()
  } catch (err) {
    console.error('Failed to add schedule:', err)
  }
}

const formatTime = (time: string) => {
  if (!time) return ''
  return time.substring(0, 5)
}

const getDayClass = (day: string) => {
  const classes: Record<string, string> = {
    Monday: 'bg-blue-50 border-blue-100 text-blue-700',
    Tuesday: 'bg-green-50 border-green-100 text-green-700',
    Wednesday: 'bg-yellow-50 border-yellow-100 text-yellow-700',
    Thursday: 'bg-purple-50 border-purple-100 text-purple-700',
    Friday: 'bg-red-50 border-red-100 text-red-700',
    Saturday: 'bg-gray-50 border-gray-200 text-gray-700',
    Sunday: 'bg-pink-50 border-pink-100 text-pink-700'
  }
  return classes[day] || 'bg-gray-50 border-gray-200 text-gray-700'
}

onMounted(() => {
  fetchSchedules()
  fetchTeachers()
})
</script>