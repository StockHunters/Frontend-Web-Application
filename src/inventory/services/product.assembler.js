import { Product } from "../models/product.entity.js";

export class ProductAssembler {
    static toEntityFromResource(resource = {}) {
        return new Product(resource);
    }

    static toEntitiesFromResponse(response = {}) {
        if (!Array.isArray(response.data)) {
            console.warn("La respuesta de productos no es un array:", response);
            return [];
        }

        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
