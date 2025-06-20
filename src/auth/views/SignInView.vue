<script>
// Sign In || Login - Iniciar Sesión
import TemplateAuth from "@/auth/components/TemplateAuth.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import {tAuth} from "@shared/i18n/i18n.js";
import { SignInForm } from "@/auth/composables/useSignInForm.js";
import SvgIcon from "@shared/lib/svg/SvgIcon.vue";

export default {
  name: "SignInView",
  components: {SvgIcon, GenericButton, TemplateAuth},
  data(){
    return {
      email: "",
      password: "",
      erros: {}
    }
  },
  methods: {
    tAuth,

    async handleSubmit(){
      const form = new SignInForm({
        email: this.email,
        password: this.password,
      });

       const result = await form.login();

      if (result && result.error) {
        this.erros = result.error;
      } else {
        this.erros = {};
      }
    }
  },
}
</script>

<template>

  <TemplateAuth aria-label="authentication form">
    <template #form>
      <h2>{{tAuth('login.title')}}</h2>

      <form @submit.prevent="handleSubmit">
        <input type="email"
               v-model="email"
               :placeholder="$t('ui.form.placeholder.mail')"
               aria-label="email input" />

        <p v-if="erros.email" class="error-message">
          <SvgIcon name="warning"/> {{ erros.email }}</p>


        <input type="password"
               v-model="password"
               :placeholder="$t('ui.form.placeholder.password')"
               aria-label="password input"/>

        <p v-if="erros.password" class="error-message">
          <SvgIcon name="warning"/> {{erros.password }} </p>

        <p v-if="erros.login" class="error-message">
          <SvgIcon name="warning"/> {{ erros.login }}</p>

        <GenericButton link=""
                       type="submit"
                       variant="color"
                       aria-label="submit button"> {{$t('ui.form.submit')}}</GenericButton>
      </form>

      <GenericButton link=""
                     variant="outline"
                     icon="google"
                     aria-label="google button"> {{$t('ui.button.google')}} </GenericButton>
    </template>

    <template #image>
      <img src="@shared/assets/svgs/login.svg" width="400px" alt="login svg" aria-label="login image">
    </template>
  </TemplateAuth>

</template>

<style scoped>
</style>