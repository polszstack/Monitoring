 
<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50/50 py-4 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">Facility Hub</h1>
          <p class="mt-1 text-sm text-gray-500">Monitor internal physical infrastructure inventory and issue damage assessments</p>
        </div>
      </div>

      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button 
            @click="activeTab = 'reports'" 
            :class="activeTab === 'reports' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'" 
            class="whitespace-nowrap py-4 px-1 border-b-2 text-sm transition-all flex items-center gap-2"
          >
            📋 Damage Logs
          </button>
          <button 
            @click="activeTab = 'inventory'" 
            :class="activeTab === 'inventory' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'" 
            class="whitespace-nowrap py-4 px-1 border-b-2 text-sm transition-all flex items-center gap-2"
          >
            📦 Campus Inventory
          </button>
          <button 
            @click="activeTab = 'report'" 
            :class="activeTab === 'report' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'" 
            class="whitespace-nowrap py-4 px-1 border-b-2 text-sm transition-all flex items-center gap-2"
          >
            ⚠️ File Incident Report
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'reports' && statsData" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Incidents</p>
            <p class="text-2xl font-black text-gray-900 mt-1">{{ statsData.total_reports || 0 }}</p>
          </div>
          <div class="p-2.5 bg-gray-50 rounded-xl text-gray-500">📊</div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Reported</p>
            <p class="text-2xl font-black text-amber-600 mt-1">{{ statsData.reported_count || 0 }}</p>
          </div>
          <div class="p-2.5 bg-amber-50 rounded-xl text-amber-600">🔔</div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
            <p class="text-2xl font-black text-blue-600 mt-1">{{ statsData.in_progress_count || 0 }}</p>
          </div>
          <div class="p-2.5 bg-blue-50 rounded-xl text-blue-600">🔧</div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved</p>
            <p class="text-2xl font-black text-emerald-600 mt-1">{{ statsData.fixed_count || 0 }}</p>
          </div>
          <div class="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">✅</div>
        </div>
      </div>

      <div v-if="activeTab === 'reports'" class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1">⚙️ Filter Logs:</div>
          <select v-model="filterStatus" @change="loadReports" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all">
            <option value="">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="in_progress">In Progress</option>
            <option value="fixed">Fixed</option>
            <option value="cannot_fix">Cannot Fix</option>
          </select>
          <select v-model="filterPriority" @change="loadReports" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select v-model="filterType" @change="loadReports" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all">
            <option value="">All Structural Categories</option>
            <option value="furniture">Furniture</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="electronics">Electronics</option>
            <option value="structural">Structural</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
          <div v-if="loading" class="p-12 flex flex-col justify-center items-center">
            <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p class="text-xs text-gray-400">Syncing facility registers...</p>
          </div>
          
          <div v-else-if="reportsList.length === 0" class="p-12 text-center max-w-sm mx-auto text-gray-500">
            <p class="font-bold text-gray-900">No logs matching requirements</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50/70">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Log ID</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Asset Item</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Location Pointer</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status Badge</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Reporter</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date Tracked</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr v-for="report in reportsList" :key="report.id" class="hover:bg-gray-50/60 transition-colors relative">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 relative">
                    <div class="absolute left-0 top-0 bottom-0 w-1" :class="getPriorityAccentColor(report.priority)"></div>
                    {{ report.report_number }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ report.item_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-[11px] font-bold rounded-lg bg-gray-100 text-gray-600 uppercase tracking-wide">
                      {{ report.facility_type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                    {{ report.location }} <span v-if="report.room_number" class="text-xs text-gray-400 font-normal">({{ report.room_number }})</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="'px-2 py-0.5 text-xs font-bold rounded-md ' + getPriorityClass(report.priority)">
                      {{ report.priority }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="'px-2 py-0.5 text-xs font-bold rounded-md ' + getStatusClass(report.status)">
                      {{ formatStatus(report.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{{ report.reporter_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">{{ formatDate(report.reported_date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button
                      v-if="report.status !== 'fixed' && report.status !== 'cancelled'"
                      @click="openUpdateModal(report)"
                      class="px-3 py-1 bg-gray-50 hover:bg-blue-50 text-blue-600 border border-gray-100 hover:border-blue-100 shadow-sm rounded-lg text-xs font-bold transition-all"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'inventory'">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div v-if="loadingInventory" class="p-12 flex flex-col justify-center items-center">
            <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p class="text-xs text-gray-400">Loading tracking index...</p>
          </div>

          <div v-else-if="inventoryList.length === 0" class="p-12 text-center text-gray-500">
            <p class="font-bold">No registered items inside database.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50/70">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Item Code</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Hardware Identifier</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Room</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Condition Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr v-for="item in inventoryList" :key="item.id" class="hover:bg-gray-50/60 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-900">{{ item.item_code }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{{ item.item_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{{ item.category }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {{ item.location }} <span class="text-gray-400 font-normal">— {{ item.room_number }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ item.quantity }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="'px-2 py-0.5 text-xs font-bold rounded-md ' + getConditionClass(item.condition_status)">
                      {{ item.condition_status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'report'" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div class="mb-5">
            <h2 class="text-lg font-black text-gray-900 tracking-tight">Create Incident File</h2>
            <p class="text-xs text-gray-400 mt-0.5">Please provide specific parameters below regarding infrastructure defaults.</p>
          </div>
          
          <form @submit.prevent="submitReport" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Facility Category *</label>
              <select v-model="newReport.facility_type" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all">
                <option value="">Select Type</option>
                <option value="furniture">Furniture (Chair, Desk, Table)</option>
                <option value="electrical">Electrical (Fan, Light, Outlet)</option>
                <option value="plumbing">Plumbing (Sink, Pipe, Faucet)</option>
                <option value="electronics">Electronics (Projector, Computer)</option>
                <option value="structural">Structural (Wall, Ceiling, Floor)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Asset Target Name *</label>
              <input v-model="newReport.item_name" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g., Damaged Office Swivel Chair">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Structural Fault Description</label>
              <textarea v-model="newReport.item_description" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" placeholder="Describe components configuration errors or breakage context..."></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Building/Zone *</label>
                <input v-model="newReport.location" type="text" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g., Annex Wing Building">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Room Base ID</label>
                <input v-model="newReport.room_number" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" placeholder="e.g., Laboratory 304">
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Priority Metric *</label>
              <select v-model="newReport.priority" required class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all">
                <option value="low">Low - Operable / Delayed correction</option>
                <option value="medium">Medium - Needs correction window</option>
                <option value="high">High - Halting internal processing</option>
                <option value="urgent">Urgent - Life Safety / Immediate dispatch</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Administrative Notes</label>
              <textarea v-model="newReport.notes" rows="2" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" placeholder="Add custom diagnostic clues if any..."></textarea>
            </div>

            <button type="submit" :disabled="submitting" class="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-600/10">
              {{ submitting ? 'Transmitting Data File...' : 'Commit Operational Log' }}
            </button>
          </form>
        </div>
      </div>

      <div v-if="showUpdateModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all animate-fade-in">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-100 shadow-2xl">
          <div class="mb-4">
            <h3 class="text-base font-black text-gray-900 tracking-tight">Adjust Report Logs: #{{ selectedReport?.report_number }}</h3>
            <p class="text-xs text-gray-400">Modify operational constraints for deployment targets.</p>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Process Status State</label>
              <select v-model="updateForm.status" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500">
                <option value="reported">Reported</option>
                <option value="in_progress">In Progress</option>
                <option value="fixed">Fixed State</option>
                <option value="cannot_fix">Cannot Fix / Deprecated</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Urgency Level Priority</label>
              <select v-model="updateForm.priority" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Financial Cost Estimate ($)</label>
              <input v-model="updateForm.cost_estimate" type="number" step="0.01" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Resolution Diagnostic Notes</label>
              <textarea v-model="updateForm.notes" rows="2" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500"></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button @click="showUpdateModal = false" class="px-4 py-2 border border-gray-200 font-bold text-xs text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                Cancel
              </button>
              <button @click="updateReport" :disabled="updating" class="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                {{ updating ? 'Syncing...' : 'Apply Overrides' }}
              </button>
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
  name: 'FacilityView',
  components: { AppLayout },
  data() {
    return {
      activeTab: 'reports',
      reportsList: [] as any[],
      inventoryList: [] as any[],
      statsData: {} as any,
      loading: false,
      loadingInventory: false,
      submitting: false,
      updating: false,
      showUpdateModal: false,
      selectedReport: null as any,
      filterStatus: '',
      filterPriority: '',
      filterType: '',
      newReport: {
        facility_type: '',
        item_name: '',
        item_description: '',
        location: '',
        room_number: '',
        priority: 'medium',
        notes: ''
      },
      updateForm: {
        status: '',
        priority: '',
        cost_estimate: '',
        notes: ''
      }
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'inventory' && this.inventoryList.length === 0) {
        this.loadInventory()
      }
    }
  },
  methods: {
    formatDate(date: string) {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    },
    formatStatus(status: string) {
      if (!status) return ''
      return status.replace(/_/g, ' ')
    },
    getPriorityAccentColor(priority: string) {
      switch (priority) {
        case 'low': return 'bg-slate-400';
        case 'medium': return 'bg-amber-400';
        case 'high': return 'bg-orange-500';
        case 'urgent': return 'bg-red-500';
        default: return 'bg-gray-300';
      }
    },
    getPriorityClass(priority: string) {
      const classes: any = {
        low: 'bg-slate-50 text-slate-600 border border-slate-100',
        medium: 'bg-amber-50 text-amber-700 border border-amber-100',
        high: 'bg-orange-50 text-orange-700 border border-orange-100',
        urgent: 'bg-red-50 text-red-700 border border-red-100'
      }
      return classes[priority] || ''
    },
    getStatusClass(status: string) {
      const classes: any = {
        reported: 'bg-amber-50 text-amber-700 border border-amber-100',
        in_progress: 'bg-blue-50 text-blue-700 border border-blue-100',
        fixed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        cannot_fix: 'bg-red-50 text-red-700 border border-red-100',
        cancelled: 'bg-slate-50 text-slate-500 border border-slate-100'
      }
      return classes[status] || ''
    },
    getConditionClass(condition: string) {
      const classes: any = {
        good: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        fair: 'bg-amber-50 text-amber-700 border border-amber-100',
        poor: 'bg-orange-50 text-orange-700 border border-orange-100',
        broken: 'bg-red-50 text-red-700 border border-red-100'
      }
      return classes[condition] || ''
    },
    async loadReports() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams()
        if (this.filterStatus) params.append('status', this.filterStatus)
        if (this.filterPriority) params.append('priority', this.filterPriority)
        if (this.filterType) params.append('facility_type', this.filterType)
        
        const response = await fetch(`http://localhost:8000/api/facility/get-reports?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        if (data.success) {
          this.reportsList = data.data.reports
          this.statsData = data.data.statistics
        }
      } catch (error) {
        console.error('Error loading reports:', error)
      } compression: {
        this.loading = false
      }
    },
    async loadInventory() {
      this.loadingInventory = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8000/api/facility/get-inventory', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        if (data.success) {
          this.inventoryList = data.data
        }
      } catch (error) {
        console.error('Error loading inventory:', error)
      } finally {
        this.loadingInventory = false
      }
    },
    async submitReport() {
      this.submitting = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8000/api/facility/create-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.newReport)
        })
        const data = await response.json()
        if (data.success) {
          this.newReport = {
            facility_type: '',
            item_name: '',
            item_description: '',
            location: '',
            room_number: '',
            priority: 'medium',
            notes: ''
          }
          this.activeTab = 'reports'
          this.loadReports()
        }
      } catch (error) {
        console.error('Failed to submit report parameters:', error)
      } finally {
        this.submitting = false
      }
    },
    openUpdateModal(report: any) {
      this.selectedReport = report
      this.updateForm = {
        status: report.status,
        priority: report.priority,
        cost_estimate: report.cost_estimate || '',
        notes: ''
      }
      this.showUpdateModal = true
    },
    async updateReport() {
      if (!this.selectedReport) return
      this.updating = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:8000/api/facility/update-report', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            report_id: this.selectedReport.id,
            ...this.updateForm
          })
        })
        const data = await response.json()
        if (data.success) {
          this.showUpdateModal = false
          this.loadReports()
        }
      } catch (error) {
        console.error('Failed updating system resource references:', error)
      } finally {
        this.updating = false
      }
    }
  },
  mounted() {
    this.loadReports()
  }
})
</script>

```