<script>
import UserItem from "@/auth/components/UserItem.vue";

export default {
  name: "UserLoginCard",
  components: {UserItem},
  props: {
    userId: { type: Number, required: true },
    username: { type: String, required: true },
    userimage: { type: String, required: true },
    role: { type: String, required: true }
  },
  data() {
    return {
      password: ''
    };
  },
  methods: {
    submitLogin() {
      this.$emit("login", {
        userId: this.userId,
        password: this.password
      });
    }
  }
}
</script>

<template>
  <div class="user-login-card">

    <UserItem
        :username="username"
        :userimage="userimage"
        :role="role"
        :userId="userId"/>
//asdd
    <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        class="password-input"
    />

    <button @click="submitLogin" class="login-button">
      Ingresar
    </button>
  </div>
</template>

<style scoped>
.user-login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--border-color, #ff23);
  border-radius: 8px;
  padding: 1rem;
  width: 250px;
  gap: 0.75rem;
  background-color: var(--card-bg, #ff23);
}

.password-input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.login-button {
  background-color: var(--primary-color, #ff23);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.login-button:hover {
  background-color: var(--primary-dark, #ff23);
}
</style>