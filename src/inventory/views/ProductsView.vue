<script>
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import {tInventory} from "@shared/i18n/i18n.js";
import ProductCard from "@/inventory/components/product-card.component.vue";
import { productApiService} from "@/inventory/services/product-api.service.js"
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';

export default {
  name: "ProductsView",
  methods: {
    tInventory,
    filterProducts() {
      this.filteredProducts = this.products.filter(product => {
        const categoryMatch = !this.selectedCategory || product.category === this.selectedCategory;
        const priceMatch = product.price >= this.priceRange.min && product.price <= this.priceRange.max;
        const stockMatch = !this.stockAvailable || product.stock > 0;
        return categoryMatch && priceMatch && stockMatch;
      });
    }
  },
  components: {
    ProductCard,
    GenericButton,
    Dropdown,
    InputNumber,
    InputSwitch
  },
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: true,
      error: null,
      categories: [],
      selectedCategory: null,
      priceRange: { min: 0, max: 10000 },
      stockAvailable: false
    };
  },
  async mounted() {
    try {
      this.products = await productApiService.getProducts();
      this.filteredProducts = this.products;
      this.categories = [...new Set(this.products.map(p => p.category))];
    } catch (err) {
      this.error = 'Error al cargar los productos.';
    } finally {
      this.loading = false;
    }
  }
}
</script>

<template>
  <div class="title-container">
    <h1>{{tInventory('products.title')}}</h1>
    <GenericButton link="" icon="plusCircle"></GenericButton>
  </div>

  <div>
    <div style="margin-bottom: 20px;">
      <Dropdown
          v-model="selectedCategory"
          :options="categories"
          placeholder="Selecciona una categoría"
          @change="filterProducts"
      />
      <InputNumber
          v-model="priceRange.min"
          placeholder="Precio mínimo"
          @input="filterProducts"
      />
      <InputNumber
          v-model="priceRange.max"
          placeholder="Precio máximo"
          @input="filterProducts"
      />
      <InputSwitch
          v-model="stockAvailable"
          @change="filterProducts"
      /> Solo productos en stock
    </div>

    <!-- Mostrar productos -->
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="catalog">
      <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
      />
    </div>
  </div>

</template>

<style scoped>
.title-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: var(--primary-color) 1px solid;
  padding: 10px;
}

.catalog {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
}

h1{
  color: var(--text-color);
}
</style>