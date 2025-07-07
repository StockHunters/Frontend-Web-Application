import { ApiService } from "@shared/api/apiServices.js";

export class ProductApiService extends ApiService {
    constructor() {
        super("products");
    }

    async createProduct(productData) {
        try {
            console.log("📤 Enviando producto a la API:", productData);
            const response = await this.create(productData); // Usa método heredado
            console.log("✅ Producto creado:", response);
            return response;
        } catch (error) {
            console.error("❌ Error en ProductApiService.createProduct:", error);

            if (error.response?.status === 404) {
                console.warn("API no soporta POST. Simulando respuesta mock.");
                return {
                    ...productData,
                    id: `local_${Date.now()}`,
                    created_at: new Date().toISOString(),
                    isLocal: true
                };
            }

            throw error;
        }
    }

    getProductPrices() {
        return http.get("/product_prices");
    }

    getProductPriceById(id) {
        return http.get(`/product_prices/${id}`);
    }

    createProductPrice(data) {
        return http.post("/product_prices", data);
    }

    getProductSuppliers() {
        return http.get("/product_suppliers");
    }

    getProductSupplierById(id) {
        return http.get(`/product_suppliers/${id}`);
    }

    createProductSupplier(data) {
        return http.post("/product_suppliers", data);
    }

    getProductLocations() {
        return http.get("/product_locations");
    }

    getProductLocationById(id) {
        return http.get(`/product_locations/${id}`);
    }

    createProductLocation(data) {
        return http.post("/product_locations", data);
    }

    testConnection() {
        return http.get("/products");
    }

    async getApiInfo() {
        const endpoints = [
            "products",
            "product_prices",
            "product_suppliers",
            "product_locations",
        ];

        const results = {};

        for (const endpoint of endpoints) {
            try {
                const response = await http.get(`/${endpoint}`);
                const data = response.data;

                results[endpoint] = {
                    status: response.status,
                    itemCount: Array.isArray(data) ? data.length : "N/A",
                    sampleData: Array.isArray(data) ? data[0] : data,
                };
            } catch (error) {
                results[endpoint] = { error: error.message };
            }
        }

        return results;
    }

    async getAllData() {
        const [products, prices, suppliers, locations] = await Promise.allSettled([
            this.getAll(),
            this.getProductPrices(),
            this.getProductSuppliers(),
            this.getProductLocations(),
        ]);

        return {
            products: products.status === "fulfilled" ? products.value.data : [],
            prices: prices.status === "fulfilled" ? prices.value.data : [],
            suppliers: suppliers.status === "fulfilled" ? suppliers.value.data : [],
            locations: locations.status === "fulfilled" ? locations.value.data : [],
            errors: {
                products: products.status === "rejected" ? products.reason.message : null,
                prices: prices.status === "rejected" ? prices.reason.message : null,
                suppliers: suppliers.status === "rejected" ? suppliers.reason.message : null,
                locations: locations.status === "rejected" ? locations.reason.message : null,
            },
        };
    }
}

export const productApiService = new ProductApiService();
