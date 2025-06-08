<script>
import HeaderApp from "@shared/components/header/HeaderApp.vue";

export default {
  name: "AppLayout",
  components: {Header: HeaderApp}
}
</script>

<template>
  <div class="app-layout layout">
    <Header/>

    <main>
      <RouterView/>
    </main>

  </div>
</template>

<style scoped>

</style>