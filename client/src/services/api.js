import axios from 'axios'

let baseURL = '/api'
if (import.meta.env.VITE_API_URL) {
    baseURL = import.meta.env.VITE_API_URL
    // If the user forgot to add /api at the end of their Render URL in Vercel, append it
    if (!baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
        baseURL = baseURL.replace(/\/$/, '') + '/api'
    }
}

const api = axios.create({
    baseURL
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle 401 responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
