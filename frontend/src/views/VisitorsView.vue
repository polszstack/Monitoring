<template>
  <AppLayout>
    <div class="min-h-screen bg-gray-50/50 py-4 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">Visitor Management</h1>
          <p class="mt-1 text-sm text-gray-500">Track, authorize, and manage physical campus visitor logs</p>
        </div>
        <div>
          <button
            @click="showCheckInModal = true"
            class="w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Check-in Visitor
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600 text-xl">🟢</div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Currently Inside</p>
              <p class="text-2xl font-black text-gray-900 mt-0.5">{{ activeVisitors }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-50 rounded-xl text-blue-600 text-xl">📅</div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Total Logs</p>
              <p class="text-2xl font-black text-gray-900 mt-0.5">{{ visitors.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-50 rounded-xl text-purple-600 text-xl">🏁</div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Checked Out</p>
              <p class="text-2xl font-black text-gray-900 mt-0.5">{{ checkedOutVisitors }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-2">⚙️ Filter Logs:</div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 uppercase mb-1">Date From</label>
            <input
              v-model="dateFrom"
              type="date"
              class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
              @change="loadVisitors"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 uppercase mb-1">Date To</label>
            <input
              v-model="dateTo"
              type="date"
              class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
              @change="loadVisitors"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 uppercase mb-1">Status State</label>
            <select
              v-model="filterStatus"
              class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
              @change="loadVisitors"
            >
              <option value="">All Statuses</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        <LoadingSpinner v-if="isLoading" :full-page="false" message="Syncing visitor logs..." />
        
        <div v-else-if="visitors.length === 0" class="p-16 text-center max-w-sm mx-auto text-gray-500">
          <div class="text-4xl mb-2">👥</div>
          <p class="font-bold text-gray-900">No logs found matching requirements</p>
          <p class="text-xs text-gray-400 mt-1">Adjust your date filter sequence configurations.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50/70">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Badge Token</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Visitor Name</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Contact No.</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Host Destination</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Purpose of Visit</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Checked In</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Checked Out</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status Badge</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="visitor in visitors" :key="visitor.id" class="hover:bg-gray-50/60 transition-colors relative">
                <td class="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-blue-600 relative">
                  <div class="absolute left-0 top-0 bottom-0 w-1" :class="visitor.status === 'checked_in' ? 'bg-emerald-500' : 'bg-slate-300'"></div>
                  {{ visitor.badge_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">{{ visitor.visitor_name }}</div>
                  <div class="text-xs text-gray-400 font-medium font-mono mt-0.5">{{ visitor.email || 'no-email@entry.log' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                  {{ visitor.contact_number || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-800">{{ visitor.person_to_visit }}</div>
                  <div class="text-xs text-slate-400 font-medium mt-0.5">{{ visitor.department || 'General' }}</div>
                </td>
                <td class="px-6 py-4 max-w-xs truncate text-sm text-gray-500 font-medium">
                  {{ visitor.purpose_of_visit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                  {{ formatDateTime(visitor.check_in_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                  {{ visitor.check_out_time ? formatDateTime(visitor.check_out_time) : '—' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="visitor.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <button
                    v-if="visitor.status === 'checked_in'"
                    @click="checkOutVisitor(visitor.id)"
                    class="px-3 py-1 bg-gray-50 hover:bg-red-50 text-red-600 border border-gray-100 hover:border-red-100 shadow-sm rounded-lg text-xs font-bold transition-all"
                  >
                    Check Out
                  </button>
                  <span v-else class="text-xs font-bold text-gray-300">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showCheckInModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
        <div class="bg-white rounded-2xl p-6 max-w-xl w-full mx-4 border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto relative">
          <div class="mb-5">
            <h3 class="text-lg font-black text-gray-900 tracking-tight">Visitor Check-in</h3>
            <p class="text-xs text-gray-400 mt-0.5">Initialize identity checks and issue standard visitor badges.</p>
          </div>
          
          <form @submit.prevent="checkInVisitor" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Visitor Full Name *</label>
              <input
                v-model="newVisitor.visitor_name"
                type="text"
                required
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="e.g., John Doe"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                <input
                  v-model="newVisitor.contact_number"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="e.g., 09123456789"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input
                  v-model="newVisitor.email"
                  type="email"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Person to Visit *</label>
                <input
                  v-model="newVisitor.person_to_visit"
                  type="text"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Host Employee Name"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Department Target</label>
                <input
                  v-model="newVisitor.department"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="e.g., HR Department"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Purpose of Visit *</label>
              <textarea
                v-model="newVisitor.purpose_of_visit"
                required
                rows="2"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                placeholder="State standard justification..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">ID Proof Type</label>
                <select
                  v-model="newVisitor.id_proof_type"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                >
                  <option value="">Select ID Type</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID</option>
                  <option value="Company ID">Company ID</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">ID Document Serial No.</label>
                <input
                  v-model="newVisitor.id_proof_number"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="ID Sequence Reference"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Vehicle Plate Number</label>
                <input
                  v-model="newVisitor.vehicle_number"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="e.g., ABC 1234"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Additional Security Notes</label>
                <input
                  v-model="newVisitor.notes"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Luggage details, etc."
                />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <button
                type="button"
                @click="showCheckInModal = false"
                class="px-4 py-2 border border-gray-200 font-bold text-xs text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isCheckingIn"
                class="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {{ isCheckingIn ? 'Syncing...' : 'Authorize Check-In' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import apiService from '@/services/api';
import { useNotification } from '@/composables/useNotification';
import type { VisitorLog } from '@/types';

const { success, error: notifyError } = useNotification();

const dateFrom = ref(format(new Date(), 'yyyy-MM-dd'));
const dateTo = ref(format(new Date(), 'yyyy-MM-dd'));
const filterStatus = ref('');
const isLoading = ref(false);
const isCheckingIn = ref(false);
const showCheckInModal = ref(false);
const visitors = ref<VisitorLog[]>([]);

const newVisitor = ref({
  visitor_name: '',
  contact_number: '',
  email: '',
  purpose_of_visit: '',
  person_to_visit: '',
  department: '',
  id_proof_type: '',
  id_proof_number: '',
  vehicle_number: '',
  notes: '',
});

const activeVisitors = computed(() => {
  return visitors.value.filter(v => v.status === 'checked_in').length;
});

const checkedOutVisitors = computed(() => {
  return visitors.value.filter(v => v.status === 'checked_out').length;
});

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return '—';
  try {
    return format(new Date(dateTime), 'MMM d, yyyy h:mm a');
  } catch (e) {
    return dateTime;
  }
};

const loadVisitors = async () => {
  isLoading.value = true;
  try {
    const response = await apiService.getVisitors({
      date_from: dateFrom.value,
      date_to: dateTo.value,
      status: filterStatus.value || undefined,
    });

    if (response.success && response.data) {
      visitors.value = response.data;
    }
  } catch (err: any) {
    notifyError('Failed to load visitors');
  } finally {
    isLoading.value = false;
  }
};

const checkInVisitor = async () => {
  isCheckingIn.value = true;
  try {
    const response = await apiService.checkInVisitor(newVisitor.value);
    if (response.success) {
      success(`Visitor checked in successfully! Badge: ${response.data.badge_number}`);
      showCheckInModal.value = false;
      resetForm();
      await loadVisitors();
    } else {
      notifyError(response.message);
    }
  } catch (err: any) {
    notifyError('Failed to check in visitor');
  } finally {
    isCheckingIn.value = false;
  }
};

const checkOutVisitor = async (visitorId: number) => {
  try {
    const response = await apiService.checkOutVisitor(visitorId);
    if (response.success) {
      success('Visitor checked out successfully');
      await loadVisitors();
    } else {
      notifyError(response.message);
    }
  } catch (err: any) {
    notifyError('Failed to check out visitor');
  }
};

const resetForm = () => {
  newVisitor.value = {
    visitor_name: '',
    contact_number: '',
    email: '',
    purpose_of_visit: '',
    person_to_visit: '',
    department: '',
    id_proof_type: '',
    id_proof_number: '',
    vehicle_number: '',
    notes: '',
  };
};

onMounted(() => {
  loadVisitors();
});
</script>