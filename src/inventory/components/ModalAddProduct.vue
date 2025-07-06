<script>
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import DropdownButton from "@shared/components/buttons/DropdownButton.vue";
import { tInventory } from "@shared/i18n/i18n.js";
import { productApiService } from "@/inventory/services/product-api.service.js";

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
      error: null,
      saveMode: 'api'
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
      this.saveMode = 'api';
    },

    async handleSubmit() {
      try {
        this.isLoading = true;
        this.error = null;

        if (!this.name || !this.description || this.price <= 0) {
          this.error = "Por favor completa todos los campos obligatorios";
          return;
        }

        if (this.stock < 0) {
          this.error = "El stock no puede ser negativo";
          return;
        }

        const productData = {
          name: this.name,
          description: this.description,
          price: Number(this.price),
          stock: Number(this.stock),
          category: this.category || "Sin categoría",
          batch: this.batch || "",
          image_url: this.image_url || "",
          stock_by_location: null
        };

        console.log('🚀 Intentando guardar producto en tu API:', productData);

        if (this.saveMode === 'api') {
          // FORZAR guardado en API
          try {
            const createdProduct = await productApiService.createProduct(productData);
            console.log('✅ Producto creado exitosamente en tu API:', createdProduct);

            this.resetForm();

            this.$emit('product-added', {
              ...createdProduct,
              isLocal: false,
              source: 'api'
            });

            this.closeModal();

          } catch (apiError) {
            console.error('❌ Error al guardar en tu API:', apiError);

            this.error = `Error al guardar en tu API: ${apiError.message}. ¿Qué quieres hacer?`;
            this.saveMode = 'error';
            return;
          }
        } else if (this.saveMode === 'local') {
          const localProduct = {
            ...productData,
            id: 'local_' + Date.now(),
            created_at: new Date().toISOString(),
            isLocal: true,
            source: 'local'
          };

          console.log('📱 Guardando producto localmente:', localProduct);

          this.resetForm();

          this.$emit('product-added', localProduct);

          this.closeModal();
        }

      } catch (error) {
        console.error('❌ Error general al crear el producto:', error);
        this.error = error.message || 'Error inesperado. Por favor, intenta nuevamente.';
      } finally {
        this.isLoading = false;
      }
    },

    retryApiSave() {
      this.saveMode = 'api';
      this.error = null;
      this.handleSubmit();
    },

    // Forzar guardado local
    forceSaveLocal() {
      this.saveMode = 'local';
      this.error = null;
      this.handleSubmit();
    },

    async testApiConnection() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log('🔍 Probando conexión a tu API...');
        const isConnected = await productApiService.testConnection();

        if (isConnected) {
          this.error = null;
          alert('✅ Conexión exitosa a tu API. Puedes guardar productos.');
        } else {
          this.error = '❌ No se pudo conectar a tu API. Verifica la URL y que el servidor esté funcionando.';
        }
      } catch (error) {
        console.error('❌ Error al probar conexión:', error);
        this.error = `Error de conexión: ${error.message}`;
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
      this.saveMode = 'api';
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

    <!-- Mensaje de error con opciones -->
    <div v-if="error" class="error-message">
      <div class="error-content">
        <p>{{ error }}</p>

        <!-- Opciones cuando falla la API -->
        <div v-if="saveMode === 'error'" class="error-actions">
          <div class="action-buttons">
            <button @click="retryApiSave" class="retry-button">
              🔄 Reintentar API
            </button>
            <button @click="testApiConnection" class="test-button">
              🔧 Probar Conexión
            </button>
            <button @click="forceSaveLocal" class="local-button">
              📱 Guardar Local
            </button>
          </div>
          <p class="error-help">
            <strong>Recomendación:</strong> Verifica que tu API esté funcionando antes de guardar localmente.
          </p>
        </div>
      </div>
      <button @click="clearError" class="error-close">×</button>
    </div>

    <!-- Indicador de modo de guardado -->
    <div class="save-mode-indicator">
      <span class="mode-label">Modo de guardado:</span>
      <span :class="['mode-value', saveMode]">
        {{ saveMode === 'api' ? '🌐 Tu Fake API' : saveMode === 'local' ? '📱 Local' : '⚠️ Error' }}
      </span>
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

      <div class="form-row">
        <input
            v-model="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Precio S/."
            :disabled="isLoading"
            required
            class="price-input"
        />

        <input
            v-model="stock"
            type="number"
            min="0"
            placeholder="Cantidad"
            :disabled="isLoading"
            required
            class="stock-input"
        />
      </div>

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

      <div class="form-actions">
        <GenericButton
            type="submit"
            link=""
            :disabled="isLoading || saveMode === 'error'">
          {{ isLoading ? 'Guardando...' : saveMode === 'api' ? '🌐 Guardar en API' : '📱 Guardar Local' }}
        </GenericButton>

        <GenericButton
            type="button"
            link=""
            variant="secondary"
            @click="testApiConnection"
            :disabled="isLoading">
          🔧 Probar API
        </GenericButton>
      </div>
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
  width: 35%;
  max-width: 600px;
  border-radius: 5px;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: var(--bg-secondary-color);
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
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
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  position: relative;
}

.error-content {
  width: 100%;
}

.error-message p {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.error-actions {
  margin-top: 15px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.retry-button, .test-button, .local-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.retry-button {
  background: #3b82f6;
  color: white;
}

.retry-button:hover {
  background: #2563eb;
}

.test-button {
  background: #f59e0b;
  color: white;
}

.test-button:hover {
  background: #d97706;
}

.local-button {
  background: #10b981;
  color: white;
}

.local-button:hover {
  background: #059669;
}

.error-help {
  font-size: 12px;
  margin: 10px 0 0 0;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.error-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #c33;
}

.save-mode-indicator {
  width: 100%;
  padding: 10px;
  background: var(--bg-primary-color);
  border-radius: 4px;
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.mode-label {
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
}

.mode-value {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.mode-value.api {
  background: #dbeafe;
  color: #1e40af;
}

.mode-value.local {
  background: #d1fae5;
  color: #065f46;
}

.mode-value.error {
  background: #fee2e2;
  color: #991b1b;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.price-input, .stock-input {
  font-weight: 500;
}

.price-input:focus {
  border-color: #4CAF50;
}

.stock-input:focus {
  border-color: #2196F3;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .product-modal {
    width: 95%;
    padding: 30px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
