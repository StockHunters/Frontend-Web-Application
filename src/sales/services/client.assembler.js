import {ClientEntity} from "@/sales/model/client.entity.js";

export class ClientAssembler{
    static toClient(resource) {
        const data = resource.data || resource;

        return new ClientEntity(
            data.id,
            data.firstName || data.first_name,
            data.lastName || data.last_name,
            data.phone,
            data.email,
            data.registrationDate || data.registration_date,
            data.dni,
            data.status,
            data.company,
            data.createdAt || data.created_at,
        );
    }

    static toClientForm(resource) {
        return new ClientEntity(
            resource.id,
            resource.firstName || resource.first_name,
            resource.lastName || resource.last_name,
            resource.phone,
            resource.email,
            resource.registrationDate || resource.registration_date,
            resource.dni,
            resource.status,
            resource.company,
            resource.createdAt || resource.created_at,
        );
    }

    static toEntityFromResponse(response) {
        if (response.data && Array.isArray(response.data)) {
            return response.data.map(resource => this.toClientForm(resource));
        } else if (Array.isArray(response)) {
            return response.map(resource => this.toClientForm(resource));
        } else {
            console.warn('Estructura de respuesta no esperada:', response);
            return [];
        }
    }

    static fromFormData(formData) {
        return {
            firstName: formData.firstName || formData.first_name,
            lastName: formData.lastName || formData.last_name,
            dni: formData.dni,
            email: formData.email,
            phone: formData.phone,
            status: formData.status || "Activo",
            company: formData.company || "",
            // Campos adicionales que podrían ser requeridos
            address: formData.address || {
                street: "",
                city: "",
                zipcode: ""
            }
        };
    }

    static toClientFromCreateResponse(response) {
        const data = response.data || response;

        return new ClientEntity(
            data.id,
            data.firstName || data.first_name,
            data.lastName || data.last_name,
            data.phone,
            data.email,
            data.registrationDate || data.registration_date,
            data.dni,
            data.status,
            data.company,
            data.createdAt || data.created_at,
        );
    }

    // Método para simular una respuesta exitosa (útil para testing)
    static createMockResponse(formData) {
        return {
            id: Date.now(), // ID temporal simulado
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            dni: formData.dni,
            status: formData.status || "Activo",
            company: formData.company || "",
            registrationDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
    }
}