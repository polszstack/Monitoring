<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Room Attendance Check</h2>
        <p class="mt-2 text-sm text-gray-500">
          Monitor operational facilities and mark teacher attendance matrices for scheduled rooms.
        </p>
      </div>
      
      <div class="flex items-center gap-3 self-start md:self-auto w-full md:w-auto">
        <div class="relative flex-1 md:flex-initial">
          <input 
            type="date" 
            v-model="selectedDate"
            class="w-full md:w-auto bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-2sm"
            @change="fetchAttendance"
          >
        </div>
        <button 
          @click="generateTodayAttendance" 
          class="flex-1 md:flex-initial text-xs uppercase tracking-wider font-black bg-gray-900 text-white hover:bg-gray-800 px-5 py-3 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
        >
          Generate Today's Matrix
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="card p-5 bg-white border border-gray-100 flex items-center justify-between group">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Classes</p>
          <p class="text-3xl font-black text-gray-900 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ totalClasses }}
          </p>
        </div>
        <div class="p-3 bg-gray-50 text-gray-400 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
        </div>
      </div>
      <div class="card p-5 bg-white border border-gray-100 flex items-center justify-between group">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Present</p>
          <p class="text-3xl font-black text-emerald-600 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ presentCount }}
          </p>
        </div>
        <div class="p-3 bg-emerald-50/60 text-emerald-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-white border border-gray-100 flex items-center justify-between group">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-red-400 uppercase tracking-widest">Absent</p>
          <p class="text-3xl font-black text-red-500 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ absentCount }}
          </p>
        </div>
        <div class="p-3 bg-red-50/60 text-red-500 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-white border border-gray-100 flex items-center justify-between group">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pending</p>
          <p class="text-3xl font-black text-amber-600 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ pendingCount }}
          </p>
        </div>
        <div class="p-3 bg-amber-50/60 text-amber-500 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
    </div>

    <div class="card bg-white overflow-hidden shadow-soft border border-gray-100">
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
        <div>
          <h3 class="text-base font-bold text-gray-900 tracking-tight">
            {{ isToday ? "Today's Schedule Stream" : `Schedule Context Matrix: ${selectedDate}` }}
          </h3>
          <p class="text-xs text-gray-400 mt-0.5">Verify physical location occupancy metrics seamlessly.</p>
        </div>
      </div>

      <div>
        <div v-if="loading" class="flex flex-col justify-center items-center py-20">
          <div class="animate-spin rounded-full h-9 w-9 border-2 border-primary-600 border-t-transparent"></div>
          <p class="mt-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Syncing Database Matrix...</p>
        </div>
        
        <div v-else-if="attendanceList.length === 0" class="text-center py-16 animate-fade-in">
          <div class="inline-flex p-4 bg-gray-50 text-gray-400 rounded-2xl mb-4 border border-gray-100">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p class="text-base font-semibold text-gray-900">No Registry Records Found</p>
          <p class="text-xs text-gray-400 mt-1 max-w-xs mx-auto">There are no operational checks logged for this specific timeline matrix.</p>
          <button @click="generateTodayAttendance" class="mt-4 inline-flex text-xs uppercase tracking-wider font-bold bg-gray-900 text-white hover:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm transition-all">
            Generate Default Set
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead>
              <tr class="bg-gray-50/70 border-b border-gray-100">
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule Clock</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Location Node</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Professional</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Course Subject</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification</th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-Time Status</th>
                <th class="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions Registry</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/70 bg-white">
              <tr v-for="att in attendanceList" :key="att.id" 
                  class="hover:bg-gray-50/40 transition-colors group"
                  :class="getRowClass(att.attendance_status)">
                
                <td class="px-6 py-4.5 whitespace-nowrap">
                  <div class="font-bold text-gray-900 text-sm tracking-tight">{{ formatTime(att.start_time) }}</div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">{{ formatTime(att.end_time) }}</div>
                </td>

                <td class="px-6 py-4.5 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-primary-50 text-primary-700 border border-primary-100/40 shadow-2sm">
                    RM {{ att.room }}
                  </span>
                </td>

                <td class="px-6 py-4.5 whitespace-nowrap">
                  <div class="font-bold text-gray-900 text-sm tracking-tight group-hover:text-primary-600 transition-colors">{{ att.teacher_name }}</div>
                  <div class="text-xs font-mono text-gray-400 mt-0.5">{{ att.employee_id }}</div>
                </td>

                <td class="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-gray-700">
                  {{ att.subject }}
                </td>

                <td class="px-6 py-4.5 whitespace-nowrap">
                  <div v-if="att.verification_photo" class="h-10 w-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:scale-150 transition-transform duration-150 cursor-zoom-in">
                    <img :src="getPhotoUrl(att.verification_photo)" class="h-full w-full object-cover" alt="Verification proof" />
                  </div>
                  <span v-else class="text-xs font-medium text-gray-400 italic">No image uploads</span>
                </td>

                <td class="px-6 py-4.5 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(att.attendance_status)" class="badge px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider shadow-2sm">
                    {{ att.attendance_status }}
                  </span>
                  <div v-if="att.time_marked" class="text-[10px] font-semibold text-gray-400 mt-1 flex items-center gap-1">
                    <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                    {{ att.time_marked }}
                  </div>
                </td>

                <td class="px-6 py-4.5 whitespace-nowrap text-center">
                  <div class="inline-flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      :id="'photo-upload-' + att.id" 
                      class="hidden" 
                      @change="handlePhotoUpload($event, att.id)"
                    />

                    <label 
                      :for="'photo-upload-' + att.id"
                      class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer select-none"
                      :class="att.attendance_status === 'present' ? 'bg-white text-emerald-600 shadow-2sm pointer-events-none opacity-40' : 'text-gray-500 hover:text-emerald-600 hover:bg-white'"
                      title="Verify teacher presence via camera/photo"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>
                      <span>Present</span>
                    </label>
                    
                    <button 
                      @click="markAttendance(att.id, 'absent')"
                      :disabled="att.attendance_status === 'absent'"
                      class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
                      :class="att.attendance_status === 'absent' ? 'bg-white text-red-600 shadow-2sm' : 'text-gray-500 hover:text-red-600 hover:bg-white'"
                      title="Teacher absent"
                    >
                      <span>Absent</span>
                    </button>
                    
                    <span class="h-3 w-px bg-gray-200 mx-0.5"></span>

                    <button 
                      @click="openRemarkModal(att)"
                      class="p-1.5 text-xs rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-all hover:shadow-2sm"
                      title="Add administrative remarks"
                    >
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
                    </button>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showRemarkModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-sm transition-opacity" @click="showRemarkModal = false"></div>
        
        <div class="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100/80 animate-scale-up z-10">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
            <h3 class="text-base font-black text-gray-900 tracking-tight">Add Registry Remarks</h3>
            <button @click="showRemarkModal = false" class="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <textarea 
            v-model="remarkText" 
            rows="4" 
            class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all mb-4"
            placeholder="Document anomalous indicators, class context, or tracking information details here..."
          ></textarea>
          
          <div class="flex justify-end gap-2">
            <button @click="showRemarkModal = false" class="text-xs uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl transition-all">
              Discard
            </button>
            <button @click="saveRemarks" class="text-xs uppercase tracking-wider font-black bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all">
              Save Alteration
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

interface DailyAttendance {
  id: number
  attendance_status: string
  remarks?: string
  start_time: string
  end_time: string
  room: string
  teacher_name: string
  employee_id: string
  subject: string
  grade_level: string
  section?: string
  time_marked?: string
  verification_photo?: string
}

const { get, put, post, loading } = useApi()

const attendanceList = ref<DailyAttendance[]>([])
const selectedDate = ref(new Date().toISOString().split('T')[0])
const showRemarkModal = ref(false)
const remarkText = ref('')
const selectedAttendanceId = ref<number | null>(null)

// Define backend configurations dynamically
const BACKEND_URL = 'http://localhost:3000'

const isToday = computed(() => {
  return selectedDate.value === new Date().toISOString().split('T')[0]
})

const totalClasses = computed(() => attendanceList.value.length)
const presentCount = computed(() => attendanceList.value.filter(a => a.attendance_status === 'present').length)
const absentCount = computed(() => attendanceList.value.filter(a => a.attendance_status === 'absent').length)
const pendingCount = computed(() => attendanceList.value.filter(a => a.attendance_status === 'pending').length)

const fetchAttendance = async () => {
  try {
    const date = selectedDate.value
    attendanceList.value = await get<DailyAttendance[]>(`/attendance/date/${date}`)
  } catch (err) {
    console.error('Failed to fetch attendance:', err)
  }
}

const generateTodayAttendance = async () => {
  try {
    const date = selectedDate.value
    await post('/schedules/generate-attendance', { date })
    await fetchAttendance()
  } catch (err) {
    console.error('Failed to generate attendance:', err)
  }
}

// FIXED: Bypasses standard useApi to secure flawless FormData transmission safely
const handlePhotoUpload = async (event: Event, attendanceId: number) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    const formData = new FormData()
    formData.append('photo', file)

    try {
      // Pulling active session token if you are utilizing typical authentication schemes
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
      
      const response = await fetch(`${BACKEND_URL}/api/attendance/${attendanceId}/verify-present`, {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })

      if (!response.ok) {
        throw new Error(`Upload server failure response: ${response.statusText}`)
      }

      await fetchAttendance()
    } catch (err) {
      console.error('Failed verification photo upload processing:', err)
      alert('Could not upload verification image. Please try again.')
    }
  }
}

const markAttendance = async (id: number, status: string) => {
  try {
    await put(`/attendance/${id}`, { 
      attendance_status: status 
    })
    await fetchAttendance()
  } catch (err) {
    console.error('Failed to mark attendance:', err)
  }
}

const openRemarkModal = (att: DailyAttendance) => {
  selectedAttendanceId.value = att.id
  remarkText.value = att.remarks || ''
  showRemarkModal.value = true
}

const saveRemarks = async () => {
  if (selectedAttendanceId.value) {
    try {
      await put(`/attendance/${selectedAttendanceId.value}`, {
        attendance_status: attendanceList.value.find(a => a.id === selectedAttendanceId.value)?.attendance_status || 'pending',
        remarks: remarkText.value
      })
      await fetchAttendance()
      showRemarkModal.value = false
    } catch (err) {
      console.error('Failed to save remarks:', err)
    }
  }
}

const formatTime = (time: string) => {
  if (!time) return ''
  return time.substring(0, 5)
}

// FIXED: Formulates reliable URL linking up to the static asset folder explicitly
const getPhotoUrl = (photoPath: string) => {
  if (!photoPath) return ''
  return `${BACKEND_URL}${photoPath}`
}

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'present': return 'badge-success bg-emerald-50 text-emerald-700 border border-emerald-100/60'
    case 'absent':  return 'badge-danger bg-red-50 text-red-700 border border-red-100/60'
    case 'late':    return 'badge-warning bg-amber-50 text-amber-700 border border-amber-100/60'
    case 'excused': return 'badge-info bg-sky-50 text-sky-700 border border-sky-100/60'
    default:        return 'bg-gray-50 text-gray-500 border border-gray-100'
  }
}

const getRowClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'present': return 'bg-emerald-50/10'
    case 'absent':  return 'bg-red-50/10'
    default:        return ''
  }
}

onMounted(() => {
  fetchAttendance()
})
</script>