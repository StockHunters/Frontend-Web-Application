<script>
import UserItem from "@/auth/components/UserItem.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import UserLoginCard from "@/auth/components/UserLoginCard.vue";

import { tAuth } from "@shared/i18n/i18n.js";
import {userService} from "@/auth/services/user.services.js";

export default {
  name: "SessionView",
  components: {
    UserLoginCard,
    GenericButton,
    UserItem
  },

  methods: {
    tAuth,
    async fetchUsers() {
      try {
        const response = await userService.getAll({ organization_id: this.id });
        console.log(response);
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    redirect(){
      this.$router.push("/app");
    }
  },

  data() {
    return {
      ORG_NAME: '',
      open: false,
      selectedUser: null,
      id: localStorage.getItem("org_id"),
      users: []
    }
  },

  mounted() {
    this.fetchUsers();
  }
}

</script>

<template>
  <div class="session-container">

    <div class="info-container">
      <img src="/Isotipo_color.png" alt="organization icon">
      <h2> {{tAuth('session.title') + `, ` + ORG_NAME }} </h2>
      <p> {{tAuth('session.subtitle')}} </p>
    </div>

    <div class="users-container">

      <UserItem
          v-for="user in users"
          :key="user.id"
          :userId="user.id"
          @click.prevent="redirect"
      />

    </div>

    <div v-if="open" class="modal-auth">
      <GenericButton link="" icon="github"> </GenericButton>
    </div>

  </div>
</template>

<style scoped>

.session-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
}

.info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: var(--text-color);
  gap: 1rem;
}

.info-container > img {
  width:6rem;
}

.users-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  gap: 1.5rem;
  align-items: center;
}

.modal-auth{
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>