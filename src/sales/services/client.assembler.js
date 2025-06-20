import {ClientEntity} from "@/sales/model/client.entity.js";

export class ClientAssembler{
    static toClient(resource) {
        return new ClientEntity(
            resource.data.id,
            resource.data.first_name,
            resource.data.last_name,
            resource.data.phone,
            resource.data.email,
            resource.data.registration_date,
            resource.data.dni,
            resource.data.status,
            resource.data.company,
            resource.data.created_at,
        );
    }

    static toClientForm(resource) {
        return new ClientEntity(
            resource.id,
            resource.first_name,
            resource.last_name,
            resource.phone,
            resource.email,
            resource.registration_date,
            resource.dni,
            resource.status,
            resource.company,
            resource.created_at,
        );
    }

    static toEntityFromResponse(response) {
        return response.data.map(resource => this.toClientForm(resource));
    }
}