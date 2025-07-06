<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import { ShoppingCart, Eye, Package, Trash2 } from 'lucide-vue-next';

export default {
  name: "ProductCard",
  components: {
    Card,
    Button,
    Badge,
    ShoppingCart,
    Eye,
    Package,
    Trash2
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imageLoaded: false,
      imageError: false,
      showDeleteButton: false
    };
  },
  computed: {
    stockStatus() {
      if (this.product.stock === 0) return { label: 'Sin stock', severity: 'danger' };
      if (this.product.stock <= 5) return { label: 'Stock bajo', severity: 'warning' };
      return { label: 'En stock', severity: 'success' };
    },
    formattedPrice() {
      return `S/. ${Number(this.product.price || 0).toFixed(2)}`;
    }
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    onImageLoad() {
      this.imageLoaded = true;
    },
    onImageError() {
      this.imageError = true;
    },
    addToCart() {
      this.$emit('add-to-cart', this.product);
    },
    deleteProduct() {
      this.$emit('delete-product', this.product.id);
    }
  }
};
</script>

<template>
  <div
      class="product-card"
      @mouseenter="showDeleteButton = true"
      @mouseleave="showDeleteButton = false"
  >
    <div class="product-image-container">
      <img
          v-if="!imageError && product.image_url"
          :src="product.image_url"
          :alt="product.name"
          class="product-image"
          @error="onImageError"
      />
      <div v-else class="product-image-placeholder"></div>
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <p class="product-category">{{ product.category }}</p>
      <p class="product-price">s/ {{ Number(product.price || 0).toFixed(2) }}</p>
    </div>

    <div class="product-stock-badge">
      {{ product.stock }}
    </div>

    <!-- Botón de eliminar -->
    <Transition name="delete-button">
      <button
          v-if="showDeleteButton"
          @click="deleteProduct"
          class="delete-button"
          title="Eliminar producto"
      >
        <Trash2 :size="16" />
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  gap: 16px;
  transition: box-shadow 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  flex-shrink: 0;
}

.product-image,
.product-image-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.product-image-placeholder {
  background-color: #d1d5db;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.product-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.product-category {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.product-price {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
  margin: 0;
}

.product-stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.delete-button {
  position: absolute;
  top: 12px;
  right: 50px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.delete-button:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.delete-button:active {
  transform: scale(0.95);
}

.delete-button-enter-active,
.delete-button-leave-active {
  transition: all 0.2s ease;
}

.delete-button-enter-from,
.delete-button-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.delete-button-enter-to,
.delete-button-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
