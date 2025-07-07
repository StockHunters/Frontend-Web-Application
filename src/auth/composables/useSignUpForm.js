import i18n from "@shared/i18n/i18n.js";
import { useAuth } from "@shared/composables/useAuth.js";
import router from "@shared/router/index.js";
import { http } from "@/shared/api/httpClient";

const { t } = i18n.global;

export class SignUpForm {
    constructor({ firstname, lastname, email, password }) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.errors = {};
    }

    validateForm() {
        this.errors = {};

        if (!this.firstname) this.errors.firstname = t('alerts.firstname') || 'Nombre requerido';
        if (!this.lastname) this.errors.lastname = t('alerts.lastname') || 'Apellido requerido';
        if (!this.email) this.errors.email = t('alerts.email') || 'Correo requerido';
        if (!this.password) this.errors.password = t('alerts.password') || 'Contraseña requerida';

        return Object.keys(this.errors).length === 0;
    }

    async createUser() {
        this.errors = {};

        if (!this.validateForm()) {
            return { success: false, errors: this.errors };
        }

        const payload = {
            username: this.email.toLowerCase(),
            password: this.password
        };

        try {
            // 1. SIGN UP
            await http.post('/authentication/sign-up', payload);

            // 2. SIGN IN automático
            const { data } = await http.post('/authentication/sign-in', payload);

            const { token, id, organizationId } = data;
            useAuth().login(token, id, organizationId);

            await router.push('/session');
            return { success: true };
        } catch (error) {
            const status = error.response?.status;

            if (status === 409) {
                this.errors.email = 'Este correo ya está registrado';
            } else {
                this.errors.server = error.response?.data?.message || 'Error del servidor';
            }

            return { success: false, errors: this.errors };
        }
    }
}
