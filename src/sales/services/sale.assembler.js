import { Sale } from "@/sales/model/sale.entity.js";

export class SaleAssembler {
    static toEntityFromResource(resource) {
        return new Sale({
            id: resource.id,
            date: resource.date,
            product_id: resource.product_id,
            quantity: resource.quantity,
            status: resource.status,
            customer_id: resource.customer_id
        });
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
