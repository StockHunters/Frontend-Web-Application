<script>
import HeaderAuth from "@shared/components/header/HeaderAuth.vue";
import Footer from "@shared/components/footer/Footer.vue";

export default {
  name: "AuthLayout",
  components: {Footer, Header: HeaderAuth}
}
</script>

<template>
  <div class="auth-layout layout">
    <Header aria-label="header from authentication" />

    <main aria-label="main from authentication">
      <RouterView/>
    </main>

    <Footer aria-label="footer from authentication" />
  </div>
</template>

<style scoped>

</style>