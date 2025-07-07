<script>
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import { tInventory } from "@shared/i18n/i18n.js";
import { productApiService } from "@/inventory/services/product-api.service.js";
import ModalAddProduct from "@/inventory/components/ModalAddProduct.vue";
import { Product } from "@/inventory/models/product.entity.js";

export default {
  name: "ProductsView",
  components: { GenericButton, ModalAddProduct },

  data() {
    return {
      products: [],
      localProducts: [],
      showModal: false,
      showDetailModal: false,
      selectedProduct: null,
      isLoading: false,
      error: null,
      searchQuery: '',
      apiConnected: false,
      connectionTested: false,
      apiInfo: null,
      productPrices: [],
      productSuppliers: [],
      productLocations: [],
      showAllData: false
    }
  },

  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products;

      return this.products.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  methods: {
    tInventory,

    loadLocalProducts() {
      const stored = localStorage.getItem('local_products');
      if (stored) {
        try {
          const parsedProducts = JSON.parse(stored);
          this.localProducts = parsedProducts.map(p => new Product(
              p.id, p.name, p.description, p.price, p.stock,
              p.category, p.image_url, p.batch, p.created_at, p.stock_by_location
          ));
          console.log('📦 Productos locales cargados:', this.localProducts.length);
        } catch (error) {
          console.error('❌ Error al cargar productos locales:', error);
          this.localProducts = [];
        }
      }
    },

    saveLocalProducts() {
      const productsToSave = this.localProducts.map(p => p.toJson());
      localStorage.setItem('local_products', JSON.stringify(productsToSave));
      console.log('💾 Productos locales guardados:', this.localProducts.length);
    },

    async testApiConnection() {
      console.log('🔍 Probando conexión a la fake API...');
      this.connectionTested = true;

      try {
        this.apiInfo = await productApiService.getApiInfo();
        console.log('📊 Información completa de tu API:', this.apiInfo);

        const isConnected = await productApiService.testConnection();
        this.apiConnected = isConnected;

        if (isConnected) {
          console.log('✅ Tu fake API está funcionando correctamente');
          this.error = null;
        } else {
          console.log('❌ No se pudo conectar a tu fake API');
          this.error = "No se pudo conectar a tu fake API. Usando modo local.";
        }

        return isConnected;
      } catch (error) {
        console.error('❌ Error al probar conexión:', error);
        this.apiConnected = false;
        this.error = `Error de conexión: ${error.message}`;
        return false;
      }
    },

    async fetchProducts() {
      try {
        this.isLoading = true;
        this.error = null;

        this.loadLocalProducts();

        const isConnected = await this.testApiConnection();

        if (isConnected) {
          try {
            console.log('🔄 Obteniendo productos de tu fake API...');
            const apiProducts = await productApiService.getProducts();

            this.products = apiProducts.map(p => new Product(
                p.id, p.name, p.description, p.price, p.stock,
                p.category, p.image_url, p.batch, p.created_at, p.stock_by_location
            ));

            this.products = [...this.products, ...this.localProducts];

            console.log('✅ Productos cargados desde tu API:', apiProducts.length);
            console.log('📦 Productos locales agregados:', this.localProducts.length);

          } catch (apiError) {
            console.warn('❌ Error al obtener productos de tu API:', apiError);
            this.apiConnected = false;
            this.products = this.localProducts;
            this.error = `Error al cargar productos de tu API: ${apiError.message}`;
          }
        } else {
          this.products = this.localProducts;
          this.error = "Sin conexión a tu fake API. Mostrando productos guardados localmente.";
        }

        console.log('📊 Total productos mostrados:', this.products.length);

      } catch (error) {
        console.error("❌ Error general:", error);
        this.error = `Error al cargar productos: ${error.message}`;
        this.apiConnected = false;
        this.products = this.localProducts;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllData() {
      try {
        this.isLoading = true;
        console.log('🔄 Cargando todos los datos de tu API...');

        const allData = await productApiService.getAllData();

        this.products = allData.products.map(p => new Product(
            p.id, p.name, p.description, p.price, p.stock,
            p.category, p.image_url, p.batch, p.created_at, p.stock_by_location
        ));

        this.productPrices = allData.prices;
        this.productSuppliers = allData.suppliers;
        this.productLocations = allData.locations;

        this.products = [...this.products, ...this.localProducts];

        console.log('✅ Todos los datos cargados:', {
          products: allData.products.length,
          prices: allData.prices.length,
          suppliers: allData.suppliers.length,
          locations: allData.locations.length
        });

        const errors = Object.values(allData.errors).filter(e => e !== null);
        if (errors.length > 0) {
          console.warn('⚠️ Algunos endpoints tuvieron errores:', allData.errors);
        }

      } catch (error) {
        console.error('❌ Error al cargar todos los datos:', error);
        this.error = `Error al cargar datos: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    },

    openModal() {
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    openProductDetails(product) {
      console.log('Abriendo detalles del producto:', product.name);
      this.selectedProduct = product;
      this.showDetailModal = true;
    },

    closeProductDetails() {
      this.showDetailModal = false;
      this.selectedProduct = null;
    },

    async handleProductAdded(newProduct) {
      console.log('=== PRODUCTO AÑADIDO ===');
      console.log('Datos recibidos:', newProduct);

      const productEntity = new Product(
          newProduct.id,
          newProduct.name,
          newProduct.description,
          newProduct.price,
          newProduct.stock,
          newProduct.category,
          newProduct.image_url,
          newProduct.batch,
          newProduct.created_at,
          newProduct.stock_by_location
      );

      if (newProduct.isLocal) {
        productEntity.isLocal = true;
        this.localProducts.push(productEntity);
        this.saveLocalProducts();
      }

      this.products.unshift(productEntity);
      this.closeModal();

      console.log('✅ Producto añadido exitosamente');
    },

    async refreshProducts() {
      console.log('🔄 Refrescando productos desde tu API...');
      await this.fetchProducts();
    },

    clearError() {
      this.error = null;
    },

    clearLocalProducts() {
      this.localProducts = [];
      localStorage.removeItem('local_products');
      this.fetchProducts();
      console.log('🗑️ Productos locales eliminados');
    },
    async createProduct(productData) {
      try {
        const response = await this.create(productData);
        console.log("✅ Producto creado:", response);
        return response;
      } catch (error) {
        console.error("❌ Error al crear producto:", error);

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
    },

    async deleteProduct(productId) {
      if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
      }

      try {
        if (this.apiConnected && !productId.toString().startsWith('local_')) {
          console.log('🗑️ Eliminando producto de tu API:', productId);
          await productApiService.deleteProduct(productId);
          console.log('✅ Producto eliminado de tu API');
        } else {
          console.log('🗑️ Eliminando producto local:', productId);
          this.localProducts = this.localProducts.filter(p => p.id !== productId);
          this.saveLocalProducts();
        }

        this.products = this.products.filter(p => p.id !== productId);
        console.log('✅ Producto eliminado exitosamente');

      } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        this.error = 'Error al eliminar el producto. Intenta nuevamente.';
      }
    },

    getConnectionStatus() {
      if (!this.connectionTested) return '⏳ Conectando...';
      return this.apiConnected ? '🟢' : '🔴';
    },

    async forceApiTest() {
      console.log('🔧 Forzando prueba de tu fake API...');
      await this.testApiConnection();
      if (this.apiConnected) {
        await this.fetchProducts();
      }
    },

    toggleAllData() {
      this.showAllData = !this.showAllData;
    }
  },

  mounted() {
    this.fetchProducts();
  }
}
</script>

<template>
  <div class="title-container">
    <h1>Products <span class="connection-status">{{ getConnectionStatus() }}</span></h1>
    <div class="button-group">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar productos..."
          class="search-input"
      />

      <GenericButton
          link=""
          variant="secondary"
          @click="refreshProducts"
          :disabled="isLoading"
      >
        🔄 {{ isLoading ? 'Cargando...' : 'Actualizar' }}
      </GenericButton>

      <GenericButton
          link=""
          variant="secondary"
          @click="clearLocalProducts"
      >
        🗑️ Limpiar
      </GenericButton>

      <GenericButton
          link=""
          icon="plusCircle"
          @click="openModal"
      ></GenericButton>
    </div>
  </div>

  <div v-if="error" class="error-message">
    <p>{{ error }}</p>
    <GenericButton
        link=""
        variant="secondary"
        @click="clearError"
    >
      Cerrar
    </GenericButton>
  </div>

  <div class="quick-summary">
    <p v-if="productPrices.length"><strong>Precios:</strong> {{ productPrices.length }}</p>
    <p v-if="productSuppliers.length"><strong>Proveedores:</strong> {{ productSuppliers.length }}</p>
    <p v-if="productLocations.length"><strong>Ubicaciones:</strong> {{ productLocations.length }}</p>
  </div>

  <div v-if="isLoading" class="loading-container">
    <p>Cargando datos...</p>
  </div>

  <div v-else class="products-container">
    <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        :class="{
          'local-product': product.isLocal,
          'api-product': !product.isLocal && apiConnected,
          'low-stock': product.isLowStock,
          'out-of-stock': product.isOutOfStock
        }"
    >
      <div class="product-image-container">
        <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            class="product-image"
        />
        <div v-else class="product-image-placeholder">
          📦
        </div>
      </div>

      <div class="product-info">
        <h3 class="product-name">
          {{ product.name }}
          <span v-if="product.isLocal" class="local-badge">📱 Local</span>
        </h3>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-category" v-if="product.category">🏷️ {{ product.category }}</p>
        <p class="product-price">{{ product.formattedPrice }}</p>
        <p class="product-stock" :class="product.stockStatus.class">
          Stock: {{ product.stock }} - {{ product.stockStatus.label }}
        </p>
        <p class="product-batch" v-if="product.batch">Lote: {{ product.batch }}</p>
      </div>

      <div class="product-actions">
        <button
            @click="deleteProduct(product.id)"
            class="delete-button"
            title="Eliminar producto"
        >
          🗑️
        </button>

        <GenericButton
            link=""
            variant="color"
            @click="openProductDetails(product)"
        >
          Ver más
        </GenericButton>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0 && !isLoading" class="no-products">
      <p>{{ searchQuery ? 'No se encontraron productos' : 'No hay productos registrados' }}</p>
      <GenericButton
          link=""
          variant="primary"
          @click="openModal"
      >
        {{ searchQuery ? 'Limpiar búsqueda' : 'Agregar primer producto' }}
      </GenericButton>
    </div>
  </div>

  <!-- Modal para agregar producto -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div @click.stop>
      <ModalAddProduct
          @close="closeModal"
          @product-added="handleProductAdded"
      />
    </div>
  </div>

  <div v-if="showDetailModal && selectedProduct" class="modal-overlay" @click="closeProductDetails">
    <div class="product-detail-modal" @click.stop>
      <GenericButton
          custom-class="btn-close"
          link=""
          icon="close"
          @click="closeProductDetails"
      />

      <div class="detail-header">
        <div class="detail-image-container">
          <img
              v-if="selectedProduct.image_url"
              :src="selectedProduct.image_url"
              :alt="selectedProduct.name"
              class="detail-image"
          />
          <div v-else class="detail-image-placeholder">
            📦
          </div>
        </div>

        <div class="detail-title">
          <h2>{{ selectedProduct.name }}</h2>
          <div class="detail-badges">
            <span :class="['stock-badge', selectedProduct.stockStatus.class]">
              {{ selectedProduct.stockStatus.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="detail-content">
        <div class="detail-section">
          <h3>📝 Descripción</h3>
          <p>{{ selectedProduct.description || 'Sin descripción disponible' }}</p>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">💰 Precio:</span>
            <span class="detail-value price">{{ selectedProduct.formattedPrice }}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">📦 Stock:</span>
            <span class="detail-value" :class="selectedProduct.stockStatus.class">
              {{ selectedProduct.stock }} unidades
            </span>
          </div>

          <div class="detail-item" v-if="selectedProduct.category">
            <span class="detail-label">🏷️ Categoría:</span>
            <span class="detail-value">{{ selectedProduct.category }}</span>
          </div>

          <div class="detail-item" v-if="selectedProduct.batch">
            <span class="detail-label">📋 Lote:</span>
            <span class="detail-value">{{ selectedProduct.batch }}</span>
          </div>

          <div class="detail-item" v-if="selectedProduct.created_at">
            <span class="detail-label">📅 Creado:</span>
            <span class="detail-value">{{ new Date(selectedProduct.created_at).toLocaleDateString() }}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">🆔 ID:</span>
            <span class="detail-value">{{ selectedProduct.id }}</span>
          </div>
        </div>

        <div class="detail-actions">
          <GenericButton
              link=""
              variant="secondary"
              @click="closeProductDetails"
          >
            Cerrar
          </GenericButton>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--primary-color) 1px solid;
  padding: 10px;
}

.connection-status {
  font-size: 14px;
  font-weight: normal;
  margin-left: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary-color);
  color: var(--text-color);
  min-width: 200px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

h1 {
  color: var(--text-color);
}

.quick-summary {
  background: var(--bg-primary-color);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  margin-top: 10px;
}

.quick-summary p {
  margin: 3px 0;
  font-weight: 500;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 30px;
}

.product-card {
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  gap: 15px;
  position: relative;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.local-product {
  border: 2px solid #4CAF50;
  background: linear-gradient(135deg, var(--bg-secondary-color) 0%, rgba(76, 175, 80, 0.1) 100%);
}

.api-product {
  border: 2px solid #2196F3;
  background: linear-gradient(135deg, var(--bg-secondary-color) 0%, rgba(33, 150, 243, 0.1) 100%);
}

.low-stock {
  border-left: 4px solid #ff9800;
}

.out-of-stock {
  border-left: 4px solid #f44336;
  opacity: 0.7;
}

.product-image-container {
  flex-shrink: 0;
}

.product-image,
.product-image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.product-image-placeholder {
  background-color: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.local-badge {
  font-size: 12px;
  background: #4CAF50;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: normal;
}

.api-badge {
  font-size: 12px;
  background: #2196F3;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: normal;
}

.product-description {
  font-size: 14px;
  color: var(--text-color);
  margin: 5px 0;
  opacity: 0.8;
  line-height: 1.4;
}

.product-category {
  font-size: 13px;
  color: var(--primary-color);
  margin: 5px 0;
  font-weight: 500;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #4CAF50;
  margin: 8px 0;
}

.product-stock {
  font-size: 13px;
  margin: 5px 0;
  font-weight: 500;
}

.product-stock.in-stock {
  color: #4CAF50;
}

.product-stock.low-stock {
  color: #ff9800;
}

.product-stock.out-of-stock {
  color: #f44336;
}

.product-batch {
  font-size: 12px;
  color: var(--text-color);
  margin: 5px 0;
  opacity: 0.7;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.delete-button {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.delete-button:hover {
  background: #d32f2f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.3s ease-in-out;
}

.error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message p {
  margin: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  color: var(--text-color);
}

.no-products {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px;
  color: var(--text-color);
  gap: 20px;
}

.no-products p {
  font-size: 18px;
  margin: 0;
}

/* ✅ NUEVOS ESTILOS: Modal de detalles del producto */
.product-detail-modal {
  background-color: var(--bg-secondary-color);
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  color: var(--text-color);
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1;
}

.detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: flex-start;
}

.detail-image-container {
  flex-shrink: 0;
}

.detail-image,
.detail-image-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
}

.detail-image-placeholder {
  background-color: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.detail-title {
  flex: 1;
}

.detail-title h2 {
  margin: 0 0 15px 0;
  font-size: 28px;
  font-weight: bold;
  color: var(--text-color);
}

.detail-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stock-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.stock-badge.in-stock {
  background: #d1fae5;
  color: #065f46;
}

.stock-badge.low-stock {
  background: #fef3c7;
  color: #92400e;
}

.stock-badge.out-of-stock {
  background: #fee2e2;
  color: #991b1b;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.detail-section h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}

.detail-section p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-color);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-primary-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.detail-label {
  font-weight: 500;
  color: var(--text-color);
  opacity: 0.8;
}

.detail-value {
  font-weight: 600;
  color: var(--text-color);
}

.detail-value.price {
  color: #4CAF50;
  font-size: 18px;
}

.detail-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.product-card {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .title-container {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .button-group {
    flex-wrap: wrap;
    gap: 5px;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .products-container {
    grid-template-columns: 1fr;
    padding: 15px;
    gap: 15px;
  }

  .product-card {
    flex-direction: column;
  }

  .product-actions {
    flex-direction: row;
    justify-content: space-between;
  }

  .product-detail-modal {
    width: 95%;
    padding: 20px;
  }

  .detail-header {
    flex-direction: column;
    text-align: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-actions {
    flex-direction: column;
  }
}
</style>
