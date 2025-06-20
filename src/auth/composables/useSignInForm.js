import {userService} from "@/auth/services/user.services.js";
import {UserAssembler} from "@/auth/services/user.assembler.js";
import router from "@shared/router/index.js";
import {useAuth} from "@shared/composables/useAuth.js";
import {FormValidation} from "@/auth/composables/useValidationForm.js";
import i18n from '@shared/i18n/i18n.js';
const { t } = i18n.global;

export class SignInForm {
    constructor({email, password}) {
        this.email = email;
        this.password = password;
        this.errors = {};
    }

    async getUser(){
        try {
            let users = await userService.getAll({email: this.email});

            if(users.data.length === 0) {
                this.errors.user = 'Not Found';
                return { success: false, error: this.errors }
            }

            return UserAssembler.toUserPreview(users.data[0]);
        } catch (error){
            console.log('getUser error: ' + error);
        }
    }

    validateForm(){
        const validated = new FormValidation(this.email, this.password);
        this.errors = {};

        const emailRequired = validated.requeried(this.email, t('alerts.email'));
        const passwordRequired = validated.requeried(this.password, t('alerts.password'));

        if (emailRequired) this.errors.email = emailRequired;
        if (passwordRequired) this.errors.password = passwordRequired;

        return Object.keys(this.errors).length === 0;
    }

    async login(){
        this.errors = {};

        if(!this.validateForm()){
            return {success: false, error: this.errors };
        }

        try{
            let tempUser = await this.getUser();

            if(this.email !== tempUser.email || this.password !== tempUser.pwdHash) {
                this.errors.login = 'email or password is incorrect';
                return {success: false, error: this.errors }
            }

            useAuth().login(tempUser.pwdHash, tempUser.id, tempUser.organizationId);
            router.push('/session');

        } catch (error){
            console.log('login error: ' + error);
        }
    }
}
