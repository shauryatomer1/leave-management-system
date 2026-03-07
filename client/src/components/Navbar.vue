<template>
  <header class="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 lg:px-10">
    <div class="flex items-center gap-3">
      <img src="/leaveplus.svg" alt="LeavePlus" class="h-10 w-10" />
      <h2 class="text-xl font-bold tracking-tight text-slate-900">LeavePlus</h2>
    </div>

    <div class="flex items-center gap-4">
      <router-link
        v-if="user.role === 'employee'"
        to="/apply"
        class="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Request Leave
      </router-link>

      <router-link
        :to="user.role === 'employer' ? '/employer' : '/dashboard'"
        class="hidden sm:flex items-center gap-2 text-slate-600 font-medium hover:text-primary transition-colors"
      >
        <span class="material-symbols-outlined text-[20px]">dashboard</span>
        Dashboard
      </router-link>

      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          {{ initials }}
        </div>
        <div class="hidden md:block">
          <p class="text-sm font-semibold text-slate-900">{{ user.name }}</p>
          <p class="text-xs text-slate-500 capitalize">{{ user.role }}</p>
        </div>
      </div>

      <button
        @click="logout"
        class="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
      >
        <span class="material-symbols-outlined text-[20px]">logout</span>
        <span class="hidden sm:inline">Logout</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['logout'])
const router = useRouter()
const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'))
const initials = computed(() => {
  const name = user.value.name || ''
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  emit('logout')
  router.push('/login')
}
</script>
