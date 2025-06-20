<script>
import ThemeButton from "@shared/components/buttons/ThemeButton.vue";
import LanguageButton from "@shared/components/buttons/LanguageButton.vue";

export default {
  name: "SessionLayout",
  components: {LanguageButton, ThemeButton}
}
</script>

<template>
  <div class="session-layout layout">
    <header class="layout-bar" aria-label="header from session" >
      <ThemeButton aria-label="theme button" ></ThemeButton>
      <language-button aria-label="language button" ></language-button>
    </header>
    <main aria-label="main from session">
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>

</style>