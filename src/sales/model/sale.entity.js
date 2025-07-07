export class Sale {
    constructor({ id = 0, date = '', product_id = 0, quantity = 0, status = '', customer_id = 0 }) {
        this.id = id;
        this.date = date;
        this.product_id = product_id;
        this.quantity = quantity;
        this.status = status;
        this.customer_id = customer_id;
    }

    static createEmpty() {
        return new Sale({});
    }

    toJson() {
        return {
            id: this.id,
            date: this.date instanceof Date
                ? this.date.toISOString().split("T")[0]
                : this.date,
            product_id: this.product_id,
            quantity: this.quantity,
            status: this.status,
            customer_id: this.customer_id
        };
    }
}
