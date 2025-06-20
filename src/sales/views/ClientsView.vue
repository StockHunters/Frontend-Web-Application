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
      clients: []
    }
  },
  methods: {
    tSales,
    async fetchClients() {
      try {
        const response = await clientService.getAll();
        this.clients = await ClientAssembler.toEntityFromResponse(response);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    },
  },
  mounted() {
    this.fetchClients();
  }
}
</script>

<template>
  <div class="title-container">
    <h1>{{tSales('clients.title')}}</h1>
    <GenericButton link="" icon="plusCircle"></GenericButton>
  </div>


  <div class="clients-container">
    <ClientItem
        v-for="client in clients"
        :key="client.id"
        :client-id="client.id"
    />
  </div>
  <ModalAddClient></ModalAddClient>

</template>

<style scoped>
.title-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: var(--primary-color) 1px solid;
  padding: 10px;
}

h1{
  color: var(--text-color);
}

.clients-container {
  display: flex;
  padding: 30px;
  gap: 20px;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}


</style>