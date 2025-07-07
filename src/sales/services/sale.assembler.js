import { Sale } from "@/sales/model/sale.entity.js";

export class SaleAssembler {
    static toEntityFromResource(resource) {
        return new Sale({
            //id: resource.id,
            date: resource.date,
            quantity: resource.quantity,
            status: true,
            productId: resource.productId,
            clientId: resource.clientId,
            userId: resource.userId,
            locationId: 1
        });
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
