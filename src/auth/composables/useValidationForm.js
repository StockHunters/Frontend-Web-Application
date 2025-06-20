import i18n from '@shared/i18n/i18n.js';
const { t } = i18n.global;

export class FormValidation{
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    email(message){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(this.email) ? null : message;
    }

    password(message){
        return this.password.length >= 6 ? null : message;
    }

    requeried(field, fieldName, message = t('alerts.required')){
        return field?.trim() !== "" ? null : `${fieldName + ' ' + message}`;
    }
}