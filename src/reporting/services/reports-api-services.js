import {ApiService} from "@shared/api/apiServices.js";

export class ReportsApiServices extends ApiService {
    constructor() {
        super('purchase_order_items');
    }

    async getProductsOrderItems() {
        try {
            const response = await super.getAll();
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }
}

export const reportsApiServices = new ReportsApiServices();