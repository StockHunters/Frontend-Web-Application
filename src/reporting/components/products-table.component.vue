<script>
export default {
  name: "ProductsTable",
  props: {
    products: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: value => ['top', 'bottom'].includes(value)
    }
  }
};
</script>

<template>
  <div class="products-table-container">
    <h3>{{ title }}</h3>

    <div class="table-content">
      <table class="products-table">
        <tbody>
        <tr
            v-for="product in products"
            :key="product.name"
            class="product-row"
        >
          <td class="product-name">{{ product.name }}</td>
          <td class="product-quantity">{{ product.quantity }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.products-table-container {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.products-table-container h3 {
  margin: 0 0 20px 0;
  color: var(--text-color);
  font-weight: 600;
  font-size: 18px;
}

.table-content {
  width: 100%;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.product-row {
}

.product-row:last-child {
  border-bottom: none;
}

.product-name {
  padding: 12px 0;
  color: var(--text-color);
  font-weight: 500;
}

.product-quantity {
  padding: 12px 0;
  text-align: right;
  font-weight: 600;
}

.product-row:hover {
}
</style>