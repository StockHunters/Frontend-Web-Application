import { ApiService } from "@shared/api/apiServices.js";
import { ClientAssembler } from "@/sales/services/client.assembler.js";

class ClientService extends ApiService {
    constructor() {
        super("client");
    }

    async create(clientData) {
        try {
            const formattedData = ClientAssembler.fromFormData(clientData);
            console.log("📤 Enviando cliente a la API:", formattedData);

            const response = await super.create(formattedData);
            console.log("✅ Cliente creado:", response);

            return response;
        } catch (error) {
            console.error("❌ Error en ClientService.create:", error);

            if (error.response?.status === 404) {
                console.warn("API no soporta POST. Simulando respuesta mock.");
                return ClientAssembler.createMockResponse(clientData);
            }

            throw error;
        }
    }


    async testConnection() {
        try {
            const response = await this.getAll();
            console.log("📡 Estado de conexión exitoso");
            return Array.isArray(response);
        } catch (error) {
            console.error("❌ Error de conexión con la API:", error);
            return false;
        }
    }

    async getApiInfo() {
        try {
            const data = await this.getAll();
            return {
                status: 200,
                url: `/client`,
                dataType: Array.isArray(data) ? "array" : typeof data,
                itemCount: Array.isArray(data) ? data.length : "N/A",
                sampleData: Array.isArray(data) && data.length > 0 ? data[0] : data,
            };
        } catch (error) {
            return {
                error: error.message,
                url: `/client`,
            };
        }
    }

    async createMock(clientData) {
        await new Promise((r) => setTimeout(r, 500));
        const mockResponse = ClientAssembler.createMockResponse(clientData);
        console.log("✅ Cliente mock creado:", mockResponse);
        return mockResponse;
    }
}

export const clientService = new ClientService();
