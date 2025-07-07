export class Sale {
    constructor({ id = 0, date = '', productId = 0, clientId = 0, locationId = 0, quantity = 0, status = '', userId = 0 }) {
        this.id = id;
        this.date = date;
        this.quantity = quantity;
        this.status = true;
        this.product_id = productId;
        this.customer_id = clientId;
        this.location_id = 1;
        this.user_id = userId;
    }
    static createEmpty() {
        return new Sale({});
    }

    toJson() {
        return {
            id: this.id,
            date: this.date instanceof Date ? this.date.toISOString() : this.date,
            quantity: this.quantity,
            status: true,
            productId: this.product_id,
            clientId: this.customer_id,
            userId: this.user_id,
            locationId: 1
        };
    }
}
