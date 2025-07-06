import { ApiService } from "@shared/api/apiServices.js"

export class ProductApiService extends ApiService {
    constructor() {
        super("products") // endpoint: /products

        this.baseURL = "https://fakeapi-3oxx.onrender.com/api"
    }

    // ========== PRODUCTOS ==========
    async getProducts() {
        try {
            console.log("🔍 Intentando obtener productos de tu fake API...")
            console.log("URL:", `${this.baseURL}/products`)

            const response = await fetch(`${this.baseURL}/products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            console.log("📡 Respuesta del servidor:", response.status, response.statusText)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Datos obtenidos de tu API:", data)

            const products = Array.isArray(data) ? data : data.products || data.data || []

            console.log("🔄 Productos procesados:", products.length)
            return products
        } catch (error) {
            console.error("❌ Error al obtener productos de tu API:", error)
            throw error
        }
    }

    async getProductById(id) {
        try {
            console.log(`🔍 Obteniendo producto con ID: ${id}`)
            const response = await fetch(`${this.baseURL}/products/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Producto obtenido:", data)

            return data
        } catch (error) {
            console.error(`❌ Error al obtener producto con ID ${id}:`, error)
            throw error
        }
    }

    async createProduct(productData) {
        try {
            console.log("📤 Enviando producto a tu API:", productData)

            const response = await fetch(`${this.baseURL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })

            console.log("📡 Respuesta del servidor:", response.status, response.statusText)

            if (!response.ok) {
                const errorText = await response.text()
                console.error("❌ Error del servidor:", errorText)
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            console.log("✅ Producto creado exitosamente:", result)

            return result
        } catch (error) {
            console.error("❌ Error al crear producto:", error)
            throw error
        }
    }

    async updateProduct(id, productData) {
        try {
            console.log("📝 Actualizando producto en tu API:", id, productData)

            const response = await fetch(`${this.baseURL}/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            console.log("✅ Producto actualizado:", result)

            return result
        } catch (error) {
            console.error(`❌ Error al actualizar producto con ID ${id}:`, error)
            throw error
        }
    }

    async deleteProduct(id) {
        try {
            console.log("🗑️ Eliminando producto de tu API:", id)

            const response = await fetch(`${this.baseURL}/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
            }

            console.log("✅ Producto eliminado de tu API")
            return { success: true }
        } catch (error) {
            console.error(`❌ Error al eliminar producto con ID ${id}:`, error)
            throw error
        }
    }

    async getProductPrices() {
        try {
            console.log("💰 Obteniendo precios de productos...")
            const response = await fetch(`${this.baseURL}/product_prices`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Precios obtenidos:", data)
            return Array.isArray(data) ? data : data.product_prices || data.data || []
        } catch (error) {
            console.error("❌ Error al obtener precios:", error)
            throw error
        }
    }

    async getProductPriceById(id) {
        try {
            console.log(`💰 Obteniendo precio con ID: ${id}`)
            const response = await fetch(`${this.baseURL}/product_prices/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Precio obtenido:", data)
            return data
        } catch (error) {
            console.error(`❌ Error al obtener precio con ID ${id}:`, error)
            throw error
        }
    }

    async createProductPrice(priceData) {
        try {
            console.log("💰 Creando precio de producto:", priceData)
            const response = await fetch(`${this.baseURL}/product_prices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(priceData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            console.log("✅ Precio creado:", result)
            return result
        } catch (error) {
            console.error("❌ Error al crear precio:", error)
            throw error
        }
    }

    // ========== PROVEEDORES DE PRODUCTOS ==========
    async getProductSuppliers() {
        try {
            console.log("🏭 Obteniendo proveedores de productos...")
            const response = await fetch(`${this.baseURL}/product_suppliers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Proveedores obtenidos:", data)
            return Array.isArray(data) ? data : data.product_suppliers || data.data || []
        } catch (error) {
            console.error("❌ Error al obtener proveedores:", error)
            throw error
        }
    }

    async getProductSupplierById(id) {
        try {
            console.log(`🏭 Obteniendo proveedor con ID: ${id}`)
            const response = await fetch(`${this.baseURL}/product_suppliers/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Proveedor obtenido:", data)
            return data
        } catch (error) {
            console.error(`❌ Error al obtener proveedor con ID ${id}:`, error)
            throw error
        }
    }

    async createProductSupplier(supplierData) {
        try {
            console.log("🏭 Creando proveedor de producto:", supplierData)
            const response = await fetch(`${this.baseURL}/product_suppliers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(supplierData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            console.log("✅ Proveedor creado:", result)
            return result
        } catch (error) {
            console.error("❌ Error al crear proveedor:", error)
            throw error
        }
    }

    // ========== UBICACIONES DE PRODUCTOS ==========
    async getProductLocations() {
        try {
            console.log("📍 Obteniendo ubicaciones de productos...")
            const response = await fetch(`${this.baseURL}/product_locations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Ubicaciones obtenidas:", data)
            return Array.isArray(data) ? data : data.product_locations || data.data || []
        } catch (error) {
            console.error("❌ Error al obtener ubicaciones:", error)
            throw error
        }
    }

    async getProductLocationById(id) {
        try {
            console.log(`📍 Obteniendo ubicación con ID: ${id}`)
            const response = await fetch(`${this.baseURL}/product_locations/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log("✅ Ubicación obtenida:", data)
            return data
        } catch (error) {
            console.error(`❌ Error al obtener ubicación con ID ${id}:`, error)
            throw error
        }
    }

    async createProductLocation(locationData) {
        try {
            console.log("📍 Creando ubicación de producto:", locationData)
            const response = await fetch(`${this.baseURL}/product_locations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(locationData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            console.log("✅ Ubicación creada:", result)
            return result
        } catch (error) {
            console.error("❌ Error al crear ubicación:", error)
            throw error
        }
    }

    async testConnection() {
        try {
            console.log("🔍 Probando conexión a tu fake API...")
            console.log("URL de prueba:", `${this.baseURL}/products`)

            const response = await fetch(`${this.baseURL}/products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            console.log("📡 Estado de la respuesta:", response.status, response.statusText)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log(
                "✅ Conexión exitosa a tu API. Productos encontrados:",
                Array.isArray(data) ? data.length : "Estructura desconocida",
            )
            return true
        } catch (error) {
            console.error("❌ Error de conexión a tu API:", error)
            return false
        }
    }

    async getApiInfo() {
        try {
            const endpoints = [
                { name: "Products", url: `${this.baseURL}/products` },
                { name: "Product Prices", url: `${this.baseURL}/product_prices` },
                { name: "Product Suppliers", url: `${this.baseURL}/product_suppliers` },
                { name: "Product Locations", url: `${this.baseURL}/product_locations` },
            ]

            const results = {}

            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint.url)
                    const data = await response.json()

                    results[endpoint.name] = {
                        status: response.status,
                        url: endpoint.url,
                        dataType: Array.isArray(data) ? "array" : typeof data,
                        itemCount: Array.isArray(data) ? data.length : "N/A",
                        sampleData: Array.isArray(data) && data.length > 0 ? data[0] : data,
                    }
                } catch (error) {
                    results[endpoint.name] = {
                        error: error.message,
                        url: endpoint.url,
                    }
                }
            }

            return results
        } catch (error) {
            return {
                error: error.message,
                baseURL: this.baseURL,
            }
        }
    }

    async getAllData() {
        try {
            console.log("🔄 Obteniendo todos los datos de tu API...")

            const [products, prices, suppliers, locations] = await Promise.allSettled([
                this.getProducts(),
                this.getProductPrices(),
                this.getProductSuppliers(),
                this.getProductLocations(),
            ])

            const result = {
                products: products.status === "fulfilled" ? products.value : [],
                prices: prices.status === "fulfilled" ? prices.value : [],
                suppliers: suppliers.status === "fulfilled" ? suppliers.value : [],
                locations: locations.status === "fulfilled" ? locations.value : [],
                errors: {
                    products: products.status === "rejected" ? products.reason.message : null,
                    prices: prices.status === "rejected" ? prices.reason.message : null,
                    suppliers: suppliers.status === "rejected" ? suppliers.reason.message : null,
                    locations: locations.status === "rejected" ? locations.reason.message : null,
                },
            }

            console.log("✅ Todos los datos obtenidos:", {
                products: result.products.length,
                prices: result.prices.length,
                suppliers: result.suppliers.length,
                locations: result.locations.length,
            })

            return result
        } catch (error) {
            console.error("❌ Error al obtener todos los datos:", error)
            throw error
        }
    }
}

export const productApiService = new ProductApiService()
