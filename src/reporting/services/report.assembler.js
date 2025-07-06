import { Report, DailySale, ProductSale } from "../models/report.entity.js";

export class ReportAssembler {
    static toReportEntity(reportData) {
        return new Report({
            dailySales: reportData.dailySales?.map(sale => new DailySale(sale)) || [],
            totalSales: reportData.totalSales || 0,
            totalTransactions: reportData.totalTransactions || 0,
            topProducts: reportData.topProducts?.map(product => new ProductSale(product)) || [],
            bottomProducts: reportData.bottomProducts?.map(product => new ProductSale(product)) || [],
            totalInventory: reportData.totalInventory || 0
        });
    }

    static transformDailySalesForChart(dailySales) {
        return dailySales.map(sale => ({
            day: sale.day,
            sales: sale.sales,
            transactions: sale.transactions
        }));
    }

    static transformProductsForTable(products) {
        return products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            sales: product.sales
        }));
    }

    static calculateTotalSales(dailySales) {
        return dailySales.reduce((total, sale) => total + sale.sales, 0);
    }

    static calculateTotalTransactions(dailySales) {
        return dailySales.reduce((total, sale) => total + sale.transactions, 0);
    }
}