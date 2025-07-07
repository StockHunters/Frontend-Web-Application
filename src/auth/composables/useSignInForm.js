// useSignInForm.js
import router from '@shared/router/index.js';
import { useAuth } from '@shared/composables/useAuth.js';
import i18n from '@shared/i18n/i18n.js';
import { http } from '@shared/api/httpClient.js';

const { t } = i18n.global;
const DEBUG = process.env.NODE_ENV !== 'production';

export class SignInForm {
    constructor({ email = '', password = '' } = {}) {
        this.email = email;
        this.password = password;
        this.errors = {};
    }

    /* ---------- Validación mínima ---------- */
    validateForm() {
        this.errors = {};

        if (!this.email) {
            this.errors.email = t('alerts.email') || 'Correo requerido';
        }
        if (!this.password) {
            this.errors.password = t('alerts.password') || 'Contraseña requerida';
        }

        return Object.keys(this.errors).length === 0;
    }

    /* ---------- Llamada al endpoint ---------- */
    async signInRequest() {
        const url = '/authentication/sign-in';
        const payload = {
            username: this.email, // el backend espera "username"
            password: this.password
        };

        if (DEBUG) console.debug('[SignIn] POST', url, payload);

        try {
            const { data, status } = await http.post(url, payload);
            if (DEBUG) console.debug('[SignIn] OK', status, data);
            return { success: true, data };
        } catch (err) {
            const status = err.response?.status;
            if (DEBUG) console.error('[SignIn] ERR', status, err.response?.data);

            if (status === 401) {
                this.errors.login = t('alerts.invalidCredentials') || 'Email o contraseña incorrectos';
            } else {
                this.errors.login = err.message || 'Error inesperado';
            }

            return { success: false, error: this.errors };
        }
    }

    /* ---------- Punto de entrada ---------- */
    async login() {
        this.errors = {};

        if (!this.validateForm()) {
            return { success: false, error: this.errors };
        }

        const result = await this.signInRequest();
        if (!result.success) return result;

        const { token, id } = result.data;

        // Guardar en Auth global
        const auth = useAuth();
        auth.login(token, id); // Asegúrate de que esta función guarde el token

        // Guardar token en localStorage (opcional si useAuth lo hace)
        localStorage.setItem('token', token);

        await router.push('/app');
        return { success: true };
    }
}
