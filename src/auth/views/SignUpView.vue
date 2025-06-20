<script>
// Sign Up - Registrarse
import TemplateAuth from "@/auth/components/TemplateAuth.vue";
import {tAuth} from "@shared/i18n/i18n.js";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import {SignUpForm} from "@/auth/composables/useSignUpForm.js";
import SvgIcon from "@shared/lib/svg/SvgIcon.vue";

export default {
  name: "SignUpView",
  components: {SvgIcon, GenericButton, TemplateAuth},
  data(){
    return {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      errors: {}
    }
  },
  methods: {tAuth,
    async fetchData(){
      const signUp = new SignUpForm({
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password
      });

      const result = await signUp.createUser();

      if (result && result.errors) {
        this.errors = result.errors;
      } else {
        this.errors = {};
      }
    }
  }

}
</script>

<template>

  <TemplateAuth aria-label="authentication form">

    <template #form>
      <h2>{{tAuth('signup.title')}}</h2>

      <form @submit.prevent="fetchData">
        <input type="text" v-model="firstname" :placeholder="$t('ui.form.placeholder.name')" aria-label="name input"/>
        <p v-if="errors.firstname" class="error-message">
          <SvgIcon name="warning"/> {{ errors.firstname }}</p>

        <input type="text" v-model="lastname"  :placeholder="$t('ui.form.placeholder.lastname')" aria-label="lastname input"/>
        <p v-if="errors.lastname" class="error-message">
          <SvgIcon name="warning"/> {{ errors.lastname }}</p>

        <input type="email"  v-model="email" :placeholder="$t('ui.form.placeholder.mail')" aria-label="email input"/>
        <p v-if="errors.email" class="error-message">
          <SvgIcon name="warning"/> {{ errors.email }}</p>

        <input type="password" v-model="password" :placeholder="$t('ui.form.placeholder.password')" aria-label="password input"/>
        <p v-if="errors.password" class="error-message">
          <SvgIcon name="warning"/> {{ errors.password }}</p>

        <GenericButton link=""
                       type="submit"
                       variant="color"
                       aria-label="submit button"> {{$t('ui.form.submit')}}</GenericButton>

      </form>



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