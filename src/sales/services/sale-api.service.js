import { ApiService } from "@shared/api/apiServices.js";

export class SaleApiService extends ApiService {
    constructor() {
        super("sales");
    }

    getCompletedSales() {
        return super.getAll({status: "completed"});
    }
}

export const saleApiService = new SaleApiService();
