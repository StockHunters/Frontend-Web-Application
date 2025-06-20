export class ClientEntity {

    constructor(id = null,
                firstName = '',
                lastName = '',
                phone = null,
                email = '',
                registration_date = null,
                dni = null,
                status = null,
                company = '',
                created_at = null ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.registration_date = registration_date;
        this.dni = dni;
        this.status = status;
        this.company = company;
        this.created_at = created_at;
    }

    get clientFullName(){
        return `${this.firstName} ${this.lastName}`;
    }
}