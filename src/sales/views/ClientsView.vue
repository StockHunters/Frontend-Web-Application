<script>
import {tSales} from "@shared/i18n/i18n.js";
import ClientItem from "@/sales/components/ClientItem.vue";
import {clientService} from "@/sales/services/client.services.js";
import {ClientAssembler} from "@/sales/services/client.assembler.js";
import DropdownButton from "@shared/components/buttons/DropdownButton.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import ModalAddClient from "@/sales/components/ModalAddClient.vue";

export default {
  name: "ClientsView",
  components: {ModalAddClient, GenericButton, DropdownButton, ClientItem},
  data(){
    return {
      clients: [],
      localClients: [], // Clientes guardados localmente
      showModal: false,
      isLoading: false,
      error: null
    }
  },
  methods: {
    tSales,

    // Cargar clientes locales del almacenamiento
    loadLocalClients() {
      const stored = localStorage.getItem('local_clients');
      if (stored) {
        try {
          this.localClients = JSON.parse(stored);
          console.log('Clientes locales cargados:', this.localClients);
        } catch (error) {
          console.error('Error al cargar clientes locales:', error);
          this.localClients = [];
        }
      }
    },

    saveLocalClients() {
      localStorage.setItem('local_clients', JSON.stringify(this.localClients));
      console.log('Clientes locales guardados:', this.localClients);
    },

    // Obtener clientes de la API y combinar con locales
    async fetchClients() {
      try {
        this.isLoading = true;
        this.error = null;

        // Cargar clientes locales
        this.loadLocalClients();

        // Intentar obtener clientes de la API
        let apiClients = [];
        try {
          const response = await clientService.getAll();
          apiClients = await ClientAssembler.toEntityFromResponse(response);
        } catch (apiError) {
          console.warn('No se pudieron cargar clientes de la API:', apiError);
          // Continuar solo con clientes locales
        }

        // Combinar clientes de API y locales
        this.clients = [...apiClients, ...this.localClients];

        console.log('Clientes API:', apiClients.length);
        console.log('Clientes locales:', this.localClients.length);
        console.log('Total clientes mostrados:', this.clients.length);

      } catch (error) {
        console.error("Error fetching clients:", error);
        this.error = "Error al cargar los clientes";
        // En caso de error, mostrar al menos los clientes locales
        this.loadLocalClients();
        this.clients = this.localClients;
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

    async handleClientAdded(newClient) {
      console.log('=== CLIENTE AÑADIDO ===');
      console.log('Datos recibidos:', newClient);

      const localClient = {
        id: 'local_' + Date.now(),
        firstName: newClient.firstName || newClient.first_name,
        lastName: newClient.lastName || newClient.last_name,
        email: newClient.email,
        phone: newClient.phone,
        dni: newClient.dni,
        status: newClient.status || 'Activo' || 'Inactivo',
        company: newClient.company || '',
        registration_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        isLocal: true // Marcar como cliente local
      };

      console.log('Cliente local creado:', localClient);

      this.localClients.push(localClient);

      this.saveLocalClients();

      this.clients.push(localClient);

      this.closeModal();

      console.log('✅ Cliente añadido exitosamente a la lista');
      console.log('Clientes totales ahora:', this.clients.length);
    },

    async refreshClients() {
      await this.fetchClients();
    },

    handleError(error) {
      console.error("Error:", error);
      this.error = error.message || "Ha ocurrido un error";
    },

    clearError() {
      this.error = null;
    },

    debugClients() {
      console.log('=== DEBUG CLIENTES ===');
      console.log('Clientes mostrados:', this.clients);
      console.log('Clientes locales:', this.localClients);
      console.log('localStorage:', localStorage.getItem('local_clients'));
    },

    clearLocalClients() {
      this.localClients = [];
      localStorage.removeItem('local_clients');
      this.fetchClients();
      console.log('Clientes locales eliminados');
    }
  },

  mounted() {
    this.fetchClients();
  }
}
</script>

<template>
  <div class="title-container">
    <h1>{{tSales('clients.title')}}</h1>
    <div class="button-group">

      <GenericButton
          link=""
          variant="secondary"
          @click="clearLocalClients"
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
    <p>Cargando clientes...</p>
  </div>

  <div v-else class="clients-container">
    <div
        v-for="client in clients"
        :key="client.id"
        class="client-card"
        :class="{ 'local-client': client.isLocal }"
    >
      <div class="client-info">
        <h3 class="client-name">
          {{ client.firstName }} {{ client.lastName }}
          <span v-if="client.isLocal" class="local-badge">📱 Local</span>
        </h3>
        <p class="client-email">{{ client.email }}</p>
        <p class="client-phone" v-if="client.phone">📞 {{ client.phone }}</p>
        <p class="client-company" v-if="client.company">🏢 {{ client.company }}</p>
        <p class="client-status">Estado: {{ client.status }}</p>
      </div>

      <div class="client-actions">
        <GenericButton
            link=""
            variant="color"
        >
          {{$t('ui.button.more')}}
        </GenericButton>
      </div>
    </div>

    <!-- Mensaje cuando no hay clientes -->
    <div v-if="clients.length === 0 && !isLoading" class="no-clients">
      <p>No hay clientes registrados</p>
      <GenericButton
          link=""
          variant="primary"
          @click="openModal"
      >
        Agregar primer cliente
      </GenericButton>
    </div>
  </div>

  <!-- Modal con overlay -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div @click.stop>
      <ModalAddClient
          @close="closeModal"
          @client-added="handleClientAdded"
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

h1{
  color: var(--text-color);
}

.clients-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 30px;
}

.client-card {
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.client-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.local-client {
  border: 2px solid #4CAF50;
  background: linear-gradient(135deg, var(--bg-secondary-color) 0%, rgba(76, 175, 80, 0.1) 100%);
}

.local-client.inactive {
  border: 2px solid #f44336;
  background: linear-gradient(135deg, var(--bg-secondary-color) 0%, rgba(244, 67, 54, 0.1) 100%);
}
.client-info {
  margin-bottom: 15px;
}

.client-name {
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

.client-email {
  font-size: 14px;
  color: var(--primary-color);
  margin: 5px 0;
  font-weight: 500;
}

.client-phone,
.client-company {
  font-size: 13px;
  color: var(--text-color);
  margin: 5px 0;
  opacity: 0.8;
}

.client-status {
  font-size: 12px;
  color: var(--text-color);
  margin: 5px 0;
  opacity: 0.7;
}

.client-actions {
  display: flex;
  justify-content: flex-end;
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

.no-clients {
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

.no-clients p {
  font-size: 18px;
  margin: 0;
}

.modal-overlay {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.client-card {
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

  .clients-container {
    grid-template-columns: 1fr;
    padding: 15px;
    gap: 15px;
  }

  .error-message {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>