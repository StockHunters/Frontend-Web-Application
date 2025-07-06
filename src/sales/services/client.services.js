import { ApiService } from "@shared/api/apiServices.js"
import { ClientAssembler } from "@/sales/services/client.assembler.js"

export class ClientService extends ApiService {
    constructor() {
        super("clients")

        this.baseURL = "https://fakeapi-3oxx.onrender.com/api"
    }

    async create(clientData) {
        try {
            const formattedData = ClientAssembler.fromFormData(clientData)

            console.log("📤 Enviando cliente a tu fake API:", formattedData)

            const response = await fetch(`${this.baseURL}/clients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log("✅ Cliente creado en tu API:", result)

            return result
        } catch (error) {
            console.error("❌ Error en ClientService.create:", error)

            if (error.response && error.response.status === 404) {
                console.warn("API fake no soporta POST, simulando respuesta exitosa")
                return ClientAssembler.createMockResponse(clientData)
            }

            throw error
        }
    }

    async getAll() {
        try {
            console.log("🔍 Obteniendo clientes de tu fake API...")
            console.log("URL:", `${this.baseURL}/clients`)

            const response = await fetch(`${this.baseURL}/clients`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Clientes obtenidos de tu API:", data)

            return { data: Array.isArray(data) ? data : data.clients || data.data || [] }
        } catch (error) {
            console.error("❌ Error en ClientService.getAll:", error)
            return { data: [] }
        }
    }

    async getById(id) {
        try {
            console.log(`🔍 Obteniendo cliente con ID: ${id}`)

            const response = await fetch(`${this.baseURL}/clients/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Cliente obtenido:", data)

            return { data: data }
        } catch (error) {
            console.error("❌ Error en ClientService.getById:", error)
            return { data: {} }
        }
    }

    async delete(id) {
        try {
            console.log("🗑️ Eliminando cliente de tu API:", id)

            const response = await fetch(`${this.baseURL}/clients/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            console.log("✅ Cliente eliminado de tu API")
            return { success: true }
        } catch (error) {
            console.error("❌ Error al eliminar cliente:", error)
            throw error
        }
    }

    async testConnection() {
        try {
            console.log("🔍 Probando conexión a tu fake API de clientes...")
            console.log("URL de prueba:", `${this.baseURL}/clients`)

            const response = await fetch(`${this.baseURL}/clients`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            console.log("📡 Estado de la respuesta:", response.status, response.statusText)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log(
                "✅ Conexión exitosa a tu API de clientes. Clientes encontrados:",
                Array.isArray(data) ? data.length : "Estructura desconocida",
            )
            return true
        } catch (error) {
            console.error("❌ Error de conexión a tu API de clientes:", error)
            return false
        }
    }

    async getApiInfo() {
        try {
            const response = await fetch(`${this.baseURL}/clients`)
            const data = await response.json()

            return {
                status: response.status,
                url: `${this.baseURL}/clients`,
                dataType: Array.isArray(data) ? "array" : typeof data,
                itemCount: Array.isArray(data) ? data.length : "N/A",
                sampleData: Array.isArray(data) && data.length > 0 ? data[0] : data,
            }
        } catch (error) {
            return {
                error: error.message,
                url: `${this.baseURL}/clients`,
            }
        }
    }

    async createMock(clientData) {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockResponse = ClientAssembler.createMockResponse(clientData)

        console.log("Cliente mock creado:", mockResponse)

        return mockResponse
    }
}

export const clientService = new ClientService()
