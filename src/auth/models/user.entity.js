export class UserEntity {
    constructor(id = '',
                organization_id= '',
                username = '',
                email = '',
                password_hash = '',
                first_name = '',
                last_name = '',
                profile_image_url = null,
                role = '',
                created_at = null) {

        this.id = id;
        this.organizationId = organization_id;
        this.username = username;
        this.email = email;
        this.pwdHash = password_hash;
        this.firstname = first_name;
        this.lastname = last_name;
        this.avatarUrl = profile_image_url;
        this.role = role;
        this.createdAt = created_at;
    }

    get fullName() {
        return `${this.firstname} ${this.lastname}`;
    }
}