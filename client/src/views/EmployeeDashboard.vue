<template>
  <main class="flex-1 p-6 lg:p-10">
    <div class="mx-auto max-w-5xl">
      <!-- Welcome -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {{ user.name?.split(' ')[0] }}</h1>
        <p class="mt-1 text-slate-500">Here's an overview of your leave requests.</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 mb-10">
        <div class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Requests</span>
            <span class="material-symbols-outlined text-primary">description</span>
          </div>
          <span class="text-3xl font-bold text-slate-900">{{ leaves.length }}</span>
        </div>
        <div class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Approved</span>
            <span class="material-symbols-outlined text-green-600">check_circle</span>
          </div>
          <span class="text-3xl font-bold text-green-600">{{ approvedCount }}</span>
        </div>
        <div class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending</span>
            <span class="material-symbols-outlined text-amber-500">pending_actions</span>
          </div>
          <span class="text-3xl font-bold text-amber-600">{{ pendingCount }}</span>
        </div>
      </div>

      <!-- Mobile apply button -->
      <div class="sm:hidden mb-6">
        <router-link
          to="/apply"
          class="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white w-full"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          Request Leave
        </router-link>
      </div>

      <!-- Requests Table -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 p-4 px-6">
          <h2 class="text-lg font-bold text-slate-900">My Leave Requests</h2>
        </div>

        <div v-if="loading" class="p-12 text-center text-slate-400">
          <span class="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
          <p class="mt-2">Loading your requests...</p>
        </div>

        <div v-else-if="leaves.length === 0" class="p-12 text-center text-slate-400">
          <span class="material-symbols-outlined text-4xl mb-2">inbox</span>
          <p class="font-medium">No leave requests yet</p>
          <p class="text-sm mt-1">Click "Request Leave" to submit your first application.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <th class="px-6 py-4">Date Range</th>
                <th class="px-6 py-4">Type</th>
                <th class="px-6 py-4">Days</th>
                <th class="px-6 py-4">Reason</th>
                <th class="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="leave in leaves" :key="leave._id">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-slate-900">{{ formatDate(leave.startDate) }} — {{ formatDate(leave.endDate) }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">{{ leave.leaveType }}</td>
                <td class="px-6 py-4 text-sm text-slate-600">{{ calcDays(leave.startDate, leave.endDate) }}</td>
                <td class="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">{{ leave.reason }}</td>
                <td class="px-6 py-4">
                  <span :class="statusClass(leave.status)" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {{ leave.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'))
const leaves = ref([])
const loading = ref(true)

const approvedCount = computed(() => leaves.value.filter(l => l.status === 'Approved').length)
const pendingCount = computed(() => leaves.value.filter(l => l.status === 'Pending').length)

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

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function calcDays(start, end) {
  const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1
  return `${diff} day${diff > 1 ? 's' : ''}`
}

function statusClass(status) {
  const map = {
    Pending: 'bg-amber-100 text-amber-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  }
  return map[status] || 'bg-slate-100 text-slate-800'
}
</script>
