import {OrganizationEntity} from "@/auth/models/organization.entity.js";

export class OrganizationAssembler{
    static toOrganization(resource) {
        return new OrganizationEntity(

        );
    }
}