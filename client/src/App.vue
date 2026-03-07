<template>
  <div class="min-h-screen flex flex-col bg-background-light text-slate-900">
    <Navbar v-if="isAuthenticated" @logout="onLogout" />
    <router-view @authenticated="onAuthenticated" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const isAuthenticated = ref(false)

function checkAuth() {
  const token = localStorage.getItem('token')
  const routeName = route.name
  isAuthenticated.value = !!token && !['Login', 'Signup'].includes(routeName)
}

// Re-check on every route change
watch(() => route.fullPath, () => {
  checkAuth()
}, { immediate: true })

function onAuthenticated() {
  checkAuth()
}

function onLogout() {
  isAuthenticated.value = false
}
</script>
