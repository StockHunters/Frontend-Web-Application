<script>
import ThemeButton from "@shared/components/buttons/ThemeButton.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import LanguageButton from "@shared/components/buttons/LanguageButton.vue";

export default {
  name: "NotFound",
  components: {LanguageButton, GenericButton, ThemeButton}
}
</script>

<template>
  <div class="button" aria-label="Tools toggle button">
    <ThemeButton></ThemeButton>
    <LanguageButton></LanguageButton>
  </div>

  <div class="container" aria-label="404 error page content">
    <div class="emoji" aria-label="emoji from error page">😔</div>
    <h1 aria-label="title from error page" >{{$t('shared.notfound.title')}}</h1>
    <h2 aria-label="subtitle from error page" >{{$t('shared.notfound.subtitle')}}</h2>
    <p aria-label="content from error page" > ⚠️ {{$t('shared.notfound.content')}}</p>

    <GenericButton aria-label="button from error page" link="/">{{$t('shared.notfound.button')}}</GenericButton>
  </div>
</template>

<style scoped>

.button{
  display: flex;
  height: 20px;
  position: absolute;
  top: 20px;
  right: 20px;
}

body {
  color: var(--text-color);
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100dvh;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0;
  padding: 40px;
  color: var(--text-color);
}
h1 {
  font-size: 6rem;
  color: var(--error-color);
  margin: 0;
}

h2 {
  font-size: 1.5rem;
  margin: 20px 0;
}

p {
  font-size: 1rem;
  max-width: 500px;
  padding-bottom: 20px;
}

.emoji {
  font-size: 8rem;
}

</style>