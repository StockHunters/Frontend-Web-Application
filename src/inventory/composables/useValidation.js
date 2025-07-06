import i18n from '@shared/i18n/i18n.js';
const { t } = i18n.global;

export class FormValidation {
    constructor({ firstname, lastname, phone, email, dni, status, company }) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.dni = dni;
        this.status = status;
        this.company = company;
    }

    validatePhone(message = t('alerts.invalid_phone')) {
        return this.phone?.length === 9 ? null : message;
    }

    validateDni(message = t('alerts.invalid_dni')) {
        return this.dni?.length === 8 ? null : message;
    }

    required(field, fieldName, message = t('alerts.required')) {
        return field?.trim() !== "" ? null : `${fieldName} ${message}`;
    }

    // Ejemplo de validación por campo si lo necesitas
    validateAll() {
        return {
            firstname: this.required(this.firstname, t('fields.firstname')),
            lastname: this.required(this.lastname, t('fields.lastname')),
            phone: this.validatePhone(),
            dni: this.validateDni(),
            email: this.required(this.email, t('fields.email')),
            company: this.required(this.company, t('fields.company'))
        };
    }
}
