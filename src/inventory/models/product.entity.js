export class Product {
    constructor(
        id = null,
        name = "",
        description = "",
        price = 0,
        stock = 0,
        category = "",
        image_url = "",
        batch = "",
        created_at = null,
        stock_by_location = null,
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.stock = stock
        this.category = category
        this.image_url = image_url
        this.batch = batch
        this.created_at = created_at
        this.stock_by_location = stock_by_location
    }

    get formattedPrice() {
        return `S/. ${Number(this.price || 0).toFixed(2)}`
    }

    get stockStatus() {
        if (this.stock === 0) return { label: "Sin stock", class: "out-of-stock" }
        if (this.stock <= 5) return { label: "Stock bajo", class: "low-stock" }
        return { label: "En stock", class: "in-stock" }
    }

    get isLowStock() {
        return this.stock <= 5
    }

    get isOutOfStock() {
        return this.stock === 0
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            stock: this.stock,
            category: this.category,
            image_url: this.image_url,
            batch: this.batch,
            created_at: this.created_at,
            stock_by_location: this.stock_by_location,
        }
    }

    static createEmpty() {
        return new Product()
    }

    isValid() {
        return this.name.trim() !== "" && this.description.trim() !== "" && this.price > 0 && this.stock >= 0
    }
}
