<script>
import {ClientAssembler} from "@/sales/services/client.assembler.js";
import {clientService} from "@/sales/services/client.services.js";
import GenericButton from "@shared/components/buttons/GenericButton.vue";

export default {
  name: "ClientItem",
  components: {GenericButton},
  props: {
    clientId: { type: String, required: true }
  },
  data(){
    return{
      client: ''
    }
  },
  methods: {
    async getClient(){
      let client = await clientService.getById(this.clientId);
      try {
        this.client = ClientAssembler.toClient(client);
      }
      catch(err){
        console.log(err);
      }
    }
  },

  mounted() {
    this.getClient();
  }
}
</script>

<template>
  <div class="client-item">

    <div class="client-content" aria-label="content container from client">

      <p class="client-name"
         :aria-label="`tag name from ` + this.client.firstName"> {{this.client.firstName}} </p>

    </div>

    <GenericButton
        link="" variant="color"> {{$t('ui.button.more')}}</GenericButton>

  </div>
</template>

<style scoped>

.client-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  background-color: var(--bg-secondary-color);
  gap: 20px;
  color: var(--text-color);
  min-width: 150px;
  max-width: 120px;
  padding: 15px;
  border-radius: 5px;
}

.client-content{
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>