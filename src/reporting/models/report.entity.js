export class Report {
    constructor({
                    dailySales = [],
                    totalSales = 0,
                    totalTransactions = 0,
                    topProducts = [],
                    bottomProducts = [],
                    totalInventory = 0
                }) {
        this.dailySales = dailySales;
        this.totalSales = totalSales;
        this.totalTransactions = totalTransactions;
        this.topProducts = topProducts;
        this.bottomProducts = bottomProducts;
        this.totalInventory = totalInventory;
    }

    toJson() {
        return {
            dailySales: this.dailySales,
            totalSales: this.totalSales,
            totalTransactions: this.totalTransactions,
            topProducts: this.topProducts,
            bottomProducts: this.bottomProducts,
            totalInventory: this.totalInventory
        };
    }

    static createEmpty() {
        return new Report({});
    }
}

export class DailySale {
    constructor({ day = '', sales = 0, transactions = 0 }) {
        this.day = day;
        this.sales = sales;
        this.transactions = transactions;
    }
}

export class ProductSale {
    constructor({ name = '', quantity = 0, sales = 0 }) {
        this.name = name;
        this.quantity = quantity;
        this.sales = sales;
    }
}