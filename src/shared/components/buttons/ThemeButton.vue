<script>
import GenericButton from "@shared/components/buttons/GenericButton.vue";

export default {
  name: "ThemeButton",
  components: { GenericButton },
  data() {
    return {
      isDark: false
    };
  },
  created() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.isDark = storedTheme === 'dark';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
    },
    applyTheme() {
      const theme = this.isDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }
}
</script>

<template>
  <GenericButton link="" variant="tools" @click="toggleTheme">
    <span v-if="isDark">🌙</span>
    <span v-else>🌞</span>
  </GenericButton>
</template>

<style scoped>
</style>