<template>
  <main class="flex-1 flex justify-center py-10 px-4">
    <div class="w-full max-w-[640px]">
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Request Leave</h1>
        <p class="text-slate-500 mt-1">Fill out the form below to submit your application.</p>
      </div>

      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
        <span class="material-symbols-outlined text-lg">check_circle</span>
        {{ success }}
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
        {{ error }}
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form @submit.prevent="handleSubmit" class="p-6 md:p-8 space-y-6">
          <!-- Leave Type -->
          <div class="space-y-3">
            <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[18px]">category</span>
              Leave Type
            </label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label v-for="type in leaveTypes" :key="type" class="relative flex cursor-pointer">
                <input v-model="form.leaveType" type="radio" :value="type" class="peer sr-only" required />
                <div class="flex flex-col gap-1 p-4 rounded-lg border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 transition-all w-full">
                  <span class="text-sm font-bold text-slate-900">{{ type }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                Start Date
              </label>
              <input
                v-model="form.startDate"
                type="date"
                required
                class="w-full rounded-lg border border-slate-200 bg-white text-slate-900 h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[18px]">event_available</span>
                End Date
              </label>
              <input
                v-model="form.endDate"
                type="date"
                required
                class="w-full rounded-lg border border-slate-200 bg-white text-slate-900 h-12 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <!-- Days display -->
          <div v-if="totalDays > 0" class="p-4 bg-primary/5 rounded-lg flex items-center justify-between">
            <span class="text-sm text-slate-600">Total leave days:</span>
            <span class="text-lg font-bold text-primary">{{ totalDays }} day{{ totalDays > 1 ? 's' : '' }}</span>
          </div>

          <!-- Reason -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[18px]">chat_bubble</span>
              Reason
            </label>
            <textarea
              v-model="form.reason"
              required
              rows="4"
              placeholder="Briefly explain your request..."
              class="w-full p-4 rounded-lg border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-slate-400"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <router-link
              to="/dashboard"
              class="px-6 h-12 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-8 h-12 rounded-lg font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              <template v-else>
                Submit
                <span class="material-symbols-outlined text-[20px]">send</span>
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave']

const form = ref({
  leaveType: '',
  startDate: '',
  endDate: '',
  reason: '',
})

const error = ref('')
const success = ref('')
const loading = ref(false)

const totalDays = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return 0
  const diff = Math.ceil((new Date(form.value.endDate) - new Date(form.value.startDate)) / (1000 * 60 * 60 * 24)) + 1
  return diff > 0 ? diff : 0
})

async function handleSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true

  if (new Date(form.value.startDate) > new Date(form.value.endDate)) {
    error.value = 'Start date must be before end date.'
    loading.value = false
    return
  }

  try {
    await api.post('/leaves', form.value)
    success.value = 'Leave request submitted successfully!'
    form.value = { leaveType: '', startDate: '', endDate: '', reason: '' }
    setTimeout(() => router.push('/dashboard'), 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to submit request.'
  } finally {
    loading.value = false
  }
}
</script>
