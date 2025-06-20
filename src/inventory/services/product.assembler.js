import {Product} from "../models/product.entity.js"

export class ProductAssembler {
    static toEntityFromResource(resource) {
        return new Product(resource);
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}