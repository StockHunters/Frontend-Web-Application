export class ProductAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null

        return {
            id: resource.id,
            name: resource.name,
            description: resource.description,
            price: resource.price,
            stock: resource.stock,
            category: resource.category,
            image_url: resource.image_url,
            batch: resource.batch,
            created_at: resource.created_at,
            stock_by_location: resource.stock_by_location,
        }
    }

    static toEntitiesFromResponse(response) {
        if (!response || !response.data) return []

        return response.data.map((resource) => this.toEntityFromResource(resource))
    }
}
