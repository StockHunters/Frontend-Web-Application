import { computed } from 'vue'

export function useAuth() {
    const getToken = () => localStorage.getItem('auth_token')

    const isAuthenticated = computed(() => !!getToken())

    const login = (token) => {
        localStorage.setItem('auth_token', token)
    }

    const logout = () => {
        localStorage.removeItem('auth_token')
    }

    return {
        isAuthenticated,
        login,
        logout,
        getToken,
    }
}
