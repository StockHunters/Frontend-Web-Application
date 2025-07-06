import { reactive } from "vue";
import { useRouter } from "vue-router";
import {FormValidation} from "@/auth/composables/useValidationForm.js";
import i18n from '@shared/i18n/i18n.js';
import {UserEntity} from "@/auth/models/user.entity.js";
import {UserAssembler} from "@/auth/services/user.assembler.js";
import {userService} from "@/auth/services/user.services.js";
import {useAuth} from "@shared/composables/useAuth.js";
import router from "@shared/router/index.js";
const { t } = i18n.global;
import { http } from "@/shared/api/httpClient";


export class SignUpForm {
    constructor({firstname, lastname, email, password}) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;

        this.errors = {};
    }

    transformData() {
        const orgList = ['ORG001','ORG002','ORG003','ORG004','ORG005'];
        const roleList = [ 'admin' ,'user'];

        //const userId = `USR00${Math.floor(100 + Math.random() * 900)}`;
        const userId = '';
        const randomOrg = orgList[Math.floor(Math.random() * orgList.length)];

        const randomRole = roleList[Math.floor(Math.random() * roleList.length)];
        const createdAt = new Date().toISOString();

        return new UserEntity(
            userId,
            randomRole,
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

    validateForm(){
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

            const { data } = await http.post('/authentication/sign-up', payload);
            console.log(data);

            if (data && data.token && data.id) {
                await this.createUserAccount();
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


    async createUserAccount(){
        this.errors = {};

        if(!this.validateForm()){
            return {success: false, errors: this.errors};
        }

        try{
            const tempUser = this.transformData();
            if(tempUser === null){
                return {success: false, errors: this.errors};
            }

            await userService.create(UserAssembler.fromUser(tempUser));
            await useAuth().login(tempUser.pwdHash, tempUser.id, tempUser.organizationId);
            await router.push('/session');

        } catch (error){
            console.log(error);
        }

    }

}