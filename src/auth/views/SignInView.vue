<script>
// Sign In || Login - Iniciar Sesión
import TemplateAuth from "@/auth/components/TemplateAuth.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import {tAuth} from "@shared/i18n/i18n.js";

export default {
  name: "SignInView",
  methods: {tAuth},
  components: {GenericButton, TemplateAuth}
}
</script>

<template>

  <TemplateAuth aria-label="authentication form">
    <template #form>
      <h2>{{tAuth('login.title')}}</h2>

      <form action="">
        <input type="email"  :placeholder="$t('ui.form.placeholder.mail')" aria-label="email input" />
        <input type="password" :placeholder="$t('ui.form.placeholder.password')" aria-label="password input"/>
      </form>

      <GenericButton link="/app"
                     variant="color"
                     aria-label="submit button"> {{$t('ui.form.submit')}}</GenericButton>

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