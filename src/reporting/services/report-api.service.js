import { ApiService } from "@shared/api/apiServices.js";

export class ReportApiService extends ApiService {
    constructor() {
        super('reports');
    }

    async getDailySales() {
        try {
            const response = await super.get('daily-sales');
            return response.data;
        } catch (error) {
            console.error('Error al obtener ventas diarias:', error);
            throw error;
        }
    }

    async getTopProducts() {
        try {
            const response = await super.get('top-products');
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos más vendidos:', error);
            throw error;
        }
    }

    async getBottomProducts() {
        try {
            const response = await super.get('bottom-products');
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos menos vendidos:', error);
            throw error;
        }
    }

    async getInventorySummary() {
        try {
            const response = await super.get('inventory-summary');
            return response.data;
        } catch (error) {
            console.error('Error al obtener resumen de inventario:', error);
            throw error;
        }
    }

    async getAllReports() {
        try {
            const [dailySales, topProducts, bottomProducts, inventorySummary] = await Promise.all([
                this.getDailySales(),
                this.getTopProducts(),
                this.getBottomProducts(),
                this.getInventorySummary()
            ]);

            return {
                dailySales,
                topProducts,
                bottomProducts,
                inventorySummary
            };
        } catch (error) {
            console.error('Error al obtener todos los reportes:', error);
            throw error;
        }
    }
}

export const reportApiService = new ReportApiService();