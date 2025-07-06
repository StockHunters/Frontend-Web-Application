<script>
import DropdownButton from "@shared/components/buttons/DropdownButton.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import { tSales } from "@shared/i18n/i18n.js";
import { clientService } from "@/sales/services/client.services.js";

export default {
  name: "ModalAddClient",
  emits: ['close', 'client-added'],
  components: { GenericButton, DropdownButton },

  data() {
    return {
      firstname: "",
      lastname: "",
      dni: "",
      email: "",
      phone: "",
      status: "",
      company: "",
      isLoading: false,
      error: null,
      saveMode: 'api'
    }
  },

  computed: {
    Items() {
      return [
        { label: "Activo" },
        { label: "Inactivo" },
      ]
    }
  },

  methods: {
    tSales,

    resetForm() {
      this.firstname = "";
      this.lastname = "";
      this.dni = "";
      this.email = "";
      this.phone = "";
      this.status = "";
      this.company = "";
      this.isLoading = false;
      this.error = null;
      this.saveMode = 'api';
    },

    async handleSubmit() {
      try {
        this.isLoading = true;
        this.error = null;

        if (!this.firstname || !this.lastname || !this.email || !this.phone) {
          this.error = "Por favor completa todos los campos obligatorios";
          return;
        }

        const clientData = {
          firstName: this.firstname,
          lastName: this.lastname,
          email: this.email,
          phone: this.phone,
          dni: this.dni || "",
          status: this.status || "Activo",
          company: this.company || "",
          address: {
            street: "",
            city: "",
            zipcode: ""
          }
        };

        console.log('🚀 Intentando guardar cliente en tu API:', clientData);

        if (this.saveMode === 'api') {
          // guardado en api
          try {
            const createdClient = await clientService.create(clientData);
            console.log('✅ Cliente creado exitosamente en tu API:', createdClient);

            this.resetForm();

            this.$emit('client-added', {
              ...createdClient,
              isLocal: false,
              source: 'api'
            });

            this.closeModal();

          } catch (apiError) {
            console.error('❌ Error al guardar en tu API:', apiError);

            this.error = `Error al guardar en tu API: ${apiError.message}. ¿Qué quieres hacer?`;
            this.saveMode = 'error'; // Cambiar a modo error para mostrar opciones
            return;
          }
        } else if (this.saveMode === 'local') {
          const localClient = {
            ...clientData,
            id: 'local_' + Date.now(),
            registration_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            isLocal: true,
            source: 'local'
          };

          console.log('📱 Guardando cliente localmente:', localClient);

          this.resetForm();

          this.$emit('client-added', localClient);

          this.closeModal();
        }

      } catch (error) {
        console.error('❌ Error general al crear el cliente:', error);
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

    forceSaveLocal() {
      this.saveMode = 'local';
      this.error = null;
      this.handleSubmit();
    },

    async testApiConnection() {
      try {
        this.isLoading = true;
        this.error = null;

        console.log('🔍 Probando conexión a tu API de clientes...');
        const isConnected = await clientService.testConnection();

        if (isConnected) {
          this.error = null;
          alert('✅ Conexión exitosa a tu API de clientes. Puedes guardar clientes.');
        } else {
          this.error = '❌ No se pudo conectar a tu API de clientes. Verifica la URL y que el servidor esté funcionando.';
        }
      } catch (error) {
        console.error('❌ Error al probar conexión:', error);
        this.error = `Error de conexión: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    },

    dropDownSelect(label) {
      this.status = label;
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
  <div class="client-modal">
    <GenericButton
        custom-class="btn-close"
        link=""
        icon="close"
        @click="closeModal"
    />
    <h2>{{ tSales('clients.modal.title') }}</h2>

    <div v-if="error" class="error-message">
      <div class="error-content">
        <p>{{ error }}</p>

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

    <div class="save-mode-indicator">
      <span class="mode-label">Modo de guardado:</span>
      <span :class="['mode-value', saveMode]">
        {{ saveMode === 'api' ? '🌐 Tu Fake API' : saveMode === 'local' ? '📱 Local' : '⚠️ Error' }}
      </span>
    </div>

    <form @submit.prevent="handleSubmit">
      <input
          v-model="firstname"
          type="text"
          :placeholder="$t('ui.form.placeholder.name')"
          :disabled="isLoading"
          required
      />

      <input
          v-model="lastname"
          type="text"
          :placeholder="$t('ui.form.placeholder.lastname')"
          :disabled="isLoading"
          required
      />

      <input
          v-model="dni"
          type="text"
          :placeholder="$t('ui.form.placeholder.dni')"
          :disabled="isLoading"
      />

      <input
          v-model="email"
          type="email"
          :placeholder="$t('ui.form.placeholder.mail')"
          :disabled="isLoading"
          required
      />

      <input
          v-model="phone"
          type="tel"
          :placeholder="$t('ui.form.placeholder.phone')"
          :disabled="isLoading"
          required
      />

      <DropdownButton
          v-model="status"
          :items="Items"
          :disabled="isLoading"
          @select="dropDownSelect">
        {{ $t('ui.form.placeholder.status') }}
      </DropdownButton>

      <input
          v-model="company"
          type="text"
          :placeholder="$t('ui.form.placeholder.company')"
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
.client-modal {
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

input {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary-color);
  color: var(--text-color);
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .client-modal {
    width: 95%;
    padding: 30px 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
