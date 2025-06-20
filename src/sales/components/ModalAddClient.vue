<script>
import DropdownButton from "@shared/components/buttons/DropdownButton.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import {tSales} from "@shared/i18n/i18n.js";
import {clientService} from "@/sales/services/client.services.js";

export default {
  name: "ModalAddClient",
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
    },
    async handleSubmit() {
      const clientData = {
        firstname: this.firstname,
        lastname: this.lastname,
        dni: this.dni,
        email: this.email,
        phone: this.phone,
        status: this.status,
        company: this.company,
      };

      console.log(clientData);


    },

    dropDownSelect(label){
      this.status = label;
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
    <GenericButton custom-class="btn-close" link="" icon="close"/>
    <h2>{{ tSales('clients.modal.title') }}</h2>

    <form @submit.prevent="handleSubmit">
      <input v-model="firstname"
             type="text"
             :placeholder="$t('ui.form.placeholder.name')">

      <input v-model="lastname"
             type="text"
             :placeholder="$t('ui.form.placeholder.lastname')">

      <input v-model="dni"
             type="number"
             :placeholder="$t('ui.form.placeholder.dni')">

      <input v-model="email"
             type="email"
             :placeholder="$t('ui.form.placeholder.mail')">

      <input v-model="phone"
             type="tel"
             :placeholder="$t('ui.form.placeholder.phone')">

      <DropdownButton v-model="status" :items="Items">
        {{$t('ui.form.placeholder.status')}}
      </DropdownButton>

      <input v-model="company"
             type="text"
             :placeholder="$t('ui.form.placeholder.company')">

      <GenericButton type="submit" link=""> Guardar </GenericButton>
    </form>
  </div>
</template>

<style scoped>
.client-modal {
  color: var(--text-color);
  position: relative;
  width: 30%;
  border-radius: 5px;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: var(--bg-secondary-color);
}

.btn-close{
  position: absolute;
  top: 20px;
  right: 20px;
}

</style>