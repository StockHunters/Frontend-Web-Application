<template>
  <TemplateAuth aria-label="authentication form">
    <!-- ----------------  FORM ---------------- -->
    <template #form>
      <h2>{{ tAuth('login.title') }}</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Email -->
        <input
            type="email"
            v-model="email"
            :placeholder="$t('ui.form.placeholder.mail')"
            aria-label="email input"
        />
        <p v-if="errors.email" class="error-message">
          <SvgIcon name="warning" /> {{ errors.email }}
        </p>

        <!-- Password -->
        <input
            type="password"
            v-model="password"
            :placeholder="$t('ui.form.placeholder.password')"
            aria-label="password input"
        />
        <p v-if="errors.password" class="error-message">
          <SvgIcon name="warning" /> {{ errors.password }}
        </p>

        <!-- Login error -->
        <p v-if="errors.login" class="error-message">
          <SvgIcon name="warning" /> {{ errors.login }}
        </p>

        <!-- Submit -->
        <GenericButton
            link=""
            type="submit"
            variant="color"
            aria-label="submit button"
        >
          {{ $t('ui.form.submit') }}
        </GenericButton>
      </form>

      <!-- Google button (placeholder) -->
      <GenericButton
          link=""
          variant="outline"
          icon="google"
          aria-label="google button"
      >
        {{ $t('ui.button.google') }}
      </GenericButton>
    </template>

    <!-- ----------------  IMAGE ---------------- -->
    <template #image>
      <img
          src="@shared/assets/svgs/login.svg"
          width="400"
          alt="login svg"
          aria-label="login image"
      />
    </template>
  </TemplateAuth>
</template>

<script>
// SignInView.vue
import TemplateAuth   from '@/auth/components/TemplateAuth.vue';
import GenericButton  from '@shared/components/buttons/GenericButton.vue';
import SvgIcon        from '@shared/lib/svg/SvgIcon.vue';
import { tAuth }      from '@shared/i18n/i18n.js';
import { SignInForm } from '@/auth/composables/useSignInForm.js';

export default {
  name: 'SignInView',
  components: { TemplateAuth, GenericButton, SvgIcon },

  data () {
    return {
      email: '',
      password: '',
      errors: {}
    };
  },

  methods: {
    tAuth,

    async handleSubmit () {
      const form = new SignInForm({
        email: this.email,
        password: this.password
      });

      const result = await form.login();

      this.errors = result?.error || {};
    }
  }
};
</script>

<style scoped>
/* si ya tienes estilos globales para .error-message, no repitas */
.error-message {
  color: #e65c5c;
  font-size: 0.85rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
