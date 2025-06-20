import {ApiService} from "@shared/api/apiServices.js";

export class ProductApiService extends ApiService {
    constructor() {
        super('products');
    }

    async getProducts() {
        try {
            const response = await super.getAll();
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }
}

export const productApiService = new ProductApiService();