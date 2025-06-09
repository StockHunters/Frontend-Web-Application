<script>
import Button from "@shared/components/buttons/GenericButton.vue";
import LanguageButton from "@shared/components/buttons/LanguageButton.vue";
import ThemeButton from "@shared/components/buttons/ThemeButton.vue";

export default {
  name: "HeaderAuth",
  components: {ThemeButton, LanguageButton, Button}
}
</script>

<template>
  <header class="layout-bar">

    <div class="header-left-side" >
      <Button link="/" variant="none" custom-class="logo-link">
        <img src="/Isotipo_white.png" alt="StockHunter icon" class="header-logo">
        <p>StockHunters</p>
      </Button>
    </div>

    <div class="header-right-side">
      <nav>
        <Button
            link="/auth/signup"
        > {{ $t('ui.button.signup') }} </Button>

        <Button
            link="/auth/login"
            variant="header"
        > {{ $t('ui.button.auth') }}</Button>
      </nav>

      <div class="header-tools-button">
        <ThemeButton/>
        <LanguageButton/>
      </div>
    </div>
  </header>
</template>

<style scoped>
@media screen and (max-width: 590px){
  .logo-link > p{
    display: none;
  }
}

@media screen and (max-width: 420px){
  .header-right-side > nav{
    display: none;
  }
}
</style>