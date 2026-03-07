<template>
  <div class="flex flex-1 items-center justify-center px-4 py-12">
    <div class="w-full max-w-[440px] space-y-8">
      <div class="text-center">
        <div class="flex items-center justify-center gap-2 mb-6">
          <img src="/leaveplus.svg" alt="LeavePlus" class="h-10 w-10" />
          <span class="text-xl font-bold tracking-tight text-slate-900">LeavePlus</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p class="mt-2 text-slate-500">Enter your credentials to sign in</p>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700" for="email">Email address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span class="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <input
              v-model="email"
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-700" for="password">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span class="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <input
              v-model="password"
              id="password"
              type="password"
              placeholder="••••••••"
              required
              class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          <span v-else>Sign in</span>
        </button>
      </form>

      <p class="text-center text-sm text-slate-500">
        Don't have an account?
        <router-link to="/signup" class="font-semibold text-primary hover:underline">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    router.push(data.user.role === 'employer' ? '/employer' : '/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
