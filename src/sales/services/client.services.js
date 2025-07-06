import {ApiService} from "@shared/api/apiServices.js";
import {ClientAssembler} from "@/sales/services/client.assembler.js";

export class ClientService extends ApiService{
    constructor() {
        super('clients');
    }

    async create(clientData) {
        try {
            const formattedData = ClientAssembler.fromFormData(clientData);

            console.log('Datos formateados para envío:', formattedData);

            const response = await super.create(formattedData);

            console.log('Respuesta del servidor:', response);

            return response;

        } catch (error) {
            console.error('Error en ClientService.create:', error);

            if (error.response && error.response.status === 404) {
                console.warn('API fake no soporta POST, simulando respuesta exitosa');
                return ClientAssembler.createMockResponse(clientData);
            }

            throw error;
        }
    }

    async getAll() {
        try {
            const response = await super.getAll();
            console.log('Respuesta getAll:', response);
            return response;
        } catch (error) {
            console.error('Error en ClientService.getAll:', error);

            return { data: [] };
        }
    }

    async getById(id) {
        try {
            const response = await super.getById(id);
            console.log('Respuesta getById:', response);
            return response;
        } catch (error) {
            console.error('Error en ClientService.getById:', error);

            return { data: {} };
        }
    }

    async createMock(clientData) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockResponse = ClientAssembler.createMockResponse(clientData);

        console.log('Cliente mock creado:', mockResponse);

        return mockResponse;
    }
}

export const clientService = new ClientService();