<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Facility Issue Logging</h2>
        <p class="mt-2 text-sm text-gray-500">Report facility anomalies, track room repair progress states, and review daily active defects.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <button 
          @click="exportPDF" 
          :disabled="filteredReports.length === 0"
          class="text-xs uppercase tracking-wider font-black bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] w-full sm:w-auto text-center flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export PDF
        </button>
        <button 
          @click="quickReport" 
          class="flex-1 md:flex-initial text-xs uppercase tracking-wider font-black bg-red-600 text-white hover:bg-red-700 px-5 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] inline-flex items-center justify-center gap-1.5"
        >
          <span>🚨 Log New Defect / Issue</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="card p-5 bg-white border border-gray-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Tickets</p>
          <p class="text-3xl font-black text-gray-900 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ stats.totalReports }}
          </p>
        </div>
        <div class="p-3 bg-gray-50 text-gray-400 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-red-50/50 border border-red-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-red-500 uppercase tracking-widest">Unassigned/Reported</p>
          <p class="text-3xl font-black text-red-600 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ stats.pendingReports }}
          </p>
        </div>
        <div class="p-3 bg-red-100 text-red-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-amber-50/50 border border-amber-100/50 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest">In Progress Tasks</p>
          <p class="text-3xl font-black text-amber-700 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ progressCount }}
          </p>
        </div>
        <div class="p-3 bg-amber-100 text-amber-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 0019.4 19l-5.83-5.83m-2.15 2l-2.15 2.15a1.5 1.5 0 11-2.12-2.12l2.15-2.15m2.15 2.15l4-4" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-green-50/50 border border-green-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-green-600 uppercase tracking-widest">Resolved Logged</p>
          <p class="text-3xl font-black text-green-700 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ resolvedCount }}
          </p>
        </div>
        <div class="p-3 bg-green-100 text-green-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
        </div>
      </div>
    </div>

    <div class="space-y-4 animate-fade-in">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 border border-gray-200 p-4 rounded-xl gap-4 shadow-sm">
        <div>
          <h3 class="text-xs font-black uppercase text-gray-400 tracking-wider">Daily Incident Operations Log</h3>
          <p class="text-xs text-gray-500">Live operational review of room breakages and defect logs across facility nodes.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select 
            v-model="viewArchived" 
            @change="fetchReports"
            class="w-full sm:w-auto text-xs font-black text-gray-700 bg-white border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer shadow-sm"
          >
            <option :value="false">📋 Active Workspace Logs</option>
            <option :value="true">📦 Archived History Logs</option>
          </select>

          <select 
            v-model="filterCategory" 
            class="w-full sm:w-auto text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer shadow-sm"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ getCategoryEmoji(cat) }} {{ cat }}
            </option>
          </select>

          <button 
            v-if="!viewArchived"
            @click="archiveDailyLog" 
            class="whitespace-nowrap w-full sm:w-auto text-xs uppercase tracking-wider font-black bg-amber-50 text-amber-700 hover:bg-amber-100/80 border border-amber-200/60 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>📦 Archive Finished Logs</span>
          </button>
        </div>
      </div>

      <div v-if="loadingReports" class="flex justify-center items-center py-20 bg-white rounded-2xl border border-gray-100">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
      
      <div v-else-if="filteredReports.length === 0" class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
        <p class="text-base font-bold text-gray-900">📋 No Reports Listed Here</p>
        <p class="text-xs mt-1">There are no matching items remaining in this filter configuration view.</p>
      </div>

      <div 
        v-for="report in filteredReports" 
        :key="report.id" 
        class="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 shadow-2sm"
        :class="report.priority === 'urgent' ? 'border-red-300 ring-2 ring-red-500/5' : ''"
      >
        <div class="space-y-2 flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap text-sm">
            <span class="font-black text-gray-900 text-base">📍 Room Location: {{ report.location }}</span>
            <span v-if="report.room_number" class="bg-gray-900 font-mono text-[11px] font-black text-white px-2 py-0.5 rounded-md">
              {{ report.room_number }}
            </span>
            <span :class="getPriorityBadge(report.priority)" class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
              {{ report.priority }}
            </span>
            <span :class="getStatusBadge(report.status)" class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
              {{ formatStatus(report.status) }}
            </span>
            <span v-if="report.is_archived" class="text-[9px] font-black uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md tracking-wider">
              📦 Archived
            </span>
          </div>

          <p class="text-base font-extrabold text-red-600 tracking-tight">
            <span>{{ getCategoryEmoji(report.facility_type) }} </span>Defect: <span class="text-gray-900 font-black underline decoration-red-200">{{ report.item_name }}</span>
          </p>

          <div class="bg-gray-50/50 border border-gray-100 rounded-xl p-3 max-w-3xl">
            <span class="text-[9px] font-black text-gray-400 tracking-wider uppercase block mb-1">Issue Profile Description:</span>
            <p class="text-xs text-gray-600 font-medium leading-relaxed">
              {{ report.item_description || report.notes || 'No extended status descriptions or incident logs attached.' }}
            </p>
          </div>
          
          <div class="flex items-center gap-4 text-[10px] font-bold text-gray-400 font-mono">
            <span>Ticket: #{{ report.report_number }}</span>
            <span>Reporter: {{ report.reporter_name || 'System User' }}</span>
            <span>Logged: {{ formatDate(report.reported_date) }}</span>
          </div>
        </div>
        
        <div class="flex sm:flex-col items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
          <select 
            :disabled="report.is_archived === 1"
            :value="report.status" 
            @change="(e: any) => updateReportStatus(report, e.target.value)"
            class="w-full sm:w-auto text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all cursor-pointer shadow-2sm disabled:opacity-50"
          >
            <option value="reported">📋 Reported</option>
            <option value="in_progress">🔧 In Progress</option>
            <option value="fixed">✅ Fixed</option>
            <option value="cannot_fix">❌ Cannot Fix</option>
            <option value="cancelled">🚫 Cancelled</option>
          </select>

          <button 
            @click="archiveSingleReport(report.id)"
            class="w-full sm:w-auto text-[11px] font-black uppercase tracking-wider py-2 px-3 bg-white transition-all text-center shadow-2sm border rounded-xl"
            :class="report.is_archived ? 'hover:bg-green-50 text-green-600 border-green-200' : 'hover:bg-amber-50 text-gray-400 hover:text-amber-700 border-gray-200 hover:border-amber-300'"
          >
            {{ report.is_archived ? '📤 Unarchive Logs' : '📦 Archive Item' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showReportModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-sm" @click="showReportModal = false"></div>
        <div class="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scale-up z-10">
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-gray-50">
            <h3 class="text-base font-black text-gray-900 tracking-tight">🚨 Log Defective Room Item</h3>
            <button @click="showReportModal = false" class="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 text-xl transition-all">&times;</button>
          </div>
          
          <form @submit.prevent="submitReport" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Defective Item Name</label>
              <input 
                v-model="newReport.item_name" 
                type="text" 
                class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm"
                placeholder="e.g., Broken Ceiling Fan, Leaking Faucet, Whiteboard Crack..."
                required
              >
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Category Domain</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="cat in categories" :key="cat"
                  type="button"
                  @click="newReport.facility_type = cat"
                  :class="newReport.facility_type === cat ? 'ring-2 ring-gray-900 bg-gray-50 border-transparent font-bold' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium'"
                  class="p-2.5 rounded-xl text-[11px] capitalize transition-all text-center truncate shadow-2sm"
                >
                  {{ getCategoryEmoji(cat) }} {{ cat }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Building Location</label>
                <select v-model="newReport.location" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm" required>
                  <option value="">Select Building</option>
                  <option value="Main Building">Main Building</option>
                  <option value="Annex Building">Annex Building</option>
                  <option value="Gymnasium">Gymnasium</option>
                  <option value="Library">Library</option>
                  <option value="Science Lab">Science Lab</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Admin Office">Admin Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Room Number Hub</label>
                <select v-model="newReport.room_number" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm">
                  <option value="">Select Room</option>
                  <option value="Room 101">Room 101</option>
                  <option value="Room 102">Room 102</option>
                  <option value="Room 201">Room 201</option>
                  <option value="Room 202">Room 202</option>
                  <option value="Room 301">Room 301</option>
                  <option value="Room 302">Room 302</option>
                  <option value="Lab 1">Lab 1</option>
                  <option value="Lab 2">Lab 2</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Issue Profile Description</label>
              <textarea v-model="newReport.item_description" rows="3" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm" placeholder="Provide precise anomaly diagnostics and fault specifics..."></textarea>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Priority Matrix Status</label>
              <div class="grid grid-cols-4 gap-2">
                <button 
                  v-for="p in priorities" :key="p.value"
                  type="button"
                  @click="newReport.priority = p.value"
                  :class="[
                    newReport.priority === p.value ? 'ring-2 ring-offset-1 ring-gray-950 font-black ' + p.activeClass : 'bg-white border border-gray-200 text-gray-600',
                    'p-2 rounded-xl text-[10px] transition-all text-center uppercase tracking-wider'
                  ]"
                >
                  {{ p.emoji }} {{ p.label }}
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-gray-50 mt-4">
              <button type="button" @click="showReportModal = false" class="text-xs uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl transition-all">Cancel</button>
              <button type="submit" class="text-xs uppercase tracking-wider font-black bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all">Submit Issue Report</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { FacilityReport } from '@/types'

const { get, post, put } = useApi()

const loadingReports = ref(false)
const filterCategory = ref('')
const viewArchived = ref(false)

const stats = ref({ totalReports: 0, pendingReports: 0 })
const reports = ref<FacilityReport[]>([])
const showReportModal = ref(false)

const categories = ['furniture', 'electrical', 'plumbing', 'electronics', 'structural', 'other']
const priorities = [
  { value: 'low', label: 'Low', emoji: '🟢', activeClass: 'ring-green-500 bg-green-50/40 text-green-700' },
  { value: 'medium', label: 'Med', emoji: '🟡', activeClass: 'ring-yellow-500 bg-yellow-50/40 text-yellow-700' },
  { value: 'high', label: 'High', emoji: '🟠', activeClass: 'ring-orange-500 bg-orange-50/40 text-orange-700' },
  { value: 'urgent', label: 'Urgent', emoji: '🔴', activeClass: 'ring-red-500 bg-red-50/40 text-red-700' }
]

const newReport = ref({
  item_name: '',
  facility_type: 'furniture',
  item_description: '',
  location: '',
  room_number: '',
  priority: 'medium',
  notes: ''
})

const filteredReports = computed(() => {
  if (!filterCategory.value) return reports.value
  return reports.value.filter(report => report.facility_type === filterCategory.value)
})

const progressCount = computed(() => {
  return reports.value.filter(r => r.status === 'in_progress' && !r.is_archived).length
})

const resolvedCount = computed(() => {
  return reports.value.filter(r => ['fixed', 'cannot_fix', 'cancelled'].includes(r.status) && !r.is_archived).length
})

const quickReport = () => {
  newReport.value = {
    item_name: '',
    facility_type: 'furniture',
    item_description: '',
    location: '',
    room_number: '',
    priority: 'medium',
    notes: ''
  }
  showReportModal.value = true
}

const fetchReports = async () => {
  loadingReports.value = true
  try {
    reports.value = await get<FacilityReport[]>(`/facility/reports?include_archived=${viewArchived.value}`)
  } catch (err) {
    console.error('Failed to fetch reports:', err)
  } finally {
    loadingReports.value = false
  }
}

const fetchStats = async () => {
  try {
    stats.value = await get<any>('/facility/stats')
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

const submitReport = async () => {
  try {
    if (!newReport.value.item_name.trim()) {
      alert('Please enter a broken item label name')
      return
    }
    if (!newReport.value.location) {
      alert('Please select a target location')
      return
    }
    
    await post('/facility/reports', newReport.value)
    showReportModal.value = false
    viewArchived.value = false
    await fetchReports()
    await fetchStats()
  } catch (err: any) {
    alert('Error: ' + (err.response?.data?.error || err.message))
  }
}

const updateReportStatus = async (report: FacilityReport, status: string) => {
  try {
    await put(`/facility/reports/${report.id}`, { status })
    await fetchReports()
    await fetchStats()
  } catch (err: any) {
    alert('Error: ' + (err.response?.data?.error || err.message))
  }
}

const archiveSingleReport = async (id: number) => {
  try {
    await put(`/facility/reports/${id}/archive`, {})
    await fetchReports()
    await fetchStats()
  } catch (err: any) {
    alert('Archival action failed: ' + err.message)
  }
}

const archiveDailyLog = async () => {
  if (!confirm('Archive all completed, fixed, or cancelled issues from active dashboard log?')) return
  try {
    await post('/facility/reports/archive-daily', {})
    await fetchReports()
    await fetchStats()
  } catch (err: any) {
    alert('Bulk archival process failure: ' + err.message)
  }
}

const exportPDF = () => {
  if (filteredReports.value.length === 0) return

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text('Facility Issue Report', pageWidth / 2, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setTextColor(100)
  const dateStr = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(`Generated: ${dateStr}`, pageWidth / 2, 28, { align: 'center' })
  
  // Summary
  doc.setFontSize(9)
  doc.setTextColor(80)
  const viewMode = viewArchived.value ? 'Archived Records' : 'Active Records'
  doc.text(
    `Summary: Total: ${filteredReports.value.length} | In Progress: ${progressCount.value} | Resolved: ${resolvedCount.value} | View: ${viewMode}`,
    pageWidth / 2,
    36,
    { align: 'center' }
  )

  // Table
  const tableData = filteredReports.value.map(report => [
    report.report_number || 'N/A',
    report.item_name || 'N/A',
    report.facility_type || 'N/A',
    report.location || 'N/A',
    report.room_number || 'N/A',
    report.status || 'N/A',
    report.priority || 'N/A',
    report.reporter_name || 'System User',
    report.reported_date ? new Date(report.reported_date).toLocaleDateString() : 'N/A'
  ])

  autoTable(doc, {
    startY: 42,
    head: [['Ticket #', 'Item', 'Category', 'Location', 'Room', 'Status', 'Priority', 'Reporter', 'Date']],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: [17, 24, 39],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 7,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 18 },
      5: { cellWidth: 20 },
      6: { cellWidth: 18 },
      7: { cellWidth: 25 },
      8: { cellWidth: 22 }
    }
  })

  // Footer
  const pageCount = doc.internal.pages.length
  for (let i = 1; i < pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} of ${pageCount - 1}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`Facility_Report_${new Date().toISOString().split('T')[0]}.pdf`)
}

const getCategoryEmoji = (cat: string) => {
  const emojis: Record<string, string> = {
    furniture: '🪑', electrical: '⚡', plumbing: '🔧',
    electronics: '💻', structural: '🏗️', other: '📦'
  }
  return emojis[cat] || '📦'
}

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    reported: 'bg-red-50 text-red-700 border border-red-100/40',
    in_progress: 'bg-amber-50 text-amber-700 border border-amber-100/40',
    fixed: 'bg-emerald-50 text-emerald-700 border border-emerald-100/40',
    cannot_fix: 'bg-gray-100 text-gray-600 border border-gray-200/40',
    cancelled: 'bg-gray-50 text-gray-400 border border-gray-100'
  }
  return map[status] || 'bg-gray-50 text-gray-700'
}

const getPriorityBadge = (priority: string) => {
  const map: Record<string, string> = {
    low: 'bg-gray-50 text-gray-600 border border-gray-100',
    medium: 'bg-amber-50 text-amber-700 border border-amber-100/40',
    high: 'bg-orange-50 text-orange-700 border border-orange-100/40',
    urgent: 'bg-red-50 text-red-700 border border-red-100/40'
  }
  return map[priority] || 'bg-gray-50 text-gray-700'
}

const formatStatus = (status: string) => status.replace('_', ' ')
const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

onMounted(() => {
  fetchStats()
  fetchReports()
})
</script>