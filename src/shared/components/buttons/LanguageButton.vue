<script>
import GenericButton from "@shared/components/buttons/GenericButton.vue";

export default {
  name: "LanguageButton",
  components: { GenericButton },
  computed: {
    currentLocale() {
      return this.$i18n.locale;
    }
  },
  methods: {
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'es' : 'en';
    }
  }
}
</script>

<template>
  <GenericButton
      link=""
      @click="toggleLanguage"
      variant="tools"
      custom-class="language-button"> 🌐 {{ currentLocale.toUpperCase() }} </GenericButton>
</template>

<style scoped>
.language-button {
  width: auto;
}
</style>