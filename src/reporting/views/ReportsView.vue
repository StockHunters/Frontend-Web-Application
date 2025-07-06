<script>
import { onMounted } from 'vue';
import SalesChart from '@/reporting/components/sales-chart.component.vue';
import ProductsTable from '@/reporting/components/products-table.component.vue';
import InventorySummary from '@/reporting/components/inventory-summary.component.vue';
import { useReports } from '@/reporting/composables/useReports.js';
import GenericButton from "@shared/components/buttons/GenericButton.vue";

export default {
  name: "ReportsView",
  components: {
    SalesChart,
    ProductsTable,
    InventorySummary,
    GenericButton
  },
  setup() {
    const {
      loading,
      error,
      apiConnected,
      apiInfo,
      reportData,
      totalSales,
      totalTransactions,
      fetchReports,
      downloadPDF,
      refreshReports,
      clearLocalReports,
      getConnectionStatus,
      forceApiTest
    } = useReports();

    onMounted(async () => {
      await fetchReports();
    });

    const handleDownloadPDF = async () => {
      console.log("🔄 Iniciando descarga de PDF...");
      await downloadPDF();
    };

    const handleRefresh = async () => {
      await refreshReports();
    };

    const clearError = () => {
      error.value = null;
    };

    return {
      loading,
      error,
      apiConnected,
      apiInfo,
      reportData,
      totalSales,
      totalTransactions,
      handleDownloadPDF,
      handleRefresh,
      clearLocalReports,
      getConnectionStatus,
      forceApiTest,
      clearError
    };
  }
};
</script>

<template>
  <div class="title-container">
    <h1>Reports <span class="connection-status">{{ getConnectionStatus() }}</span></h1>
    <div class="button-group">

      <GenericButton
          link=""
          variant="secondary"
          @click="handleRefresh"
          :disabled="loading"
      >
        🔄 {{ loading ? 'Cargando...' : 'Actualizar' }}
      </GenericButton>

      <GenericButton
          link=""
          variant="secondary"
          @click="clearLocalReports"
      >
        🗑️ Limpiar
      </GenericButton>

      <GenericButton
          link=""
          variant="primary"
          @click="handleDownloadPDF"
      >
        📄 Descargar PDF
      </GenericButton>
    </div>
  </div>

  <div v-if="error" class="error-message">
    <p>{{ error }}</p>
    <GenericButton
        link=""
        variant="secondary"
        @click="clearError"
    >
      Cerrar
    </GenericButton>
  </div>


  <div v-if="loading" class="loading-container">
    <p>Cargando reportes...</p>
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
          title="🏆 Productos más vendidos"
          type="top"
      />

      <ProductsTable
          :products="reportData.bottomProducts"
          title="📉 Productos menos vendidos"
          type="bottom"
      />
    </div>

    <InventorySummary
        :total-inventory="reportData.totalInventory"
        @download-pdf="handleDownloadPDF"
    />
  </div>
</template>

<style scoped>
.title-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--primary-color) 1px solid;
  padding: 10px;
}

.connection-status {
  font-size: 14px;
  font-weight: normal;
  margin-left: 10px;
}

.button-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

h1 {
  color: var(--text-color);
}

.error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message p {
  margin: 0;
}

.debug-info {
  background: var(--bg-secondary-color);
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  font-size: 13px;
  color: var(--text-color);
  border-left: 4px solid var(--primary-color);
}

.debug-info h4 {
  margin: 0 0 10px 0;
  color: var(--primary-color);
}

.debug-info p {
  margin: 5px 0;
}

.debug-info pre {
  background: var(--bg-primary-color);
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 11px;
  max-height: 200px;
  overflow-y: auto;
}

.debug-info details {
  margin-top: 10px;
}

.debug-info summary {
  cursor: pointer;
  font-weight: bold;
  color: var(--primary-color);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  color: var(--text-color);
}

.reports-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
}

.products-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.api-sources {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
}

.api-source {
  background: var(--bg-primary-color);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.api-source h5 {
  margin: 0 0 8px 0;
  color: var(--primary-color);
  font-size: 14px;
}

.reports-summary {
  background: var(--bg-primary-color);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  margin-top: 15px;
}

.reports-summary h5 {
  margin: 0 0 8px 0;
  color: var(--primary-color);
  font-size: 14px;
}

@media (max-width: 768px) {
  .title-container {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .button-group {
    flex-wrap: wrap;
    gap: 5px;
    width: 100%;
  }

  .products-section {
    grid-template-columns: 1fr;
  }

  .debug-info {
    margin: 5px;
    padding: 10px;
  }

  .error-message {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .api-sources {
    grid-template-columns: 1fr;
  }

  .reports-content {
    padding: 15px;
  }
}
</style>
