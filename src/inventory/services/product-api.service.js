import { ApiService } from "@shared/api/apiServices.js";
import { ProductAssembler } from "../services/product.assembler.js";

export class ProductApiService extends ApiService {
    constructor() {
        super('products'); // endpoint base: /products
    }

    async getProducts() {
        try {
            const response = await super.getAll();
            return ProductAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const response = await super.getById(id);
            return ProductAssembler.toEntityFromResource(response.data);
        } catch (error) {
            console.error(`Error al obtener producto con ID ${id}:`, error);
            throw error;
        }
    }
}

export const productApiService = new ProductApiService();
