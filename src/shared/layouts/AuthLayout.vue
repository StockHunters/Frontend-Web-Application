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
    <Header/>

    <main>
      <RouterView/>
    </main>

    <Footer/>
  </div>
</template>

<style scoped>

</style>