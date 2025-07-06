<script>
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import DropdownButton from "@shared/components/buttons/DropdownButton.vue";
import { tInventory } from "@shared/i18n/i18n.js";

export default {
  name: "ModalAddProduct",
  emits: ['close', 'product-added'],
  components: { GenericButton, DropdownButton },

  data() {
    return {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      batch: "",
      image_url: "",
      isLoading: false,
      error: null
    }
  },

  computed: {
    categoryItems() {
      return [
        { label: "Electrónicos" },
        { label: "Ropa" },
        { label: "Hogar" },
        { label: "Deportes" },
        { label: "Libros" },
        { label: "Otros" }
      ]
    }
  },

  methods: {
    tInventory,

    resetForm() {
      this.name = "";
      this.description = "";
      this.price = 0;
      this.stock = 0;
      this.category = "";
      this.batch = "";
      this.image_url = "";
      this.isLoading = false;
      this.error = null;
    },

    async handleSubmit() {
      try {
        this.isLoading = true;
        this.error = null;

        // Validar campos obligatorios
        if (!this.name || !this.description || this.price <= 0) {
          this.error = "Por favor completa todos los campos obligatorios";
          return;
        }

        if (this.stock < 0) {
          this.error = "El stock no puede ser negativo";
          return;
        }

        // Preparar datos del producto
        const productData = {
          name: this.name,
          description: this.description,
          price: Number(this.price),
          stock: Number(this.stock),
          category: this.category || "Sin categoría",
          batch: this.batch || "",
          image_url: this.image_url || "",
          created_at: new Date().toISOString()
        };

        console.log('Enviando datos del producto:', productData);

        // Resetear el formulario
        this.resetForm();

        // Emitir evento para notificar que se agregó un producto
        this.$emit('product-added', productData);

        // Cerrar el modal
        this.closeModal();

      } catch (error) {
        console.error('Error al crear el producto:', error);
        this.error = error.message || 'Error al crear el producto. Por favor, intenta nuevamente.';
      } finally {
        this.isLoading = false;
      }
    },

    dropDownSelect(label) {
      this.category = label;
    },

    closeModal() {
      this.$emit('close');
    },

    clearError() {
      this.error = null;
    }
  }
}
</script>

<template>
  <div class="product-modal">
    <GenericButton
        custom-class="btn-close"
        link=""
        icon="close"
        @click="closeModal"
    />
    <h2>Agregar Nuevo Producto</h2>

    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="clearError" class="error-close">×</button>
    </div>

    <form @submit.prevent="handleSubmit">
      <input
          v-model="name"
          type="text"
          placeholder="Nombre del producto"
          :disabled="isLoading"
          required
      />

      <textarea
          v-model="description"
          placeholder="Descripción del producto"
          :disabled="isLoading"
          rows="3"
          required
      ></textarea>

      <input
          v-model="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Precio (S/.)"
          :disabled="isLoading"
          required
      />

      <input
          v-model="stock"
          type="number"
          min="0"
          placeholder="Cantidad en stock"
          :disabled="isLoading"
          required
      />

      <DropdownButton
          v-model="category"
          :items="categoryItems"
          :disabled="isLoading"
          @select="dropDownSelect">
        Seleccionar categoría
      </DropdownButton>

      <input
          v-model="batch"
          type="text"
          placeholder="Lote (opcional)"
          :disabled="isLoading"
      />

      <input
          v-model="image_url"
          type="url"
          placeholder="URL de imagen (opcional)"
          :disabled="isLoading"
      />

      <GenericButton
          type="submit"
          link=""
          :disabled="isLoading">
        {{ isLoading ? 'Guardando...' : 'Guardar Producto' }}
      </GenericButton>
    </form>
  </div>
</template>

<style scoped>
.product-modal {
  color: var(--text-color);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  max-width: 500px;
  border-radius: 5px;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: var(--bg-secondary-color);
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-close {
  position: absolute;
  top: 20px;
  right: 20px;
}

.error-message {
  width: 100%;
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.error-message p {
  margin: 0;
  font-size: 14px;
}

.error-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #c33;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, textarea {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary-color);
  color: var(--text-color);
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

input:disabled, textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

@media (max-width: 768px) {
  .product-modal {
    width: 90%;
    padding: 30px;
  }
}
</style>
