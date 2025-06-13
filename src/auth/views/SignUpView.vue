<script>
// Sign Up - Registrarse
import TemplateAuth from "@/auth/components/TemplateAuth.vue";
import {tAuth} from "@shared/i18n/i18n.js";
import GenericButton from "@shared/components/buttons/GenericButton.vue";

export default {
  name: "SignUpView",
  methods: {tAuth},
  components: {GenericButton, TemplateAuth}
}
</script>

<template>

  <TemplateAuth aria-label="authentication form">

    <template #form>
      <h2>{{tAuth('signup.title')}}</h2>

      <form action="" class="form">
        <input type="text"  :placeholder="$t('ui.form.placeholder.name')" aria-label="name input"/>
        <input type="text"  :placeholder="$t('ui.form.placeholder.lastname')" aria-label="lastname input"/>
        <input type="email"  :placeholder="$t('ui.form.placeholder.mail')" aria-label="email input"/>
        <input type="password" :placeholder="$t('ui.form.placeholder.password')" aria-label="password input"/>
      </form>

      <GenericButton link="/app"
                     variant="color"
                     aria-label="submit button"> {{$t('ui.form.submit')}}</GenericButton>

      <GenericButton link=""
                     variant="outline"
                     icon="google"
                     aria-label="access with google"> {{$t('ui.button.google')}} </GenericButton>
    </template>

    <template #image>
      <img src="@shared/assets/svgs/login.svg" width="400px" alt="login svg" aria-label="login image">
    </template>
  </TemplateAuth>

</template>

<style scoped>
</style>