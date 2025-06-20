import i18n from '@shared/i18n/i18n.js';
const { t } = i18n.global;

export class FormValidation {
    constructor(firstname, lastname, phone, email, dni, status, company) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.dni = dni;
        this.status = status;
        this.company = company;
    }

    phone(message) {
        return this.phone.length === 9 ? null : message;
    }

    dni(message) {
        return this.dni.length === 8 ? null : message;
    }

    requeried(field, fieldName, message = t('alerts.required')){
        return field?.trim() !== "" ? null : `${fieldName + ' ' + message}`;
    }
}