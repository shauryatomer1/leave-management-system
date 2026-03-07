import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import EmployeeDashboard from '../views/EmployeeDashboard.vue'
import EmployerDashboard from '../views/EmployerDashboard.vue'
import ApplyLeave from '../views/ApplyLeave.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: LoginView, meta: { guest: true } },
    { path: '/signup', name: 'Signup', component: SignupView, meta: { guest: true } },
    { path: '/dashboard', name: 'EmployeeDashboard', component: EmployeeDashboard, meta: { requiresAuth: true, role: 'employee' } },
    { path: '/employer', name: 'EmployerDashboard', component: EmployerDashboard, meta: { requiresAuth: true, role: 'employer' } },
    { path: '/apply', name: 'ApplyLeave', component: ApplyLeave, meta: { requiresAuth: true, role: 'employee' } },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (to.meta.requiresAuth && !token) {
        return next('/login')
    }

    if (to.meta.guest && token) {
        return next(user.role === 'employer' ? '/employer' : '/dashboard')
    }

    if (to.meta.role && user.role !== to.meta.role) {
        return next(user.role === 'employer' ? '/employer' : '/dashboard')
    }

    next()
})

export default router
