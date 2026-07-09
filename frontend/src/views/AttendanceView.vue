<template>
  <div class="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-gray-200/80 pb-6">
      <div class="max-w-2xl">
        <div class="flex items-center gap-3 mb-2">
          <div :class="showArchived ? 'bg-gray-100 text-gray-600' : 'bg-primary-100 text-primary-700'" class="p-2 rounded-xl">
            <svg v-if="showArchived" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.118l-12.14.936A2.25 2.25 0 014.25 19.2V5.208a2.25 2.25 0 011.987-2.236l.93-.07a7.5 7.5 0 1114.357 5.629l-1.274 5.619z" /></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Room Attendance {{ showArchived ? 'Archive' : 'Matrix' }}
          </h2>
        </div>
        <p class="text-sm text-gray-500 leading-relaxed">
          {{ showArchived ? 'Securely browse historical attendance records and verification logs for the selected date.' : 'Monitor operational facilities and process live teacher attendance checks for scheduled rooms.' }}
        </p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div class="relative flex-1 sm:flex-initial group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <input 
            type="date" 
            v-model="selectedDate"
            class="w-full sm:w-auto bg-white border-0 ring-1 ring-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
            @change="fetchAttendance"
          >
        </div>
        
        <button 
          v-if="!showArchived"
          @click="generateTodayAttendance" 
          class="flex-1 sm:flex-initial text-xs uppercase tracking-wider font-bold bg-gray-900 text-white hover:bg-gray-800 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] ring-1 ring-gray-900"
        >
          Generate Matrix
        </button>
        
        <button 
          @click="downloadPDFReport" 
          :disabled="filteredAttendanceList.length === 0"
          class="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] ring-1 ring-emerald-600"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Export
        </button>

        <button 
          v-if="filteredAttendanceList.length > 0 && !showArchived"
          @click="toggleArchiveAllRecords"
          class="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold bg-white text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] ring-1 ring-gray-200"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
          Archive All
        </button>

        <button 
          @click="showArchived = !showArchived" 
          class="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold bg-white text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] ring-1 ring-gray-200"
        >
          <svg v-if="showArchived" class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
          {{ showArchived ? 'View Active' : 'View Archive' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="bg-white rounded-2xl p-5 ring-1 ring-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow duration-200">
        <div class="space-y-1.5">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Classes</p>
          <p class="text-3xl font-black text-gray-900 tracking-tight">{{ totalClasses }}</p>
        </div>
        <div class="p-3 bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200/50 text-gray-500 rounded-xl shadow-sm">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl p-5 ring-1 ring-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow duration-200">
        <div class="space-y-1.5">
          <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Present</p>
          <p class="text-3xl font-black text-emerald-700 tracking-tight">{{ presentCount }}</p>
        </div>
        <div class="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 ring-1 ring-emerald-200/50 text-emerald-600 rounded-xl shadow-sm">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl p-5 ring-1 ring-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow duration-200">
        <div class="space-y-1.5">
          <p class="text-[10px] font-bold text-red-600 uppercase tracking-widest">Absent</p>
          <p class="text-3xl font-black text-red-700 tracking-tight">{{ absentCount }}</p>
        </div>
        <div class="p-3 bg-gradient-to-br from-red-50 to-red-100 ring-1 ring-red-200/50 text-red-600 rounded-xl shadow-sm">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl p-5 ring-1 ring-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow duration-200">
        <div class="space-y-1.5">
          <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Pending</p>
          <p class="text-3xl font-black text-amber-700 tracking-tight">{{ pendingCount }}</p>
        </div>
        <div class="p-3 bg-gradient-to-br from-amber-50 to-amber-100 ring-1 ring-amber-200/50 text-amber-600 rounded-xl shadow-sm">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-gray-200 shadow-sm">
            <svg v-if="showArchived" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            <svg v-else class="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              {{ showArchived ? 'Archived Matrix' : 'Active Stream Matrix' }}
              <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                Date: {{ selectedDate }}
              </span>
            </h3>
          </div>
        </div>
      </div>

      <div class="relative">
        <div v-if="loading" class="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col justify-center items-center min-h-[300px]">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-primary-600"></div>
          <p class="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Syncing Database...</p>
        </div>
        
        <div v-if="filteredAttendanceList.length === 0 && !loading" class="text-center py-24 animate-fade-in px-6">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100 mb-4">
            <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-900">{{ showArchived ? 'No Archives Found' : 'Matrix is Empty' }}</h3>
          <p class="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            There are no scheduling records found for the selected date. {{ !showArchived ? 'Generate a new matrix to begin tracking.' : 'Try selecting a different date.' }}
          </p>
          <button v-if="!showArchived" @click="generateTodayAttendance" class="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold bg-white text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg shadow-sm ring-1 ring-gray-200 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Generate Default Set
          </button>
        </div>

        <div v-else class="overflow-x-auto min-h-[400px]">
          <table class="min-w-full divide-y divide-gray-200" id="attendance-table-element">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                <th scope="col" class="px-3 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" class="px-3 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Professional</th>
                <th scope="col" class="px-3 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" class="px-3 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Proof</th>
                <th scope="col" class="px-3 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="py-3.5 pl-3 pr-6 class-exclude-pdf text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="att in filteredAttendanceList" :key="att.id" class="hover:bg-gray-50/80 transition-colors group" :class="getRowClass(att.attendance_status)">
                
                <td class="whitespace-nowrap py-4 pl-6 pr-3">
                  <div class="flex items-center gap-2">
                    <div class="h-1.5 w-1.5 rounded-full" :class="att.attendance_status === 'pending' ? 'bg-amber-400' : 'bg-gray-300'"></div>
                    <div>
                      <div class="text-sm font-bold text-gray-900">{{ formatTime(att.start_time) }}</div>
                      <div class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-0.5">{{ formatTime(att.end_time) }}</div>
                    </div>
                  </div>
                </td>

                <td class="whitespace-nowrap px-3 py-4">
                  <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700 ring-1 ring-inset ring-primary-600/20">
                    RM {{ att.room }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-3 py-4">
                  <div class="text-sm font-bold text-gray-900">{{ att.teacher_name }}</div>
                  <div class="text-xs font-mono text-gray-500 mt-0.5">ID: {{ att.employee_id }}</div>
                </td>

                <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700">
                  {{ att.subject }}
                </td>

                <td class="whitespace-nowrap px-3 py-4">
                  <div 
                    v-if="att.verification_photo" 
                    @click="openPhotoModal(att.verification_photo, att.teacher_name)"
                    class="h-10 w-10 rounded-lg overflow-hidden ring-1 ring-gray-200 shadow-sm hover:ring-primary-500 hover:shadow-md cursor-pointer transition-all duration-200"
                    title="View Verification Photo"
                  >
                    <img :src="getPhotoUrl(att.verification_photo)" class="h-full w-full object-cover" alt="Proof" />
                  </div>
                  <span v-else class="text-xs font-medium text-gray-400 italic">No Upload</span>
                </td>

                <td class="whitespace-nowrap px-3 py-4">
                  <span :class="getStatusBadgeClass(att.attendance_status)" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset uppercase tracking-wider">
                    {{ att.attendance_status }}
                  </span>
                  <div v-if="att.remarks" class="mt-1.5 flex items-start gap-1">
                    <svg class="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                    <span class="text-[11px] font-medium text-gray-600 max-w-[120px] truncate" :title="att.remarks">{{ att.remarks }}</span>
                  </div>
                  <div v-if="att.time_marked" class="text-[10px] font-semibold text-gray-400 mt-1">
                    Logged: {{ att.time_marked }}
                  </div>
                </td>

                <td class="whitespace-nowrap py-4 pl-3 pr-6 class-exclude-pdf text-center">
                  <div v-if="!showArchived" class="inline-flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      :id="'photo-upload-' + att.id" 
                      class="hidden" 
                      @change="handlePhotoValidationUpload($event)"
                    />

                    <div class="relative">
                      <select 
                        :value="getSelectionValue(att)"
                        @change="handleSelectionAction($event, att)"
                        class="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-xs font-bold text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:leading-6 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
                      >
                        <option value="pending" disabled>-- Action --</option>
                        <option value="PRESENT">🟢 Present</option>
                        <option value="ABSENT">🔴 Absent</option>
                        <option value="LT">⏳ Late (LT)</option>
                        <option value="NT">🚫 No Teacher (NT)</option>
                        <option value="EB">📉 Early Break (EB)</option>
                        <option value="ED">🚪 Early Dismissal (ED)</option>
                        <option value="OB">💼 Official Biz (OB)</option>
                        <option value="AT">🚌 Acad Tour (AT)</option>
                        <option value="CUSTOM">✍️ Custom Remark</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
                      </div>
                    </div>

                    <button 
                      @click="toggleArchiveRecord(att)" 
                      class="rounded-md bg-white px-2 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-700 shadow-sm transition-all"
                      title="Archive Record"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    </button>
                  </div>
                  
                  <div v-else class="inline-flex items-center justify-center rounded-md bg-gray-50 px-3 py-1.5 ring-1 ring-inset ring-gray-200">
                    <span class="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Locked
                    </span>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showRemarkModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="closeCustomModal"></div>
        <div class="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl ring-1 ring-gray-200/50 z-10">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-bold text-gray-900 tracking-tight">Manual Log Remark</h3>
            <button @click="closeCustomModal" class="text-gray-400 hover:text-gray-500 rounded-lg p-1 hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="mb-6">
            <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Context Description</label>
            <textarea v-model="remarkText" rows="3" class="block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all" placeholder="Enter administrative note..."></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="closeCustomModal" class="text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl ring-1 ring-inset ring-gray-300 transition-all">Cancel</button>
            <button @click="submitCustomTextFlow" class="text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 px-5 py-2.5 rounded-xl shadow-sm transition-all">Proceed to Camera</button>
          </div>
        </div>
      </div>
    </transition>

    <transition
      enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showPhotoModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-md transition-opacity" @click="showPhotoModal = false"></div>
        <div class="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl z-10 ring-1 ring-white/10">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div>
              <h3 class="text-base font-bold text-gray-900">Verification Evidence</h3>
              <p class="text-sm text-gray-500 mt-0.5">Assigned to: <span class="font-semibold text-gray-900">{{ activePhotoTeacher }}</span></p>
            </div>
            <button @click="showPhotoModal = false" class="bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-2 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="p-4 bg-gray-100 flex justify-center items-center min-h-[400px]">
            <img :src="getPhotoUrl(activePhotoPath)" class="max-w-full max-h-[70vh] object-contain rounded-xl shadow-md ring-1 ring-gray-200/50" alt="Preview" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

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
  is_archived?: boolean
}

const { get, post, loading } = useApi()

const attendanceList = ref<DailyAttendance[]>([])
const selectedDate = ref(new Date().toISOString().split('T')[0])
const showArchived = ref(false)

const standardCodes = ['LT', 'NT', 'EB', 'ED', 'OB', 'AT']

const activeStaging = ref<{
  id: number | null
  status: string
  remarks: string
}>({ id: null, status: '', remarks: '' })

const showRemarkModal = ref(false)
const remarkText = ref('')

const showPhotoModal = ref(false)
const activePhotoPath = ref('')
const activePhotoTeacher = ref('')

const BACKEND_URL = 'http://localhost:3000'

const isToday = computed(() => {
  return selectedDate.value === new Date().toISOString().split('T')[0]
})

const filteredAttendanceList = computed(() => {
  return attendanceList.value.filter(a => !!a.is_archived === showArchived.value)
})

const totalClasses = computed(() => filteredAttendanceList.value.length)
const presentCount = computed(() => filteredAttendanceList.value.filter(a => a.attendance_status === 'present').length)
const absentCount = computed(() => filteredAttendanceList.value.filter(a => a.attendance_status === 'absent').length)
const pendingCount = computed(() => filteredAttendanceList.value.filter(a => a.attendance_status === 'pending').length)

const fetchAttendance = async () => {
  try {
    const date = selectedDate.value
    const includeArchived = showArchived.value ? 'true' : 'false'
    attendanceList.value = await get<DailyAttendance[]>(`/attendance/date/${date}?include_archived=${includeArchived}`)
  } catch (err) {
    console.error('Failed to fetch attendance metrics map tracker:', err)
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

const toggleArchiveRecord = async (att: DailyAttendance) => {
  const nextArchivedState = true 
  att.is_archived = nextArchivedState
  
  try {
    await post(`/attendance/${att.id}/archive`, { is_archived: nextArchivedState })
  } catch (err) {
    console.warn('Individual archive action processed locally.', err)
  }
}

const toggleArchiveAllRecords = async () => {
  const targetState = true 
  const targetsToMove = [...filteredAttendanceList.value]
  
  targetsToMove.forEach(att => {
    att.is_archived = targetState
  })

  try {
    await post('/attendance/bulk-archive', {
      date: selectedDate.value,
      is_archived: targetState
    })
  } catch (err) {
    console.warn('Bulk archive navigation shift executed locally.', err)
  }
}

const downloadPDFReport = () => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text('Room Attendance Verification Report', 14, 22)
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Matrix Target Tracked Date: ${selectedDate.value}`, 14, 28)
  doc.text(`View Mode Scope Context: ${showArchived.value ? 'Archived Sheet Matrix Log' : 'Active Registry Log'}`, 14, 34)
  doc.text(`Metrics Summary Tracker -> Total: ${totalClasses.value} | Present: ${presentCount.value} | Absent: ${absentCount.value} | Pending: ${pendingCount.value}`, 14, 42)

  const tableRows = filteredAttendanceList.value.map(att => [
    `${formatTime(att.start_time)} - ${formatTime(att.end_time)}`,
    `RM ${att.room}`,
    `${att.teacher_name} (${att.employee_id})`,
    att.subject,
    att.attendance_status.toUpperCase(),
    att.remarks || '---'
  ])

  autoTable(doc, {
    startY: 48,
    head: [['Schedule Clock', 'Room Node', 'Professional Name', 'Course Subject', 'Status Flag', 'Remarks Description']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [17, 24, 39] },
    styles: { fontSize: 9 }
  })

  doc.save(`Attendance_Report_${selectedDate.value}_${showArchived.value ? 'archived' : 'active'}.pdf`)
}

const getSelectionValue = (att: DailyAttendance) => {
  if (att.attendance_status === 'present') return 'PRESENT'
  if (att.attendance_status === 'absent' && (!att.remarks || att.remarks.trim() === '')) return 'ABSENT'
  
  const currentRemark = att.remarks || ''
  if (standardCodes.includes(currentRemark.trim())) return currentRemark.trim()
  if (currentRemark.trim() !== '') return 'CUSTOM'
  
  return 'pending'
}

const handleSelectionAction = (event: Event, att: DailyAttendance) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  if (!value || value === 'pending') return

  activeStaging.value.id = att.id

  if (value === 'PRESENT') {
    activeStaging.value.status = 'present'
    activeStaging.value.remarks = ''
    triggerCameraVerification(att.id)
  } else if (value === 'ABSENT') {
    activeStaging.value.status = 'absent'
    activeStaging.value.remarks = ''
    triggerCameraVerification(att.id)
  } else if (standardCodes.includes(value)) {
    activeStaging.value.status = (value === 'LT') ? 'late' : 'absent'
    activeStaging.value.remarks = value
    triggerCameraVerification(att.id)
  } else if (value === 'CUSTOM') {
    const isStandard = standardCodes.includes(att.remarks || '')
    remarkText.value = (att.remarks && !isStandard) ? att.remarks : ''
    activeStaging.value.status = att.attendance_status === 'pending' ? 'absent' : att.attendance_status
    showRemarkModal.value = true
  }

  target.value = getSelectionValue(att)
}

const triggerCameraVerification = (id: number) => {
  setTimeout(() => {
    const element = document.getElementById(`photo-upload-${id}`) as HTMLInputElement
    if (element) element.click()
  }, 40)
}

const submitCustomTextFlow = () => {
  activeStaging.value.remarks = remarkText.value.trim()
  showRemarkModal.value = false
  if (activeStaging.value.id) {
    triggerCameraVerification(activeStaging.value.id)
  }
}

const closeCustomModal = () => {
  showRemarkModal.value = false
  activeStaging.value = { id: null, status: '', remarks: '' }
}

const handlePhotoValidationUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const attendanceId = activeStaging.value.id
  
  if (target.files && target.files[0] && attendanceId) {
    const file = target.files[0]
    const formData = new FormData()
    formData.append('photo', file)
    formData.append('attendance_status', activeStaging.value.status)
    formData.append('remarks', activeStaging.value.remarks)

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
      const response = await fetch(`${BACKEND_URL}/api/attendance/${attendanceId}/verify-present`, {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })

      if (!response.ok) {
        throw new Error(`Upload server failure response: ${response.statusText}`)
      }

      target.value = ''
      activeStaging.value = { id: null, status: '', remarks: '' }
      await fetchAttendance()
    } catch (err) {
      console.error('Failed verification photo upload processing:', err)
      alert('Action Blocked: Photo verification failed.')
    }
  }
}

const openPhotoModal = (photoPath: string, teacherName: string) => {
  activePhotoPath.value = photoPath
  activePhotoTeacher.value = teacherName
  showPhotoModal.value = true
}

const formatTime = (time: string) => {
  if (!time) return ''
  return time.substring(0, 5)
}

const getPhotoUrl = (photoPath: string) => {
  if (!photoPath) return ''
  return `${BACKEND_URL}${photoPath}`
}

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'present': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    case 'absent':  return 'bg-red-50 text-red-700 ring-red-600/10'
    case 'late':    return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    case 'excused': return 'bg-sky-50 text-sky-700 ring-sky-600/20'
    default:        return 'bg-gray-50 text-gray-500 ring-gray-500/10'
  }
}

const getRowClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'present': return 'bg-emerald-50/20'
    case 'absent':  return 'bg-red-50/20'
    default:        return ''
  }
}

watch(showArchived, () => {
  fetchAttendance()
})

onMounted(() => {
  fetchAttendance()
})
</script>