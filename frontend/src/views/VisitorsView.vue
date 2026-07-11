 <template>
  <div class="space-y-8 animate-fade-in pb-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Visitor Logs</h2>
        <p class="mt-2 text-sm text-gray-500">Track and manage securely real-time visitor check-ins and check-outs.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <button 
          @click="exportPDF" 
          :disabled="activeVisitors.length === 0"
          class="text-xs uppercase tracking-wider font-black bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] w-full sm:w-auto text-center flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export PDF
        </button>
        <button 
          @click="showCheckInModal = true" 
          class="text-xs uppercase tracking-wider font-black bg-gray-900 text-white hover:bg-gray-800 px-5 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98] w-full sm:w-auto text-center"
        >
          + New Visitor Check-In
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="card p-5 bg-white border border-gray-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today's Visitors</p>
          <p class="text-3xl font-black text-gray-900 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ todayVisitors }}
          </p>
        </div>
        <div class="p-3 bg-gray-50 text-gray-400 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-green-50/50 border border-green-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-green-600 uppercase tracking-widest">Currently Inside</p>
          <p class="text-3xl font-black text-green-700 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ checkedInCount }}
          </p>
        </div>
        <div class="p-3 bg-green-100 text-green-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-blue-50/50 border border-blue-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-blue-600 uppercase tracking-widest">Checked Out</p>
          <p class="text-3xl font-black text-blue-700 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ checkedOutCount }}
          </p>
        </div>
        <div class="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-gray-50/50 border border-gray-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-gray-600 uppercase tracking-widest">Total Logs</p>
          <p class="text-3xl font-black text-gray-700 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ totalVisitors }}
          </p>
        </div>
        <div class="p-3 bg-gray-200/60 text-gray-500 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
        </div>
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
            placeholder="Search by name, purpose, department..."
          >
        </div>
        <select 
          v-model="statusFilter" 
          class="bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm cursor-pointer w-full sm:w-48"
        >
          <option value="">All Status</option>
          <option value="checked_in">🟢 Currently Inside</option>
          <option value="checked_out">⚫ Checked Out</option>
        </select>
        <input 
          v-model="dateFilter" 
          type="date" 
          class="bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm cursor-pointer w-full sm:w-48"
        >
      </div>
      <div class="flex justify-end mt-3">
        <button 
          @click="showArchived = !showArchived"
          class="text-[11px] font-black uppercase tracking-wider text-amber-700 hover:text-amber-800 transition-colors"
        >
          📦 Archived Visitors ({{ archivedVisitors.length }})
        </button>
      </div>
    </div>

    <div v-if="showArchived" class="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 space-y-3">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-black text-amber-700">Archived Visitor History</h3>
          <p class="text-xs text-amber-600">Completed visits are stored here so the main queue stays focused on active entries.</p>
        </div>
        <button @click="showArchived = false" class="text-[11px] font-black uppercase tracking-wider text-amber-700 hover:text-amber-800">Hide</button>
      </div>

      <div v-if="archivedVisitors.length === 0" class="text-sm text-amber-700">No archived visitors yet.</div>
      <div v-else class="space-y-2">
        <div v-for="visitor in archivedVisitors" :key="visitor.id" class="rounded-xl border border-amber-200 bg-white/80 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div class="font-extrabold text-gray-900">{{ visitor.visitor_name }}</div>
            <div class="text-xs text-gray-500">{{ visitor.purpose_of_visit }}</div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-xs font-semibold text-gray-500">
              Checked out: {{ formatDateTime(visitor.check_out_time || visitor.check_in_time) }}
            </div>
            <button 
              @click="viewDetails(visitor)" 
              class="text-[11px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
            >
              👁️ View
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100" id="visitor-table">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Visitor</th>
              <th class="px-5 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Purpose</th>
              <th class="px-5 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Visiting</th>
              <th class="px-5 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Proof</th>
              <th class="px-5 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Check In</th>
              <th class="px-5 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Check Out</th>
              <th class="px-5 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-5 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50 text-sm">
            <tr v-if="loading" class="text-center">
              <td colspan="8" class="px-6 py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent inline-block"></div>
                <p class="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing logs...</p>
              </td>
            </tr>
            <tr v-else-if="filteredVisitors.length === 0" class="text-center">
              <td colspan="8" class="px-6 py-12 text-gray-400 font-medium">
                <p class="text-gray-900 font-bold mb-0.5">No visitors found</p>
                <p class="text-xs">Adjust filters or register an active check-in event node.</p>
              </td>
            </tr>
            <tr 
              v-for="visitor in filteredVisitors" 
              :key="visitor.id" 
              class="hover:bg-gray-50/60 transition-colors duration-150"
              :class="visitor.status === 'checked_in' ? 'bg-green-50/20 hover:bg-green-50/40' : ''"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-2sm">
                      {{ visitor.visitor_name?.charAt(0) || 'V' }}
                    </div>
                  </div>
                  <div class="ml-3.5 min-w-0">
                    <div class="font-extrabold text-gray-900 truncate">{{ visitor.visitor_name }}</div>
                    <div class="text-xs font-mono font-bold text-gray-400 mt-0.5">{{ visitor.contact_number || 'No contact record' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="text-gray-600 font-medium max-w-xs truncate" :title="visitor.purpose_of_visit">
                  {{ visitor.purpose_of_visit }}
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="text-gray-900 font-bold">{{ visitor.person_to_visit || '-' }}</div>
                <div class="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{{ visitor.department || '' }}</div>
              </td>
              <td class="px-5 py-3.5">
                <div v-if="visitor.id_proof_type" class="space-y-0.5">
                  <span class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-purple-50 text-purple-700 border border-purple-100 tracking-tight uppercase">
                    {{ visitor.id_proof_type }}
                  </span>
                  <div class="text-xs font-mono font-bold text-gray-500">{{ visitor.id_proof_number }}</div>
                </div>
                <span v-else class="text-xs text-gray-400 font-medium italic">Not provided</span>
              </td>
              <td class="px-5 py-3.5 font-mono text-xs font-bold text-gray-700">
                {{ formatDateTime(visitor.check_in_time) }}
              </td>
              <td class="px-5 py-3.5 font-mono text-xs font-bold">
                <span v-if="visitor.check_out_time" class="text-gray-700">
                  {{ formatDateTime(visitor.check_out_time) }}
                </span>
                <span v-else class="text-gray-400 font-normal italic">-</span>
              </td>
              <td class="px-5 py-3.5">
                <span 
                  :class="visitor.status === 'checked_in' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/60' : 'bg-gray-100 text-gray-600 border border-gray-200/40'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-2sm"
                >
                  {{ visitor.status === 'checked_in' ? 'Inside' : 'Left' }}
                </span>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <button 
                    v-if="visitor.status === 'checked_in'"
                    @click="checkOut(visitor.id)" 
                    class="text-[11px] font-black uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors"
                  >
                    🚨 Out
                  </button>
                  <button 
                    v-if="visitor.status === 'checked_out'"
                    @click="archiveVisitor(visitor.id)"
                    class="text-[11px] font-black uppercase tracking-wider text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    📦 Archive
                  </button>
                  <button 
                    @click="viewDetails(visitor)" 
                    class="text-[11px] font-black uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    👁️ View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Check-In Modal -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showCheckInModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-sm" @click="showCheckInModal = false"></div>
        <div class="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 animate-scale-up z-10 max-h-[85vh] overflow-y-auto space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-gray-50">
            <h3 class="text-base font-black text-gray-900 tracking-tight">🔏 Visitor Check-In Registry</h3>
            <button @click="showCheckInModal = false" class="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 text-xl transition-all">&times;</button>
          </div>
          
          <form @submit.prevent="checkInVisitor" class="space-y-5">
            <div class="bg-gray-50/40 p-4 rounded-xl border border-gray-100 space-y-4">
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personal Information</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                  <input v-model="newVisitor.visitor_name" type="text" required class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="John Smith">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Contact Number</label>
                  <input v-model="newVisitor.contact_number" type="text" class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="+63 912 345 6789">
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
                <input v-model="newVisitor.email" type="email" class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="john@example.com">
              </div>
            </div>

            <div class="bg-gray-50/40 p-4 rounded-xl border border-gray-100 space-y-4">
              <h4 class="text-[10px] font-black text-purple-600 uppercase tracking-widest">🪪 Identity Verification Matrix *</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">ID Type *</label>
                  <select v-model="newVisitor.id_proof_type" required class="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm cursor-pointer">
                    <option value="">Select ID Type</option>
                    <option value="National ID">National ID</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="Passport">Passport</option>
                    <option value="School ID">School ID</option>
                    <option value="Company ID">Company ID</option>
                    <option value="SSS/UMID">SSS/UMID</option>
                    <option value="PRC ID">PRC ID</option>
                    <option value="Voter's ID">Voter's ID</option>
                    <option value="Postal ID">Postal ID</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">ID Number *</label>
                  <input v-model="newVisitor.id_proof_number" type="text" required class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="ID-12345">
                </div>
              </div>
            </div>

            <div class="bg-gray-50/40 p-4 rounded-xl border border-gray-100 space-y-4">
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visit Details Hub</h4>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Purpose of Visit *</label>
                <textarea v-model="newVisitor.purpose_of_visit" rows="2" required class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="e.g., Meeting with teacher, Picking up documents, Enrollment inquiry..."></textarea>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Person to Visit *</label>
                  <input v-model="newVisitor.person_to_visit" type="text" required class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="e.g., Jane Smith">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Department</label>
                  <select v-model="newVisitor.department" class="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm cursor-pointer">
                    <option value="">Select Department</option>
                    <option value="Administration">Administration</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Filipino">Filipino</option>
                    <option value="MAPEH">MAPEH</option>
                    <option value="Guidance">Guidance Office</option>
                    <option value="Registrar">Registrar</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Library">Library</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="bg-gray-50/40 p-4 rounded-xl border border-gray-100 space-y-4">
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Additional Auxiliary Data</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Vehicle Number</label>
                  <input v-model="newVisitor.vehicle_number" type="text" class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="e.g., ABC 1234">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Badge Number</label>
                  <input v-model="newVisitor.badge_number" type="text" class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="Visitor badge #">
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Notes</label>
                <textarea v-model="newVisitor.notes" rows="2" class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-2sm" placeholder="Any additional configuration notes..."></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-gray-50">
              <button type="button" @click="showCheckInModal = false" class="text-xs uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl transition-all">Cancel</button>
              <button type="submit" class="text-xs uppercase tracking-wider font-black bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all">Check In Visitor</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Details Modal -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showDetailsModal && selectedVisitor" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-sm" @click="showDetailsModal = false"></div>
        <div class="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-scale-up z-10 space-y-5 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-gray-50">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-black text-gray-900 tracking-tight">📋 Visitor Profile</h3>
              <span v-if="selectedVisitor.is_archived" class="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">Archived</span>
            </div>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 text-xl transition-all">&times;</button>
          </div>
          
          <div class="space-y-5">
            <div class="flex items-center space-x-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <div class="h-14 w-14 rounded-xl bg-gray-900 text-white flex items-center justify-center font-extrabold text-xl shadow-sm shrink-0">
                <span>{{ selectedVisitor.visitor_name?.charAt(0) }}</span>
              </div>
              <div class="min-w-0">
                <h4 class="text-lg font-extrabold text-gray-900 tracking-tight truncate">{{ selectedVisitor.visitor_name }}</h4>
                <p 
                  :class="selectedVisitor.status === 'checked_in' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-gray-500 bg-gray-100 border-gray-200/60'" 
                  class="text-[10px] font-black uppercase tracking-wider inline-flex px-2 py-0.5 rounded-md mt-1 border shadow-2sm"
                >
                  {{ selectedVisitor.status === 'checked_in' ? 'Inside Hub' : 'Checked Out' }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold border-t border-gray-50 pt-4">
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact</p>
                <p class="font-bold text-gray-900 font-mono text-sm">{{ selectedVisitor.contact_number || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                <p class="font-bold text-gray-900 text-sm truncate">{{ selectedVisitor.email || 'N/A' }}</p>
              </div>
            </div>

            <div class="border-t border-gray-50 pt-4">
              <p class="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">🪪 ID Identification Proof</p>
              <p class="font-bold text-gray-900 text-sm">
                {{ selectedVisitor.id_proof_type || 'N/A' }} <span v-if="selectedVisitor.id_proof_type">—</span> 
                <span class="font-mono">{{ selectedVisitor.id_proof_number || 'N/A' }}</span>
              </p>
            </div>

            <div class="border-t border-gray-50 pt-4">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">📌 Declared Purpose</p>
              <p class="font-medium text-gray-700 text-sm bg-gray-50/60 p-3 rounded-xl border border-gray-100/60 leading-relaxed">{{ selectedVisitor.purpose_of_visit || 'N/A' }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs font-semibold border-t border-gray-50 pt-4">
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Visiting Target</p>
                <p class="font-bold text-gray-900 text-sm">{{ selectedVisitor.person_to_visit || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Department Hub</p>
                <p class="font-bold text-gray-900 text-sm capitalize">{{ selectedVisitor.department || 'N/A' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs font-semibold border-t border-gray-50 pt-4">
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Check In Stamp</p>
                <p class="font-bold text-gray-700 font-mono">{{ formatDateTime(selectedVisitor.check_in_time) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Check Out Stamp</p>
                <p class="font-bold font-mono" :class="selectedVisitor.check_out_time ? 'text-gray-700' : 'text-emerald-600 font-bold italic text-[11px] uppercase tracking-wider'">
                  {{ selectedVisitor.check_out_time ? formatDateTime(selectedVisitor.check_out_time) : 'Still Active Inside' }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs font-semibold border-t border-gray-50 pt-4" v-if="selectedVisitor.vehicle_number || selectedVisitor.badge_number">
              <div v-if="selectedVisitor.vehicle_number">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">🚗 Vehicle Matrix</p>
                <p class="font-bold text-gray-900 font-mono">{{ selectedVisitor.vehicle_number }}</p>
              </div>
              <div v-if="selectedVisitor.badge_number">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">🏷️ Badge Code</p>
                <p class="font-bold text-gray-900 font-mono">{{ selectedVisitor.badge_number }}</p>
              </div>
            </div>

            <div v-if="selectedVisitor.notes" class="border-t border-gray-50 pt-4 text-xs font-semibold">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">📝 Log Notes</p>
              <p class="font-medium text-gray-600 leading-relaxed">{{ selectedVisitor.notes }}</p>
            </div>

            <div v-if="selectedVisitor.status === 'checked_in'" class="pt-4 border-t border-gray-50">
              <button 
                @click="checkOutFromDetails" 
                class="w-full text-xs uppercase tracking-wider font-black bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl shadow-sm transition-all active:scale-[0.99]"
              >
                🚨 Check Out Visitor
              </button>
            </div>

            <div v-if="selectedVisitor.status === 'checked_out' && !selectedVisitor.is_archived" class="pt-2">
              <button 
                @click="archiveVisitorFromDetails" 
                class="w-full text-xs uppercase tracking-wider font-black bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl shadow-sm transition-all active:scale-[0.99]"
              >
                📦 Archive Visitor
              </button>
            </div>
          </div>
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
import type { VisitorLog } from '@/types'

const { get, post, put, loading } = useApi()

const visitors = ref<VisitorLog[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const showCheckInModal = ref(false)
const showDetailsModal = ref(false)
const showArchived = ref(false)
const selectedVisitor = ref<VisitorLog | null>(null)

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
  badge_number: '',
  notes: ''
})

const activeVisitors = computed(() => visitors.value.filter(v => !v.is_archived))
const archivedVisitors = computed(() => visitors.value.filter(v => !!v.is_archived))

const todayVisitors = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return activeVisitors.value.filter(v => v.check_in_time?.startsWith(today)).length
})

const checkedInCount = computed(() => 
  activeVisitors.value.filter(v => v.status === 'checked_in').length
)

const checkedOutCount = computed(() => 
  activeVisitors.value.filter(v => v.status === 'checked_out').length
)

const totalVisitors = computed(() => activeVisitors.value.length)

const filteredVisitors = computed(() => {
  return activeVisitors.value.filter(visitor => {
    const matchesSearch = !searchQuery.value || 
      visitor.visitor_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      visitor.purpose_of_visit?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      visitor.person_to_visit?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      visitor.department?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || visitor.status === statusFilter.value
    const matchesDate = !dateFilter.value || 
      visitor.check_in_time?.startsWith(dateFilter.value)
    
    return matchesSearch && matchesStatus && matchesDate
  })
})

const fetchVisitors = async () => {
  try {
    visitors.value = await get<VisitorLog[]>('/visitors?include_archived=true')
  } catch (err) {
    console.error('Failed to fetch visitors:', err)
  }
}

const checkInVisitor = async () => {
  try {
    await post('/visitors/check-in', newVisitor.value)
    showCheckInModal.value = false
    newVisitor.value = {
      visitor_name: '', contact_number: '', email: '',
      purpose_of_visit: '', person_to_visit: '', department: '',
      id_proof_type: '', id_proof_number: '',
      vehicle_number: '', badge_number: '', notes: ''
    }
    await fetchVisitors()
  } catch (err) {
    console.error('Failed to check in visitor:', err)
  }
}

const checkOut = async (id: number) => {
  if (confirm('Check out this visitor?')) {
    try {
      await put(`/visitors/${id}/check-out`)
      await fetchVisitors()
    } catch (err) {
      console.error('Failed to check out visitor:', err)
      await fetchVisitors()
    }
  }
}

const checkOutFromDetails = async () => {
  if (selectedVisitor.value) {
    await checkOut(selectedVisitor.value.id)
    showDetailsModal.value = false
  }
}

const archiveVisitor = async (id: number) => {
  const target = visitors.value.find(visitor => visitor.id === id)
  if (!target || target.is_archived) return

  if (target.status !== 'checked_out') {
    alert('Please check out the visitor before archiving.')
    return
  }

  if (!confirm('Archive this completed visitor log to keep the main list tidy?')) return

  try {
    await put(`/visitors/${id}/archive`)
    await fetchVisitors()
  } catch (err) {
    console.error('Failed to archive visitor:', err)
    await fetchVisitors()
  }
}

const archiveVisitorFromDetails = async () => {
  if (selectedVisitor.value) {
    await archiveVisitor(selectedVisitor.value.id)
    showDetailsModal.value = false
  }
}

const viewDetails = (visitor: VisitorLog) => {
  selectedVisitor.value = visitor
  showDetailsModal.value = true
}

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const exportPDF = () => {
  if (activeVisitors.value.length === 0) return

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text('Visitor Logs Report', pageWidth / 2, 20, { align: 'center' })
  
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
  doc.text(
    `Summary: Total: ${totalVisitors.value} | Today: ${todayVisitors.value} | Inside: ${checkedInCount.value} | Checked Out: ${checkedOutCount.value}`,
    pageWidth / 2,
    36,
    { align: 'center' }
  )

  // Table
  const tableData = filteredVisitors.value.map(visitor => [
    visitor.visitor_name,
    visitor.contact_number || 'N/A',
    visitor.purpose_of_visit || 'N/A',
    visitor.person_to_visit || 'N/A',
    visitor.department || 'N/A',
    visitor.id_proof_type ? `${visitor.id_proof_type} - ${visitor.id_proof_number}` : 'Not provided',
    formatDateTime(visitor.check_in_time),
    visitor.check_out_time ? formatDateTime(visitor.check_out_time) : 'Still Inside',
    visitor.status === 'checked_in' ? 'Inside' : 'Left'
  ])

  autoTable(doc, {
    startY: 42,
    head: [['Visitor', 'Contact', 'Purpose', 'Visiting', 'Dept.', 'ID Proof', 'Check In', 'Check Out', 'Status']],
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
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
      6: { cellWidth: 22 },
      7: { cellWidth: 22 },
      8: { cellWidth: 18 }
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

  doc.save(`Visitor_Logs_${new Date().toISOString().split('T')[0]}.pdf`)
}

onMounted(() => {
  fetchVisitors()
})
</script>