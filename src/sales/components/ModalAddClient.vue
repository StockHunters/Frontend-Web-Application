<script>
import DropdownButton from "@shared/components/buttons/DropdownButton.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import {tSales} from "@shared/i18n/i18n.js";
import {clientService} from "@/sales/services/client.services.js";
import {ClientAssembler} from "@/sales/services/client.assembler.js";

export default {
  name: "ModalAddClient",
  emits: ['close', 'client-added'],
  methods: {
    tSales,
    resetForm(){
      this.firstname = "";
      this.lastname = "";
      this.dni = "";
      this.email = "";
      this.phone = "";
      this.status = "";
      this.company = "";
      this.isLoading = false;
      this.error = null;
    },
    async handleSubmit() {
      try {
        this.isLoading = true;
        this.error = null;

        // Validar campos obligatorios
        if (!this.firstname || !this.lastname || !this.email || !this.phone) {
          this.error = "Por favor completa todos los campos obligatorios";
          return;
        }

        // Preparar datos según el formato esperado por la API
        const clientData = {
          firstName: this.firstname,  // Cambio de first_name a firstName
          lastName: this.lastname,    // Cambio de last_name a lastName
          email: this.email,
          phone: this.phone,
          // Campos opcionales específicos para tu aplicación
          dni: this.dni,
          status: this.status || "Activo",
          company: this.company || "",
          // Agregar campos que podrían ser requeridos por la API
          address: {
            street: "",
            city: "",
            zipcode: ""
          }
        };

        console.log('Enviando datos del cliente:', clientData);

        // Llamar al servicio para crear el cliente
        const response = await clientService.create(clientData);

        console.log('Cliente creado exitosamente:', response);

        // Resetear el formulario
        this.resetForm();

        // Emitir evento para notificar que se agregó un cliente
        this.$emit('client-added', response);

        // Cerrar el modal
        this.closeModal();

      } catch (error) {
        console.error('Error al crear el cliente:', error);

        // Manejar diferentes tipos de errores
        if (error.response) {
          // Error de respuesta del servidor
          this.error = `Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Error desconocido'}`;
        } else if (error.request) {
          // Error de red
          this.error = 'Error de conexión. Verifica tu conexión a internet.';
        } else {
          // Otro tipo de error
          this.error = error.message || 'Error al crear el cliente. Por favor, intenta nuevamente.';
        }
      } finally {
        this.isLoading = false;
      }
    },

    dropDownSelect(label){
      this.status = label;
    },

    closeModal() {
      this.$emit('close');
    },

    clearError() {
      this.error = null;
    }
  },
  components: {GenericButton, DropdownButton},
  data(){
    return{
      firstname: "",
      lastname: "",
      dni: "",
      email: "",
      phone: "",
      status: "",
      company: "",
      isLoading: false,
      error: null
    }
  },
  computed:{
    Items() {
      return [
        { label: "Activo"},
        { label: "Inactivo" },
      ]
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

    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="clearError" class="error-close">×</button>
    </div>

    <form @submit.prevent="handleSubmit">
      <input v-model="firstname"
             type="text"
             :placeholder="$t('ui.form.placeholder.name')"
             :disabled="isLoading"
             required>

      <input v-model="lastname"
             type="text"
             :placeholder="$t('ui.form.placeholder.lastname')"
             :disabled="isLoading"
             required>

      <input v-model="dni"
             type="text"
             :placeholder="$t('ui.form.placeholder.dni')"
             :disabled="isLoading">

      <input v-model="email"
             type="email"
             :placeholder="$t('ui.form.placeholder.mail')"
             :disabled="isLoading"
             required>

      <input v-model="phone"
             type="tel"
             :placeholder="$t('ui.form.placeholder.phone')"
             :disabled="isLoading"
             required>

      <DropdownButton
          v-model="status"
          :items="Items"
          :disabled="isLoading"
          @select="dropDownSelect">
        {{$t('ui.form.placeholder.status')}}
      </DropdownButton>

      <input v-model="company"
             type="text"
             :placeholder="$t('ui.form.placeholder.company')"
             :disabled="isLoading">

      <GenericButton
          type="submit"
          link=""
          :disabled="isLoading">
        {{ isLoading ? 'Guardando...' : 'Guardar' }}
      </GenericButton>
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

.btn-close{
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

@media (max-width: 768px) {
  .client-modal {
    width: 90%;
    padding: 30px;
  }
}
</style>