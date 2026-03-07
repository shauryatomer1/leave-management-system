<template>
  <div class="flex flex-1 items-center justify-center px-4 py-12">
    <div class="w-full max-w-[480px] space-y-8">
      <div class="text-center">
        <div class="flex items-center justify-center gap-2 mb-6">
          <img src="/leaveplus.svg" alt="LeavePlus" class="h-10 w-10" />
          <span class="text-xl font-bold tracking-tight text-slate-900">LeavePlus</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p class="mt-2 text-slate-500">Start managing your leave with LeavePlus</p>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <div class="bg-white shadow-sm border border-slate-200 rounded-xl p-8">
        <form @submit.prevent="handleSignup" class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Full Name</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span class="material-symbols-outlined text-[20px]">person</span>
              </div>
              <input
                v-model="name"
                type="text"
                placeholder="John Doe"
                required
                class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Work Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span class="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <input
                v-model="email"
                type="email"
                placeholder="john@company.com"
                required
                class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span class="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                minlength="6"
                class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <p class="text-xs text-slate-500">Must be at least 6 characters.</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">I am signing up as</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative flex cursor-pointer">
                <input v-model="role" type="radio" value="employee" class="peer sr-only" />
                <div class="flex flex-col items-center gap-1 w-full p-4 rounded-lg border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                  <span class="material-symbols-outlined text-slate-500 peer-checked:text-primary">person</span>
                  <span class="text-sm font-bold text-slate-900">Employee</span>
                  <span class="text-xs text-slate-500">Apply for leave</span>
                </div>
              </label>
              <label class="relative flex cursor-pointer">
                <input v-model="role" type="radio" value="employer" class="peer sr-only" />
                <div class="flex flex-col items-center gap-1 w-full p-4 rounded-lg border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                  <span class="material-symbols-outlined text-slate-500 peer-checked:text-primary">admin_panel_settings</span>
                  <span class="text-sm font-bold text-slate-900">Employer</span>
                  <span class="text-xs text-slate-500">Manage requests</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            <template v-else>
              Create account
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </template>
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-slate-500">
        Already have an account?
        <router-link to="/login" class="font-semibold text-primary hover:underline">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('employee')
const error = ref('')
const loading = ref(false)

async function handleSignup() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await api.post('/auth/signup', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    router.push(data.user.role === 'employer' ? '/employer' : '/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
