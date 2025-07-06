import { Product } from "../models/product.entity.js";

export class ProductAssembler {
    /**
     * Convierte un solo recurso plano (objeto JSON) en una entidad Product.
     */
    static toEntityFromResource(resource = {}) {
        return new Product(resource);
    }

    /**
     * Convierte una respuesta API con estructura { data: [...] } en una lista de entidades Product.
     */
    static toEntitiesFromResponse(response = {}) {
        if (!Array.isArray(response.data)) {
            console.warn("La respuesta de productos no es un array:", response);
            return [];
        }

        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
