<script>
import { onMounted } from 'vue';
import SalesChart from '@/reporting/components/sales-chart.component.vue';
import ProductsTable from '@/reporting/components/products-table.component.vue';
import InventorySummary from '@/reporting/components/inventory-summary.component.vue';
import { useReports } from '@/reporting/composables/useReports.js';
import Button from 'primevue/button';

export default {
  name: "ReportsView",
  components: {
    SalesChart,
    ProductsTable,
    InventorySummary,
    Button
  },
  setup() {
    const {
      loading,
      error,
      reportData,
      totalSales,
      totalTransactions,
      fetchReports,
      downloadPDF,
      refreshReports,
      loadMockData
    } = useReports();

    onMounted(async () => {
      loadMockData();
    });

    const handleDownloadPDF = () => {
      downloadPDF();
    };

    const handleRefresh = async () => {
      await refreshReports();
    };

    return {
      loading,
      error,
      reportData,
      totalSales,
      totalTransactions,
      handleDownloadPDF,
      handleRefresh
    };
  }
};
</script>

<template>
  <div class="reports-container">
    <div class="title-container">
      <h1>Reports</h1>
      <Button
          icon="pi pi-refresh"
          label="Actualizar"
          @click="handleRefresh"
          :loading="loading"
      />
    </div>

    <div v-if="loading" class="loading-container">
      <p>Cargando reportes...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <Button label="Reintentar" @click="handleRefresh" />
    </div>

    <div v-else class="reports-content">
      <SalesChart
          :daily-sales="reportData.dailySales"
          :total-sales="totalSales"
          :total-transactions="totalTransactions"
      />

      <div class="products-section">
        <ProductsTable
            :products="reportData.topProducts"
            title="Productos más vendidos"
            type="top"
        />

        <ProductsTable
            :products="reportData.bottomProducts"
            title="Productos menos vendidos"
            type="bottom"
        />
      </div>

      <InventorySummary
          :total-inventory="reportData.totalInventory"
          @download-pdf="handleDownloadPDF"
      />
    </div>
  </div>
</template>

<style scoped>
.reports-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.title-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--primary-color) 1px solid;
  padding: 10px;
  margin-bottom: 30px;
}

.title-container h1 {
  color: var(--text-color);
  margin: 0;
  font-size: 32px;
  font-weight: 600;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

.loading-container p,
.error-container p {
  color: var(--text-color-secondary);
  font-size: 18px;
}

.reports-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.products-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .reports-container {
    padding: 10px;
  }

  .title-container {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .products-section {
    grid-template-columns: 1fr;
  }
}
</style>