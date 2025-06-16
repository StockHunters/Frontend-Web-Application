export class OrganizationEntity{
    constructor(id='',
                name='',
                contact_email='',
                plan_id='',
                created_at='',
                updated_at=''){

        this.name=name;
        this.contact_email=contact_email;
        this.plan_id=plan_id;
        this.created_at=created_at;
        this.updated_at=updated_at;
    }
}