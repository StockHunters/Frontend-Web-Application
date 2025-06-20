import {ApiService} from "@shared/api/apiServices.js";

export class OrganizationService extends ApiService {
    constructor() {
        super('organizations');
    }
}

export const organizationService = new OrganizationService();