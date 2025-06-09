<script>
import GenericButton from "@shared/components/buttons/GenericButton.vue";
export default {
  name: "Footer",
  components: {Button: GenericButton}
}
</script>

<template>
  <footer class="layout-bar">
    <div class="footer-left-side">
      <p>{{ $t(`shared.footer.phone`) }}: +51 999 999 999 </p>
      <p>{{ $t(`shared.footer.mail`) }}: stockhunters@services.com</p>
    </div>

    <div class="footer-right-side">
      <Button link="https://www.facebook.com/" target="_blank" external variant="link" icon="facebook"></Button>
      <Button link="https://www.instagram.com/" target="_blank" external variant="link" icon="instagram"></Button>
      <Button link="https://x.com/" target="_blank" external variant="link" icon="x"></Button>
    </div>
  </footer>
</template>

<style scoped>
footer{
  font-size: 0.8rem;
  padding: 2rem;
}

.footer-left-side,
.footer-right-side{
  display: flex;
  gap: 5px;
}

.footer-left-side {
  flex-direction: column;
}

.footer-right-side {
  flex-direction: row;
}

a {
  padding: 0;
}

@media screen and (max-width: 430px){
footer{
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
}
}

</style>