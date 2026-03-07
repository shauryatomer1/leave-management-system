<template>
  <main class="flex-1 p-6 lg:p-10">
    <div class="mx-auto max-w-5xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Approval Portal</h1>
        <p class="mt-1 text-slate-500">Review and manage all employee leave requests.</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 mb-10">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-l-4 border-l-primary">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
          <p class="text-3xl font-bold mt-1 text-primary">{{ pendingCount }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-l-4 border-l-green-500">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved</p>
          <p class="text-3xl font-bold mt-1 text-green-600">{{ approvedCount }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm border-l-4 border-l-red-500">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rejected</p>
          <p class="text-3xl font-bold mt-1 text-red-600">{{ rejectedCount }}</p>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="tab in tabs" :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
            activeTab === tab ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center text-slate-400">
        <span class="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
        <p class="mt-2">Loading requests...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredLeaves.length === 0" class="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
        <span class="material-symbols-outlined text-4xl mb-2">inbox</span>
        <p class="font-medium">No {{ activeTab.toLowerCase() }} requests</p>
      </div>

      <!-- Request Cards -->
      <div v-else class="space-y-4">
        <div
          v-for="leave in filteredLeaves"
          :key="leave._id"
          class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="p-5 flex gap-4">
            <div class="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {{ getInitials(leave.employee?.name) }}
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 class="font-bold text-lg text-slate-900">{{ leave.employee?.name || 'Unknown' }}</h4>
                  <p class="text-sm text-slate-500">{{ leave.employee?.email }}</p>
                </div>
                <span :class="typeClass(leave.leaveType)" class="px-2.5 py-1 rounded-full text-xs font-semibold">
                  {{ leave.leaveType }}
                </span>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-slate-400">calendar_today</span>
                  <div>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">Dates</p>
                    <p class="text-sm font-medium">{{ formatDate(leave.startDate) }} — {{ formatDate(leave.endDate) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-slate-400">info</span>
                  <div>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">Duration</p>
                    <p class="text-sm font-medium">{{ calcDays(leave.startDate, leave.endDate) }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-3 p-3 bg-slate-50 rounded-lg">
                <p class="text-sm text-slate-600 italic">"{{ leave.reason }}"</p>
              </div>

              <!-- Actions for Pending -->
              <div v-if="leave.status === 'Pending'" class="mt-4 flex gap-3">
                <button
                  @click="updateStatus(leave._id, 'Approved')"
                  :disabled="leave._processing"
                  class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span class="material-symbols-outlined text-lg">check_circle</span>
                  Approve
                </button>
                <button
                  @click="updateStatus(leave._id, 'Rejected')"
                  :disabled="leave._processing"
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span class="material-symbols-outlined text-lg">cancel</span>
                  Reject
                </button>
              </div>

              <!-- Already processed -->
              <div v-else class="mt-4">
                <span :class="statusClass(leave.status)" class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold">
                  {{ leave.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const leaves = ref([])
const loading = ref(true)
const activeTab = ref('All')
const tabs = ['All', 'Pending', 'Approved', 'Rejected']

const pendingCount = computed(() => leaves.value.filter(l => l.status === 'Pending').length)
const approvedCount = computed(() => leaves.value.filter(l => l.status === 'Approved').length)
const rejectedCount = computed(() => leaves.value.filter(l => l.status === 'Rejected').length)

const filteredLeaves = computed(() => {
  if (activeTab.value === 'All') return leaves.value
  return leaves.value.filter(l => l.status === activeTab.value)
})

onMounted(async () => {
  try {
    const { data } = await api.get('/leaves')
    leaves.value = data
  } catch (err) {
    console.error('Failed to fetch leaves:', err)
  } finally {
    loading.value = false
  }
})

async function updateStatus(id, status) {
  const leave = leaves.value.find(l => l._id === id)
  if (leave) leave._processing = true

  try {
    const { data } = await api.patch(`/leaves/${id}`, { status })
    const idx = leaves.value.findIndex(l => l._id === id)
    if (idx !== -1) {
      leaves.value[idx] = { ...leaves.value[idx], status: data.leave.status, _processing: false }
    }
  } catch (err) {
    console.error('Failed to update:', err)
    if (leave) leave._processing = false
  }
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function calcDays(start, end) {
  const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1
  return `${diff} Working Day${diff > 1 ? 's' : ''}`
}

function typeClass(type) {
  const map = {
    'Annual Leave': 'bg-blue-100 text-blue-700',
    'Sick Leave': 'bg-purple-100 text-purple-700',
    'Personal Leave': 'bg-amber-100 text-amber-700',
  }
  return map[type] || 'bg-slate-100 text-slate-700'
}

function statusClass(status) {
  const map = {
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  }
  return map[status] || 'bg-slate-100 text-slate-800'
}
</script>
