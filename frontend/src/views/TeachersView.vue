<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Faculty Directory</h2>
        <p class="mt-2 text-sm text-gray-500">Manage institutional educators, departments, and active schedule matrix mappings.</p>
      </div>
    </div>

    <div class="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 text-sm">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="w-full bg-gray-50/60 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm" 
            placeholder="Search by name, employee ID, or department..."
          >
        </div>
        <select 
          v-model="departmentFilter" 
          class="bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm cursor-pointer w-full sm:w-56"
        >
          <option value="">All Departments</option>
          <option v-for="(dept, idx) in departments" :key="dept ?? idx" :value="dept">
            🏢 {{ dept }}
          </option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee Profile</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Department Unit</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Contact Address</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile Contact</th>
              <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50 text-sm">
            <tr v-if="loading" class="text-center">
              <td colspan="5" class="px-6 py-16">
                <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent inline-block"></div>
                <p class="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing faculty nodes...</p>
              </td>
            </tr>
            <tr v-else-if="filteredTeachers.length === 0" class="text-center">
              <td colspan="5" class="px-6 py-16 text-gray-400 font-medium">
                <p class="text-gray-900 font-bold mb-0.5">No teachers found</p>
                <p class="text-xs">Adjust filtering criteria or register a fresh employee profile node.</p>
              </td>
            </tr>
            <tr 
              v-for="teacher in filteredTeachers" 
              :key="teacher.id" 
              class="hover:bg-gray-50/60 transition-colors duration-150"
            >
              <td class="px-6 py-4.5">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-xl bg-gray-950 text-white flex items-center justify-center font-black text-sm shadow-2sm">
                      {{ teacher.full_name?.charAt(0) || 'T' }}
                    </div>
                  </div>
                  <div class="ml-3.5 min-w-0">
                    <div class="font-extrabold text-gray-900 text-sm tracking-tight truncate">{{ teacher.full_name }}</div>
                    <div class="mt-0.5">
                      <span class="inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono bg-gray-50 text-gray-500 border border-gray-100 tracking-tight uppercase">
                        {{ teacher.employee_id }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4.5">
                <span class="text-gray-900 font-bold tracking-tight capitalize bg-gray-100/70 border border-gray-200/40 text-xs px-2.5 py-1 rounded-lg shadow-2sm">
                  🏢 {{ teacher.department || 'General' }}
                </span>
              </td>
              <td class="px-6 py-4.5 text-gray-600 font-medium font-mono text-xs">
                {{ teacher.email || '—' }}
              </td>
              <td class="px-6 py-4.5 text-gray-600 font-semibold font-mono text-xs">
                {{ teacher.contact_number || '—' }}
              </td>
              <td class="px-6 py-4.5 text-right whitespace-nowrap">
                <button 
                  @click="viewSchedule(teacher)" 
                  class="text-xs uppercase tracking-wider font-black bg-gray-50 text-gray-900 border border-gray-200/80 hover:bg-gray-900 hover:text-white px-4 py-2 rounded-xl shadow-2sm transition-all active:scale-[0.97]"
                >
                  📅 View Schedule
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showScheduleModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-sm" @click="showScheduleModal = false"></div>
        <div class="relative bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-gray-100 animate-scale-up z-10 max-h-[85vh] overflow-y-auto space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-gray-50">
            <div>
              <h3 class="text-base font-black text-gray-900 tracking-tight">📅 Weekly Schedule Matrix</h3>
              <p class="text-xs text-gray-400 font-medium mt-0.5" v-if="selectedTeacher">Teacher: <span class="font-bold text-gray-700">{{ selectedTeacher.full_name }}</span></p>
            </div>
            <button @click="showScheduleModal = false" class="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 text-xl transition-all">&times;</button>
          </div>

          <div v-if="loadingSchedule" class="text-center py-16">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent inline-block"></div>
            <p class="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assembling time tables...</p>
          </div>

          <div v-else-if="teacherSchedules.length === 0" class="text-center py-16 text-gray-400 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
            <p class="text-gray-900 font-bold mb-0.5">Zero Active Schedules Mapping</p>
            <p class="text-xs">No template timetable configurations bound to this specific faculty account.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="sched in teacherSchedules" 
              :key="sched.id"
              class="bg-white border border-gray-100 rounded-xl p-4 shadow-2sm hover:shadow-soft transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <span class="inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gray-950 text-white shadow-2sm">
                      {{ sched.day_of_week }}
                    </span>
                    <h4 class="font-extrabold text-gray-900 text-sm mt-1.5 tracking-tight group-hover:text-gray-700 transition-colors truncate">
                      {{ sched.subject }}
                    </h4>
                  </div>
                  <span class="bg-blue-50 text-blue-700 border border-blue-100/60 text-[10px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider shrink-0 shadow-2sm">
                    📍 {{ sched.room || 'N/A' }}
                  </span>
                </div>

                <div class="pt-2 border-t border-gray-50 space-y-1.5 text-xs font-semibold text-gray-500">
                  <div class="flex items-center gap-2">
                    <span class="bg-gray-50 p-1 rounded-md text-[11px]">⏳</span>
                    <span class="font-mono font-bold text-gray-700">
                      {{ formatTime(sched.start_time) }} - {{ formatTime(sched.end_time) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="bg-gray-50 p-1 rounded-md text-[11px]">🎓</span>
                    <span class="text-gray-600">
                      {{ sched.grade_level }} — Section <span class="font-bold text-gray-900">{{ sched.section || 'N/A' }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-3 border-t border-gray-50">
            <button 
              type="button" 
              @click="showScheduleModal = false" 
              class="text-xs uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl transition-all"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Teacher, ScheduleTemplate } from '@/types'

const { get, loading } = useApi()

const teachers = ref<Teacher[]>([])
const searchQuery = ref('')
const departmentFilter = ref('')
const showScheduleModal = ref(false)
const loadingSchedule = ref(false)
const selectedTeacher = ref<Teacher | null>(null)
const teacherSchedules = ref<ScheduleTemplate[]>([])

const departments = computed(() => {
  const depts = new Set(teachers.value.map(t => t.department).filter(Boolean))
  return Array.from(depts).sort()
})

const filteredTeachers = computed(() => {
  return teachers.value.filter((teacher: Teacher) => {
    const matchesSearch = !searchQuery.value || 
      teacher.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      teacher.employee_id?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesDepartment = !departmentFilter.value || 
      teacher.department === departmentFilter.value
    
    return matchesSearch && matchesDepartment
  })
})

const fetchTeachers = async () => {
  try {
    teachers.value = await get<Teacher[]>('/teachers')
  } catch (err) {
    console.error('Failed to fetch teachers:', err)
  }
}

const viewSchedule = async (teacher: Teacher) => {
  selectedTeacher.value = teacher
  showScheduleModal.value = true
  loadingSchedule.value = true
  
  try {
    teacherSchedules.value = await get<ScheduleTemplate[]>(`/schedules?teacher_id=${teacher.id}`)
  } catch (err) {
    console.error('Failed to fetch schedule:', err)
  } finally {
    loadingSchedule.value = false
  }
}

const formatTime = (time: string) => {
  if (!time) return ''
  return time.substring(0, 5)
}

onMounted(() => {
  fetchTeachers()
})
</script>