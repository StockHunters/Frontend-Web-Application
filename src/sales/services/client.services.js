import {ApiService} from "@shared/api/apiServices.js";

export class ClientService extends ApiService{
    constructor() {
        super('clients');
    }
}

export const clientService = new ClientService();