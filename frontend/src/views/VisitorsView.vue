<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Visitor Management</h1>
          <p class="mt-1 text-sm text-gray-500">Track and manage visitor logs</p>
        </div>
        <button
          @click="showCheckInModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg class="h-5 w-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Check-in Visitor
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-green-100 rounded-lg p-3">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Currently In</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeVisitors }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-blue-100 rounded-lg p-3">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today's Visitors</p>
              <p class="text-2xl font-semibold text-gray-900">{{ visitors.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="bg-purple-100 rounded-lg p-3">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Checked Out</p>
              <p class="text-2xl font-semibold text-gray-900">{{ checkedOutVisitors }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex flex-wrap gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              v-model="dateFrom"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="loadVisitors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              v-model="dateTo"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="loadVisitors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="filterStatus"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="loadVisitors"
            >
              <option value="">All</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Visitors Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <LoadingSpinner v-if="isLoading" :full-page="false" message="Loading visitors..." />
        
        <div v-else-if="visitors.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">No visitors found</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge #</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Person to Visit</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="visitor in visitors" :key="visitor.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ visitor.badge_number }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ visitor.visitor_name }}</div>
                  <div class="text-xs text-gray-500">{{ visitor.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ visitor.contact_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ visitor.person_to_visit }}</div>
                  <div class="text-xs text-gray-500">{{ visitor.department }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ visitor.purpose_of_visit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(visitor.check_in_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ visitor.check_out_time ? formatDateTime(visitor.check_out_time) : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="visitor.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    v-if="visitor.status === 'checked_in'"
                    @click="checkOutVisitor(visitor.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Check Out
                  </button>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Check-in Modal -->
      <div v-if="showCheckInModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showCheckInModal = false"></div>
          <div class="relative bg-white rounded-lg max-w-lg w-full p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Visitor Check-in</h3>
            
            <form @submit.prevent="checkInVisitor" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Visitor Name *</label>
                <input
                  v-model="newVisitor.visitor_name"
                  type="text"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    v-model="newVisitor.contact_number"
                    type="text"
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    v-model="newVisitor.email"
                    type="email"
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Person to Visit *</label>
                <input
                  v-model="newVisitor.person_to_visit"
                  type="text"
                  required
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Department</label>
                <input
                  v-model="newVisitor.department"
                  type="text"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Purpose of Visit *</label>
                <textarea
                  v-model="newVisitor.purpose_of_visit"
                  required
                  rows="3"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">ID Proof Type</label>
                <select
                  v-model="newVisitor.id_proof_type"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select ID Type</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID</option>
                  <option value="Company ID">Company ID</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">ID Proof Number</label>
                <input
                  v-model="newVisitor.id_proof_number"
                  type="text"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Vehicle Number</label>
                <input
                  v-model="newVisitor.vehicle_number"
                  type="text"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  v-model="newVisitor.notes"
                  rows="2"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="showCheckInModal = false"
                  class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isCheckingIn"
                  class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ isCheckingIn ? 'Checking in...' : 'Check In' }}
                </button>
              </div>
            </form>
          </div>
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
  return format(new Date(dateTime), 'MMM d, yyyy h:mm a');
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