export class ClientEntity {
    constructor(
        id = null,
        firstName = "",
        lastName = "",
        phone = null,
        email = "",
        registration_date = null,
        dni = null,
        status = null,
        company = "",
        created_at = null,
    ) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.phone = phone
        this.email = email
        this.registration_date = registration_date
        this.dni = dni
        this.status = status
        this.company = company
        this.created_at = created_at
    }

    get clientFullName() {
        return `${this.firstName} ${this.lastName}`
    }

    get formattedStatus() {
        return this.status || "Sin estado"
    }

    get isActive() {
        return this.status === "Activo"
    }

    get isInactive() {
        return this.status === "Inactivo"
    }

    toJson() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            email: this.email,
            registration_date: this.registration_date,
            dni: this.dni,
            status: this.status,
            company: this.company,
            created_at: this.created_at,
        }
    }

    static createEmpty() {
        return new ClientEntity()
    }

    isValid() {
        return (
            this.firstName.trim() !== "" &&
            this.lastName.trim() !== "" &&
            this.email.trim() !== "" &&
            this.phone !== null &&
            this.phone.toString().trim() !== ""
        )
    }
}
