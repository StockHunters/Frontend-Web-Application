<script>
export default {
  name: "TemplateAuth"
}
</script>

<template>

  <div class="auth-container" aria-label="authentication container">

    <div class="form-container" aria-label="authentication form container">
      <slot name="form"/>
    </div>

    <div class="image-container" aria-label="authentication image container">
      <slot name="image"/>
    </div>

  </div>

</template>

<style scoped>

.auth-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  height: 100%;
  gap: 5rem;
}

.form-container{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--bg-secondary-color);
  color: var(--text-color);
  padding: 2rem 3rem;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.image-container {
  color: var(--text-color);
}

@media screen and (max-width: 800px ) {
  .auth-container {
    flex-direction: column;
  }
  .image-container {
    display: none;
  }
}

@media screen and (max-width: 320px ) {
  .form-container {
    width: 80%;
  }
}

</style>