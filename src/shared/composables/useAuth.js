import { computed } from 'vue';
import router from '@shared/router/index.js';

export function useAuth() {
    const getToken = () => localStorage.getItem('auth_token');

    const isAuthenticated = computed(() => !!getToken());

    const login = (token, id = null, org_id = null) => {
        if (token) localStorage.setItem('auth_token', token);
        if (id !== null) localStorage.setItem('id', id);
        if (org_id !== null) localStorage.setItem('org_id', org_id);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('id');
        localStorage.removeItem('org_id');
        router.push('/');
    };

    return {
        isAuthenticated,
        login,
        logout,
        getToken
    };
}
