<script>
import Card from 'primevue/card';
import Button from 'primevue/button';

export default {
  name: "product-card.component",
  components: {
    Card,
    Button
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      showDetails: false
    };
  },
  methods:{
    toggleDetails(){
      this.showDetails = !this.showDetails;
    }
  }
};
</script>

<template>
  <Card style="width: 20em">
    <template #header>
      <img :src="product.image_url" :alt="product.name" style="width: 100%; height: auto;" />
    </template>

    <template #title>
      {{ product.name }}
    </template>

    <template #content>
      <p>Precio: s/. {{ Number(product.price || 0).toFixed(2) }}</p>

      <Button :label="showDetails ? 'Ocultar detalles' : 'Ver detalles'" @click="toggleDetails" />

      <div v-if="showDetails">
        <p>{{ product.description }}</p>
        <p><strong>Categoría:</strong> {{ product.category }}</p>
        <p><strong>Stock:</strong> {{ product.stock }}</p>
        <p><strong>Lote:</strong> {{ product.batch }}</p>

        <div v-if="product.stock_by_location">
          <p><strong>Stock por ubicación:</strong></p>
          <ul>
            <li v-for="(stock, location) in product.stock_by_location" :key="location">
              {{ location }}: {{ stock }}
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
/* Puedes añadir estilos personalizados aquí si lo deseas */
</style>
