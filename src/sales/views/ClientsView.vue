<script>
import { tSales } from "@shared/i18n/i18n.js";
import ClientItem from "@/sales/components/ClientItem.vue";
import { clientService } from "@/sales/services/client.services.js";
import { ClientAssembler } from "@/sales/services/client.assembler.js";
import DropdownButton from "@shared/components/buttons/DropdownButton.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import ModalAddClient from "@/sales/components/ModalAddClient.vue";
import { ClientEntity } from "@/sales/model/client.entity.js";

export default {
  name: "ClientsView",
  components: { ModalAddClient, GenericButton, DropdownButton, ClientItem },

  data() {
    return {
      clients: [],
      localClients: [],
      showModal: false,
      isLoading: false,
      error: null,
      searchQuery: '',
      apiConnected: false,
      connectionTested: false,
      apiInfo: null
    }
  },

  computed: {
    filteredClients() {
      if (!this.searchQuery) return this.clients;

      return this.clients.filter(client =>
          client.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          client.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (client.company && client.company.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
  },

  methods: {
    tSales,

    loadLocalClients() {
      const stored = localStorage.getItem('local_clients');
      if (stored) {
        try {
          const parsedClients = JSON.parse(stored);
          this.localClients = parsedClients.map(c => new ClientEntity(
              c.id, c.firstName, c.lastName, c.phone, c.email,
              c.registration_date, c.dni, c.status, c.company, c.created_at
          ));
          console.log('📦 Clientes locales cargados:', this.localClients.length);
        } catch (error) {
          console.error('❌ Error al cargar clientes locales:', error);
          this.localClients = [];
        }
      }
    },

    saveLocalClients() {
      const clientsToSave = this.localClients.map(c => c.toJson());
      localStorage.setItem('local_clients', JSON.stringify(clientsToSave));
      console.log('💾 Clientes locales guardados:', this.localClients.length);
    },

    async testApiConnection() {
      console.log('🔍 Probando conexión a tu fake API de clientes...');
      this.connectionTested = true;

      try {
        this.apiInfo = await clientService.getApiInfo();
        console.log('📊 Información de tu API de clientes:', this.apiInfo);

        const isConnected = await clientService.testConnection();
        this.apiConnected = isConnected;

        if (isConnected) {
          console.log('✅ Tu fake API de clientes está funcionando correctamente');
          this.error = null;
        } else {
          console.log('❌ No se pudo conectar a tu fake API de clientes');
          this.error = "No se pudo conectar a tu fake API de clientes. Usando modo local.";
        }

        return isConnected;
      } catch (error) {
        console.error('❌ Error al probar conexión:', error);
        this.apiConnected = false;
        this.error = `Error de conexión: ${error.message}`;
        return false;
      }
    },

    async fetchClients() {
      try {
        this.isLoading = true;
        this.error = null;

        this.loadLocalClients();

        const isConnected = await this.testApiConnection();

        if (isConnected) {
          try {
            console.log('🔄 Obteniendo clientes de tu fake API...');
            const response = await clientService.getAll();
            const apiClients = await ClientAssembler.toEntityFromResponse(response);

            console.log('✅ Clientes cargados desde tu API:', apiClients.length);
            console.log('📦 Clientes locales agregados:', this.localClients.length);

            this.clients = [...apiClients, ...this.localClients];

          } catch (apiError) {
            console.warn('❌ Error al obtener clientes de tu API:', apiError);
            this.apiConnected = false;
            this.clients = this.localClients;
            this.error = `Error al cargar clientes de tu API: ${apiError.message}`;
          }
        } else {
          this.clients = this.localClients;
          this.error = "Sin conexión a tu fake API de clientes. Mostrando clientes guardados localmente.";
        }

        console.log('📊 Total clientes mostrados:', this.clients.length);

      } catch (error) {
        console.error("❌ Error general:", error);
        this.error = `Error al cargar clientes: ${error.message}`;
        this.apiConnected = false;
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

      const clientEntity = new ClientEntity(
          newClient.id,
          newClient.firstName,
          newClient.lastName,
          newClient.phone,
          newClient.email,
          newClient.registration_date,
          newClient.dni,
          newClient.status,
          newClient.company,
          newClient.created_at
      );

      if (newClient.isLocal) {
        clientEntity.isLocal = true;
        this.localClients.push(clientEntity);
        this.saveLocalClients();
      }

      this.clients.unshift(clientEntity);
      this.closeModal();

      console.log('✅ Cliente añadido exitosamente a la lista');
      console.log('Clientes totales ahora:', this.clients.length);
    },

    async refreshClients() {
      console.log('🔄 Refrescando clientes desde tu API...');
      await this.fetchClients();
    },

    clearError() {
      this.error = null;
    },

    clearLocalClients() {
      this.localClients = [];
      localStorage.removeItem('local_clients');
      this.fetchClients();
      console.log('🗑️ Clientes locales eliminados');
    },

    async deleteClient(clientId) {
      if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
        return;
      }

      try {
        if (this.apiConnected && !clientId.toString().startsWith('local_')) {
          console.log('🗑️ Eliminando cliente de tu API:', clientId);
          await clientService.delete(clientId);
          console.log('✅ Cliente eliminado de tu API');
        } else {
          console.log('🗑️ Eliminando cliente local:', clientId);
          this.localClients = this.localClients.filter(c => c.id !== clientId);
          this.saveLocalClients();
        }

        this.clients = this.clients.filter(c => c.id !== clientId);
        console.log('✅ Cliente eliminado exitosamente');

      } catch (error) {
        console.error('❌ Error al eliminar cliente:', error);
        this.error = 'Error al eliminar el cliente. Intenta nuevamente.';
      }
    },

    getConnectionStatus() {
      if (!this.connectionTested) return '⏳ Conectando...';
      return this.apiConnected ? '🟢' : '🔴';
    },

    async forceApiTest() {
      console.log('🔧 Forzando prueba de tu fake API de clientes...');
      await this.testApiConnection();
      if (this.apiConnected) {
        await this.fetchClients();
      }
    }
  },

  mounted() {
    this.fetchClients();
  }
}
</script>

<template>
  <div class="title-container">
    <h1>{{ tSales('clients.title') }} <span class="connection-status">{{ getConnectionStatus() }}</span></h1>
    <div class="button-group">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar clientes..."
          class="search-input"
      />



      <GenericButton
          link=""
          variant="secondary"
          @click="refreshClients"
          :disabled="isLoading"
      >
        🔄 {{ isLoading ? 'Cargando...' : 'Actualizar' }}
      </GenericButton>

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
    <p>Cargando datos...</p>
  </div>

  <div v-else class="clients-container">
    <div
        v-for="client in filteredClients"
        :key="client.id"
        class="client-card"
        :class="{
          'local-client': client.isLocal,
          'api-client': !client.isLocal && apiConnected,
          'inactive': !client.isActive
        }"
    >
      <div class="client-info">
        <h3 class="client-name">
          {{ client.firstName }} {{ client.lastName }}
        </h3>
        <p class="client-email">{{ client.email }}</p>
        <p class="client-phone" v-if="client.phone">📞 {{ client.phone }}</p>
        <p class="client-dni" v-if="client.dni">🆔 {{ client.dni }}</p>
        <p class="client-company" v-if="client.company">🏢 {{ client.company }}</p>
        <p class="client-status" :class="{ 'active': client.isActive, 'inactive': client.isInactive }">
          Estado: {{ client.status }}
        </p>
      </div>

      <div class="client-actions">
        <button
            @click="deleteClient(client.id)"
            class="delete-button"
            title="Eliminar cliente"
        >
          🗑️
        </button>

        <GenericButton
            link=""
            variant="color"
        >
          {{ $t('ui.button.more') }}
        </GenericButton>
      </div>
    </div>

    <div v-if="filteredClients.length === 0 && !isLoading" class="no-clients">
      <p>{{ searchQuery ? 'No se encontraron clientes' : 'No hay clientes registrados' }}</p>
      <GenericButton
          link=""
          variant="primary"
          @click="openModal"
      >
        {{ searchQuery ? 'Limpiar búsqueda' : 'Agregar primer cliente' }}
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

.debug-info {
  background: var(--bg-secondary-color);
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  font-size: 13px;
  color: var(--text-color);
  border-left: 4px solid var(--primary-color);
}

.debug-info h4 {
  margin: 0 0 10px 0;
  color: var(--primary-color);
}

.debug-info p {
  margin: 5px 0;
}

.debug-info pre {
  background: var(--bg-primary-color);
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 11px;
  max-height: 200px;
  overflow-y: auto;
}

.debug-info details {
  margin-top: 10px;
}

.debug-info summary {
  cursor: pointer;
  font-weight: bold;
  color: var(--primary-color);
}

.clients-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 30px;
}

.client-card {
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  gap: 15px;
  position: relative;
}

.client-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.local-client {
  border: 2px solid #4CAF50;
  background: linear-gradient(135deg, var(--bg-secondary-color) 0%, rgba(76, 175, 80, 0.1) 100%);
}

.api-client {
  border: 2px solid #2196F3;
  background: linear-gradient(135deg, var(--bg-secondary-color) 0%, rgba(33, 150, 243, 0.1) 100%);
}

.client-card.inactive {
  border-left: 4px solid #f44336;
  opacity: 0.7;
}

.client-info {
  flex: 1;
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

.client-email {
  font-size: 14px;
  color: var(--primary-color);
  margin: 5px 0;
  font-weight: 500;
}

.client-phone,
.client-dni,
.client-company {
  font-size: 13px;
  color: var(--text-color);
  margin: 5px 0;
  opacity: 0.8;
}

.client-status {
  font-size: 13px;
  margin: 5px 0;
  font-weight: 500;
}

.client-status.active {
  color: #4CAF50;
}

.client-status.inactive {
  color: #f44336;
}

.client-actions {
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
    flex-wrap: wrap;
    gap: 5px;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .clients-container {
    grid-template-columns: 1fr;
    padding: 15px;
    gap: 15px;
  }

  .client-card {
    flex-direction: column;
  }

  .client-actions {
    flex-direction: row;
    justify-content: space-between;
  }

  .debug-info {
    margin: 5px;
    padding: 10px;
  }

  .error-message {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
