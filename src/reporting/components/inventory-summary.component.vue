<script>
import Button from 'primevue/button';

export default {
  name: "InventorySummary",
  components: {
    Button
  },
  props: {
    totalInventory: {
      type: Number,
      required: true
    }
  },
  methods: {
    downloadPDF() {
      console.log('Descargando PDF...');
      this.$emit('download-pdf');
    }
  }
};
</script>

<template>
  <div class="inventory-summary-container">
    <h3>Inventario General</h3>

    <div class="summary-content">
      <div class="inventory-count">
        <span class="count-number">{{ totalInventory }}</span>
        <span class="count-label">Productos</span>
      </div>

      <div class="download-section">
        <Button
            label="Descargar como PDF"
            icon="pi pi-download"
            class="download-btn"
            @click="downloadPDF"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.inventory-summary-container {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.inventory-summary-container h3 {
  margin: 0 0 20px 0;
  color: var(--text-color);
  font-weight: 600;
  font-size: 18px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.inventory-count {
  text-align: center;
}

.count-number {
  display: block;
  font-size: 48px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.count-label {
  font-size: 18px;
  color: var(--text-color);
  font-weight: 500;
}

.download-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.download-btn {
  background-color: var(--blue-200);
  border: none;
  padding: 12px 24px;
  font-weight: 600;
  min-width: 200px;
}

.download-btn:hover {
  background-color: var(--blue-600);
}
</style>