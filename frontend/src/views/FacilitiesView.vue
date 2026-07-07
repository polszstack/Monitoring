<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-100 pb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Facility Management</h2>
        <p class="mt-2 text-sm text-gray-500">Track structural inventory assets, assess health matrix variables, and report facility anomalies.</p>
      </div>
      <div class="flex gap-3 self-start md:self-auto w-full md:w-auto">
        <button 
          @click="quickReport" 
          class="flex-1 md:flex-initial text-xs uppercase tracking-wider font-black bg-red-50 text-red-600 hover:bg-red-100/80 px-5 py-3 rounded-xl border border-red-200/40 shadow-sm transition-all active:scale-[0.98] inline-flex items-center justify-center gap-1.5"
        >
          <span>🚨 Quick Report</span>
        </button>
        <button 
          @click="showAddItemModal = true" 
          class="flex-1 md:flex-initial text-xs uppercase tracking-wider font-black bg-gray-900 text-white hover:bg-gray-800 px-5 py-3 rounded-xl shadow-sm transition-all active:scale-[0.98]"
        >
          + Add New Item
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="card p-5 bg-white border border-gray-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Assets</p>
          <p class="text-3xl font-black text-gray-900 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ stats.totalItems }}
          </p>
        </div>
        <div class="p-3 bg-gray-50 text-gray-400 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-red-50/50 border border-red-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-red-500 uppercase tracking-widest">Broken Items</p>
          <p class="text-3xl font-black text-red-600 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ stats.brokenItems }}
          </p>
        </div>
        <div class="p-3 bg-red-100 text-red-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-amber-50/50 border border-amber-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending Reports</p>
          <p class="text-3xl font-black text-amber-700 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ stats.pendingReports }}
          </p>
        </div>
        <div class="p-3 bg-amber-100 text-amber-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 0019.4 19l-5.83-5.83m-2.15 2l-2.15 2.15a1.5 1.5 0 11-2.12-2.12l2.15-2.15m2.15 2.15l4-4" /></svg>
        </div>
      </div>
      <div class="card p-5 bg-green-50/50 border border-green-100 flex items-center justify-between group rounded-2xl shadow-sm">
        <div class="space-y-1">
          <p class="text-[10px] font-black text-green-600 uppercase tracking-widest">Good Condition</p>
          <p class="text-3xl font-black text-green-700 tracking-tight group-hover:scale-105 origin-left transition-transform duration-200">
            {{ stats.totalItems - stats.brokenItems }}
          </p>
        </div>
        <div class="p-3 bg-green-100 text-green-600 rounded-xl">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
        </div>
      </div>
    </div>

    <div class="border-b border-gray-200 bg-white px-2 rounded-t-xl">
      <nav class="-mb-px flex space-x-8">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id 
              ? 'border-gray-900 text-gray-900 font-bold' 
              : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300 font-semibold',
            'whitespace-nowrap pb-4 pt-4 px-1 border-b-2 text-xs uppercase tracking-wider transition-all'
          ]"
        >
          {{ tab.name }}
          <span class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-lg font-mono text-[11px]">
            {{ tab.id === 'inventory' ? inventory.length : reports.length }}
          </span>
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'inventory'" class="space-y-6 animate-fade-in">
      <div class="flex flex-wrap gap-2 items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
        <span class="text-[10px] font-black uppercase text-gray-400 tracking-wider mr-2 ml-1">Filters:</span>
        <button 
          @click="filterCategory = ''" 
          :class="filterCategory === '' ? 'bg-gray-950 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100/70 border border-gray-200/60'" 
          class="text-xs font-bold px-4 py-1.5 rounded-xl transition-all"
        >
          All Assets
        </button>
        <button 
          v-for="cat in categories" :key="cat"
          @click="filterCategory = cat"
          :class="filterCategory === cat ? 'bg-gray-950 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100/70 border border-gray-200/60'"
          class="text-xs font-bold px-4 py-1.5 rounded-xl capitalize transition-all"
        >
          {{ getCategoryEmoji(cat) }} {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="loadingInventory" class="col-span-full flex flex-col justify-center items-center py-20 bg-white rounded-2xl border border-gray-100">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
          <p class="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Nodes...</p>
        </div>
        
        <div v-else-if="filteredInventory.length === 0" class="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
          <p class="text-base font-semibold text-gray-900">No Inventory Items Found</p>
          <p class="text-xs mt-1">Adjust your metrics or insert a completely fresh record node.</p>
        </div>

        <div 
          v-for="item in filteredInventory" 
          :key="item.id" 
          class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-soft transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          :class="item.condition_status === 'broken' ? 'border-red-200 bg-red-50/20' : ''"
        >
          <div>
            <div class="flex items-start justify-between mb-4 gap-2">
              <div class="min-w-0">
                <span class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-gray-50 text-gray-500 border border-gray-100 tracking-tight uppercase">
                  {{ item.item_code }}
                </span>
                <h3 class="font-extrabold text-gray-900 text-base mt-1.5 tracking-tight truncate group-hover:text-gray-700 transition-colors">
                  {{ item.item_name }}
                </h3>
              </div>
              <span :class="getConditionBadge(item.condition_status)" class="text-[10px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider shrink-0 shadow-2sm">
                {{ item.condition_status }}
              </span>
            </div>
            
            <div class="space-y-2.5 text-xs text-gray-500 font-medium border-t border-gray-50 pt-3">
              <div class="flex items-center gap-2.5">
                <span class="bg-gray-50 p-1 rounded-md text-sm">{{ getCategoryEmoji(item.category) }}</span>
                <span class="capitalize text-gray-700 font-semibold">{{ item.category }} Domain</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="bg-gray-50 p-1 rounded-md text-xs">📍</span>
                <span class="truncate text-gray-600">Loc: {{ item.location || 'N/A' }} {{ item.room_number ? `• ${item.room_number}` : '' }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="bg-gray-50 p-1 rounded-md text-xs">🔢</span>
                <span class="font-mono text-gray-600 font-bold">In Stock Quantity: {{ item.quantity }}</span>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-3 border-t border-gray-50 flex gap-2">
            <button 
              v-if="item.condition_status !== 'broken'"
              @click="quickReportItem(item)" 
              class="flex-1 text-[11px] font-black uppercase tracking-wider py-2 px-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors inline-flex items-center justify-center gap-1"
            >
              <span>🚨 Report Broken</span>
            </button>
            <button 
              @click="editItem(item)" 
              class="text-[11px] font-black uppercase tracking-wider py-2 px-4 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
            >
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'reports'" class="space-y-4 animate-fade-in">
      <div v-if="loadingReports" class="flex justify-center items-center py-12 bg-white rounded-2xl border border-gray-100">
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-900 border-t-transparent"></div>
      </div>
      
      <div v-else-if="reports.length === 0" class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
        <p class="text-xl mb-1">📋 All Nodes Operational</p>
        <p class="text-xs text-gray-400">Grid system records verify zero unresolved hardware failure instances.</p>
      </div>

      <div v-for="report in reports" :key="report.id" 
           class="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-soft transition-all duration-200"
           :class="report.priority === 'urgent' ? 'border-red-300 ring-2 ring-red-500/5' : ''">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-mono font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">#{{ report.report_number }}</span>
              <span :class="getStatusBadge(report.status)" class="text-[10px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider">
                {{ formatStatus(report.status) }}
              </span>
              <span :class="getPriorityBadge(report.priority)" class="text-[10px] px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider">
                {{ report.priority }}
              </span>
            </div>
            <h3 class="font-extrabold text-gray-900 text-lg tracking-tight">{{ report.item_name }}</h3>
            <p v-if="report.item_description" class="text-sm text-gray-500 max-w-2xl font-medium leading-relaxed">{{ report.item_description }}</p>
            
            <div class="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 font-semibold">
              <span class="inline-flex items-center gap-1">📍 <span class="text-gray-600 font-medium">{{ report.location }} {{ report.room_number ? `(${report.room_number})` : '' }}</span></span>
              <span class="inline-flex items-center gap-1">👤 <span class="text-gray-600 font-medium">{{ report.reporter_name }}</span></span>
              <span class="inline-flex items-center gap-1">📅 <span class="text-gray-600 font-medium font-mono">{{ formatDate(report.reported_date) }}</span></span>
            </div>
          </div>
          
          <div class="pt-2 sm:pt-0 shrink-0">
            <select 
              :value="report.status" 
              @change="(e: any) => updateReportStatus(report, e.target.value)"
              class="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all cursor-pointer shadow-2sm"
            >
              <option value="reported">📋 Reported</option>
              <option value="in_progress">🔧 In Progress</option>
              <option value="fixed">✅ Fixed</option>
              <option value="cannot_fix">❌ Cannot Fix</option>
              <option value="cancelled">🚫 Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showReportModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-sm" @click="showReportModal = false"></div>
        <div class="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scale-up z-10">
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-gray-50">
            <h3 class="text-base font-black text-gray-900 tracking-tight">🚨 Report Broken Item</h3>
            <button @click="showReportModal = false" class="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 text-xl transition-all">&times;</button>
          </div>
          
          <form @submit.prevent="submitReport" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Select Item or Type New</label>
              <select 
                v-model="selectedExistingItem" 
                @change="onExistingItemSelect"
                class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm"
              >
                <option value="">-- Select existing item --</option>
                <option v-for="item in inventory" :key="item.id" :value="item.id">
                  {{ item.item_name }} ({{ item.item_code }}) - {{ item.location }} {{ item.room_number || '' }}
                </option>
              </select>
              <div class="text-[10px] font-black text-gray-400 text-center my-2 uppercase tracking-widest">or custom entry</div>
              <input 
                v-model="newReport.item_name" 
                type="text" 
                class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm"
                placeholder="Type custom element label asset..."
                :disabled="!!selectedExistingItem"
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
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Location</label>
                <select v-model="newReport.location" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm">
                  <option value="">Select</option>
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
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Room No.</label>
                <select v-model="newReport.room_number" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm">
                  <option value="">Select</option>
                  <option value="Room 101">Room 101</option>
                  <option value="Room 102">Room 102</option>
                  <option value="Room 201">Room 201</option>
                  <option value="Room 202">Room 202</option>
                  <option value="Room 301">Room 301</option>
                  <option value="Room 302">Room 302</option>
                  <option value="Lab 1">Lab 1</option>
                  <option value="Lab 2">Lab 2</option>
                  <option value="Lab 3">Lab 3</option>
                </select>
              </div>
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

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Incident Action Notes (optional)</label>
              <textarea v-model="newReport.notes" rows="2" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm" placeholder="Provide auxiliary grid details..."></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-gray-50 mt-4">
              <button type="button" @click="showReportModal = false" class="text-xs uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl transition-all">Cancel</button>
              <button type="submit" class="text-xs uppercase tracking-wider font-black bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all">Submit Report</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showAddItemModal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-950/40 backdrop-blur-sm" @click="showAddItemModal = false; editingItem = null"></div>
        <div class="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scale-up z-10">
          <div class="flex items-center justify-between mb-5 pb-3 border-b border-gray-50">
            <h3 class="text-base font-black text-gray-900 tracking-tight">{{ editingItem ? '✏️ Edit Asset Item' : '➕ Register New Asset' }}</h3>
            <button @click="showAddItemModal = false; editingItem = null" class="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-50 text-xl transition-all">&times;</button>
          </div>
          
          <form @submit.prevent="addItem" class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Asset Category & Label Configuration</label>
              <div class="flex gap-2">
                <select v-model="newItem.category" class="w-1/3 bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm cursor-pointer">
                  <option value="furniture">🪑 Furniture</option>
                  <option value="electrical">⚡ Electrical</option>
                  <option value="plumbing">🔧 Plumbing</option>
                  <option value="electronics">💻 Electronics</option>
                  <option value="structural">🏗️ Structural</option>
                  <option value="other">📦 Other</option>
                </select>
                <select 
                  v-model="newItem.item_name" 
                  class="flex-1 bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm cursor-pointer"
                  @change="onCommonItemSelect"
                >
                  <option value="">-- Select or type custom below --</option>
                  <optgroup label="Furniture">
                    <option value="Teacher Chair">Teacher Chair</option>
                    <option value="Student Desk">Student Desk</option>
                    <option value="Teacher Table">Teacher Table</option>
                    <option value="Whiteboard">Whiteboard</option>
                    <option value="Cabinet">Cabinet</option>
                    <option value="Bookshelf">Bookshelf</option>
                  </optgroup>
                  <optgroup label="Electrical">
                    <option value="Electric Fan">Electric Fan</option>
                    <option value="LED Light">LED Light</option>
                    <option value="Air Conditioner">Air Conditioner</option>
                    <option value="Wall Outlet">Wall Outlet</option>
                  </optgroup>
                  <optgroup label="Electronics">
                    <option value="Projector">Projector</option>
                    <option value="Computer">Computer</option>
                    <option value="TV/Monitor">TV/Monitor</option>
                    <option value="Speaker">Speaker</option>
                  </optgroup>
                </select>
              </div>
              <input 
                v-if="newItem.item_name === '__custom__' || !newItem.item_name"
                v-model="customItemName" 
                type="text" 
                class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all mt-2 shadow-2sm" 
                placeholder="Or type custom item node definition..."
                @input="newItem.item_name = customItemName"
              >
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Location Hub</label>
                <select v-model="newItem.location" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm">
                  <option value="">Select</option>
                  <option value="Main Building">Main Building</option>
                  <option value="Annex Building">Annex Building</option>
                  <option value="Gymnasium">Gymnasium</option>
                  <option value="Library">Library</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Room Grid Position</label>
                <select v-model="newItem.room_number" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm">
                  <option value="">Select</option>
                  <option value="Room 101">Room 101</option>
                  <option value="Room 102">Room 102</option>
                  <option value="Room 201">Room 201</option>
                  <option value="Lab 1">Lab 1</option>
                  <option value="Lab 2">Lab 2</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Quantity Nodes</label>
                <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2 shadow-2sm">
                  <button type="button" @click="newItem.quantity = Math.max(1, newItem.quantity - 1)" class="text-gray-500 hover:text-gray-900 font-extrabold text-sm p-1.5 transition-colors">-</button>
                  <input v-model.number="newItem.quantity" type="number" min="1" class="w-full bg-transparent border-0 text-center text-sm font-bold focus:outline-none focus:ring-0 p-2">
                  <button type="button" @click="newItem.quantity++" class="text-gray-500 hover:text-gray-900 font-extrabold text-sm p-1.5 transition-colors">+</button>
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Structural Condition</label>
                <select v-model="newItem.condition_status" class="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-2sm">
                  <option value="good">Good State</option>
                  <option value="fair">Fair Degradation</option>
                  <option value="poor">Poor Degradation</option>
                  <option value="broken">Broken State</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-gray-50 mt-4">
              <button type="button" @click="showAddItemModal = false; editingItem = null" class="text-xs uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl transition-all">Cancel</button>
              <button type="submit" class="text-xs uppercase tracking-wider font-black bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl shadow-sm transition-all">
                {{ editingItem ? 'Apply Update' : 'Register Asset' }}
              </button>
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
import type { FacilityInventory, FacilityReport } from '@/types'

const { get, post, put } = useApi()

const activeTab = ref('inventory')
const loadingInventory = ref(false)
const loadingReports = ref(false)
const filterCategory = ref('')

const stats = ref({ totalItems: 0, brokenItems: 0, totalReports: 0, pendingReports: 0 })
const inventory = ref<FacilityInventory[]>([])
const reports = ref<FacilityReport[]>([])
const showReportModal = ref(false)
const showAddItemModal = ref(false)
const selectedExistingItem = ref('')
const editingItem = ref<FacilityInventory | null>(null)
const customItemName = ref('')

const categories = ['furniture', 'electrical', 'plumbing', 'electronics', 'structural', 'other']
const priorities = [
  { value: 'low', label: 'Low', emoji: '🟢', activeClass: 'ring-green-500 bg-green-50/40 text-green-700' },
  { value: 'medium', label: 'Med', emoji: '🟡', activeClass: 'ring-yellow-500 bg-yellow-50/40 text-yellow-700' },
  { value: 'high', label: 'High', emoji: '🟠', activeClass: 'ring-orange-500 bg-orange-50/40 text-orange-700' },
  { value: 'urgent', label: 'Urgent', emoji: '🔴', activeClass: 'ring-red-500 bg-red-50/40 text-red-700' }
]

const tabs = [
  { id: 'inventory', name: 'Inventory Registry' },
  { id: 'reports', name: 'Active Reports Log' }
]

const newReport = ref({
  item_name: '',
  facility_type: '',
  item_description: '',
  location: '',
  room_number: '',
  priority: 'medium',
  notes: ''
})

const newItem = ref({
  item_code: '',
  item_name: '',
  category: 'furniture',
  description: '',
  location: '',
  room_number: '',
  quantity: 1,
  condition_status: 'good',
  notes: ''
})

const filteredInventory = computed(() => {
  if (!filterCategory.value) return inventory.value
  return inventory.value.filter(item => item.category === filterCategory.value)
})

// Auto-generate item code
const generateItemCode = (category: string) => {
  const prefix = category.substring(0, 3).toUpperCase()
  const existing = inventory.value.filter(i => i.category === category).length
  return `${prefix}-${String(existing + 1).padStart(3, '0')}`
}

const onExistingItemSelect = () => {
  if (selectedExistingItem.value) {
    const item = inventory.value.find(i => i.id.toString() === selectedExistingItem.value)
    if (item) {
      newReport.value.item_name = item.item_name
      newReport.value.facility_type = item.category
      newReport.value.location = item.location || ''
      newReport.value.room_number = item.room_number || ''
    }
  } else {
    newReport.value.item_name = ''
    newReport.value.facility_type = ''
    newReport.value.location = ''
    newReport.value.room_number = ''
  }
}

const onCommonItemSelect = () => {
  if (newItem.value.item_name && newItem.value.item_name !== '__custom__') {
    newItem.value.item_code = generateItemCode(newItem.value.category)
    newItem.value.quantity = 1
  }
}

const quickReport = () => {
  selectedExistingItem.value = ''
  newReport.value = {
    item_name: '',
    facility_type: '',
    item_description: '',
    location: '',
    room_number: '',
    priority: 'medium',
    notes: ''
  }
  showReportModal.value = true
}

const quickReportItem = (item: FacilityInventory) => {
  newReport.value = {
    item_name: item.item_name,
    facility_type: item.category,
    item_description: '',
    location: item.location || '',
    room_number: item.room_number || '',
    priority: 'medium',
    notes: ''
  }
  showReportModal.value = true
}

const editItem = (item: FacilityInventory) => {
  editingItem.value = item
  newItem.value = {
    item_code: item.item_code,
    item_name: item.item_name,
    category: item.category,
    description: item.description ?? '',
    location: item.location ?? '',
    room_number: item.room_number ?? '',
    quantity: item.quantity,
    condition_status: item.condition_status,
    notes: item.notes ?? ''
  }
  showAddItemModal.value = true
}

const fetchInventory = async () => {
  loadingInventory.value = true
  try {
    inventory.value = await get<FacilityInventory[]>('/facility/inventory')
  } catch (err) {
    console.error('Failed to fetch inventory:', err)
  } finally {
    loadingInventory.value = false
  }
}

const fetchReports = async () => {
  loadingReports.value = true
  try {
    reports.value = await get<FacilityReport[]>('/facility/reports')
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

const addItem = async () => {
  try {
    if (!newItem.value.item_code) {
      newItem.value.item_code = generateItemCode(newItem.value.category)
    }
    
    if (editingItem.value) {
      await put(`/facility/inventory/${editingItem.value.id}`, newItem.value)
    } else {
      await post('/facility/inventory', newItem.value)
    }
    
    showAddItemModal.value = false
    editingItem.value = null
    newItem.value = { item_code: '', item_name: '', category: 'furniture', description: '', location: '', room_number: '', quantity: 1, condition_status: 'good', notes: '' }
    await fetchInventory()
    await fetchStats()
  } catch (err: any) {
    alert('Error: ' + (err.response?.data?.error || err.message))
  }
}

const submitReport = async () => {
  try {
    if (!newReport.value.item_name) {
      alert('Please select or enter an item name')
      return
    }
    if (!newReport.value.facility_type) {
      alert('Please select a category')
      return
    }
    if (!newReport.value.location) {
      alert('Please select a location')
      return
    }
    
    await post('/facility/reports', newReport.value)
    showReportModal.value = false
    await fetchReports()
    await fetchInventory()
    await fetchStats()
    activeTab.value = 'reports'
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

const getCategoryEmoji = (cat: string) => {
  const emojis: Record<string, string> = {
    furniture: '🪑', electrical: '⚡', plumbing: '🔧',
    electronics: '💻', structural: '🏗️', other: '📦'
  }
  return emojis[cat] || '📦'
}

const getConditionBadge = (condition: string) => {
  const map: Record<string, string> = {
    good: 'bg-emerald-50 text-emerald-700 border border-emerald-100/60',
    fair: 'bg-amber-50 text-amber-700 border border-amber-100/60',
    poor: 'bg-orange-50 text-orange-700 border border-orange-100/60',
    broken: 'bg-red-50 text-red-700 border border-red-100/60'
  }
  return map[condition] || 'bg-gray-50 text-gray-700 border border-gray-100'
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
  fetchInventory()
  fetchReports()
})
</script>