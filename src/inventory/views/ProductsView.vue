<script>
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import { tInventory } from "@shared/i18n/i18n.js";
import { productApiService } from "@/inventory/services/product-api.service.js";
import { ProductAssembler } from "@/inventory/services/product.assembler.js";
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
      isLoading: false,
      error: null,
      searchQuery: ''
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
          console.log('Productos locales cargados:', this.localProducts);
        } catch (error) {
          console.error('Error al cargar productos locales:', error);
          this.localProducts = [];
        }
      }
    },

    saveLocalProducts() {
      const productsToSave = this.localProducts.map(p => p.toJson());
      localStorage.setItem('local_products', JSON.stringify(productsToSave));
      console.log('Productos locales guardados:', this.localProducts);
    },

    async fetchProducts() {
      try {
        this.isLoading = true;
        this.error = null;

        this.loadLocalProducts();

        let apiProducts = [];
        try {
          const response = await productApiService.getProducts();
          apiProducts = response.map(p => new Product(
              p.id, p.name, p.description, p.price, p.stock,
              p.category, p.image_url, p.batch, p.created_at, p.stock_by_location
          ));
        } catch (apiError) {
          console.warn('No se pudieron cargar productos de la API:', apiError);
        }

        this.products = [...apiProducts, ...this.localProducts];

        console.log('Productos API:', apiProducts.length);
        console.log('Productos locales:', this.localProducts.length);
        console.log('Total productos mostrados:', this.products.length);

      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = "Error al cargar los productos";
        this.loadLocalProducts();
        this.products = this.localProducts;
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

    async handleProductAdded(newProductData) {
      console.log('=== PRODUCTO AÑADIDO ===');
      console.log('Datos recibidos:', newProductData);

      const localProduct = new Product(
          'local_' + Date.now(),
          newProductData.name,
          newProductData.description,
          newProductData.price,
          newProductData.stock,
          newProductData.category,
          newProductData.image_url,
          newProductData.batch,
          newProductData.created_at
      );

      // Marcar como producto local
      localProduct.isLocal = true;

      console.log('Producto local creado:', localProduct);

      this.localProducts.push(localProduct);
      this.saveLocalProducts();
      this.products.push(localProduct);

      this.closeModal();

      console.log('✅ Producto añadido exitosamente a la lista');
      console.log('Productos totales ahora:', this.products.length);
    },

    async refreshProducts() {
      await this.fetchProducts();
    },

    handleError(error) {
      console.error("Error:", error);
      this.error = error.message || "Ha ocurrido un error";
    },

    clearError() {
      this.error = null;
    },

    clearLocalProducts() {
      this.localProducts = [];
      localStorage.removeItem('local_products');
      this.fetchProducts();
      console.log('Productos locales eliminados');
    },

    deleteProduct(productId) {
      if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        this.localProducts = this.localProducts.filter(p => p.id !== productId);
        this.saveLocalProducts();

        this.products = this.products.filter(p => p.id !== productId);

        console.log('Producto eliminado:', productId);
      }
    }
  },

  mounted() {
    this.fetchProducts();
  }
}
</script>

<template>
  <div class="title-container">
    <h1>Products</h1>
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

  <div v-if="isLoading" class="loading-container">
    <p>Cargando productos...</p>
  </div>

  <div v-else class="products-container">
    <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        :class="{ 'local-product': product.isLocal, 'low-stock': product.isLowStock, 'out-of-stock': product.isOutOfStock }"
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
            v-if="product.isLocal"
            @click="deleteProduct(product.id)"
            class="delete-button"
            title="Eliminar producto"
        >
          🗑️
        </button>

        <GenericButton
            link=""
            variant="color"
        >
          Ver más
        </GenericButton>
      </div>
    </div>

    <!-- Mensaje cuando no hay productos -->
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

  <!-- Modal con overlay -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div @click.stop>
      <ModalAddProduct
          @close="closeModal"
          @product-added="handleProductAdded"
      />
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
  background: #1e3a8a;
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
    flex-direction: column;
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
}
</style>
