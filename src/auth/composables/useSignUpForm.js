import { reactive } from "vue";
import { useRouter } from "vue-router";
import { FormValidation } from "@/auth/composables/useValidationForm.js";
import i18n from "@shared/i18n/i18n.js";
import { UserEntity } from "@/auth/models/user.entity.js";
import { UserAssembler } from "@/auth/services/user.assembler.js";
import { userService } from "@/auth/services/user.services.js";
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

    transformData() {
        const orgList = ['ORG001', 'ORG002', 'ORG003', 'ORG004', 'ORG005'];
        const roleList = ['admin', 'user'];

        const userId = Math.floor(100 + Math.random() * 900);
        const randomOrg = orgList[Math.floor(Math.random() * orgList.length)];
        const createdAt = new Date().toISOString();

        return new UserEntity(
            userId,
            roleList[1],
            this.email.toLowerCase(),
            this.email,
            this.password,
            this.firstname,
            this.lastname,
            randomOrg,
            roleList[1],
            createdAt
        );
    }

    validateForm() {
        const validated = new FormValidation(this.email, this.password);
        this.errors = {};

        const emailRequired = validated.requeried(this.email, t('alerts.email'));
        const passwordRequired = validated.requeried(this.password, t('alerts.password'));
        const firstnameRequired = validated.requeried(this.firstname, t('alerts.firstname'));
        const lastnameRequired = validated.requeried(this.lastname, t('alerts.lastname'));

        if (emailRequired) this.errors.email = emailRequired;
        if (passwordRequired) this.errors.password = passwordRequired;
        if (firstnameRequired) this.errors.firstname = firstnameRequired;
        if (lastnameRequired) this.errors.lastname = lastnameRequired;

        return Object.keys(this.errors).length === 0;
    }

    async createUser() {
        this.errors = {};

        if (!this.validateForm()) {
            return { success: false, errors: this.errors };
        }

        try {
            const payload = {
                username: this.email.toLowerCase(),
                password: this.password,
            };

            const { data: signUpData } = await http.post('/authentication/sign-up', payload);

            if (signUpData) {
                const { data: signInData } = await http.post('/authentication/sign-in', payload);
                const token = signInData.token;

                await this.createUserAccount(token);
                return { success: true };
            } else {
                return { success: false, errors: { server: 'Respuesta inválida del servidor' } };
            }

        } catch (error) {
            if (error.response && error.response.data) {
                return { success: false, errors: { server: error.response.data.message || 'Error del servidor' } };
            } else {
                return { success: false, errors: { server: 'Error de red o inesperado' } };
            }
        }
    }

    async createUserAccount(token) {
        this.errors = {};

        if (!this.validateForm()) {
            return { success: false, errors: this.errors };
        }

        try {
            localStorage.setItem("token", token);
            const tempUser = this.transformData();

            if (!tempUser) {
                return { success: false, errors: { transform: "Falló la transformación del usuario" } };
            }

            const payload = UserAssembler.fromUser(tempUser);

            console.log("Token usado:", localStorage.getItem("token"));
            console.log("Payload a enviar:", payload);

            await userService.create(payload); // Aquí usa el header con token
            await useAuth().login(token, tempUser.id, tempUser.organizationId);
            await router.push('/session');

            return { success: true };

        } catch (error) {
            if (error.response) {
                console.error("Error del servidor:", error.response.data);
            } else {
                console.error("Error inesperado:", error.message);
            }
            return { success: false };
        }
    }

}
